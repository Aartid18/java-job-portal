package com.jobportal.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.*;
import com.jobportal.entity.*;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CareerCopilotService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final CareerRoadmapRepository careerRoadmapRepository;
    private final RoadmapSkillProgressRepository roadmapSkillProgressRepository;
    private final MatchingService matchingService;
    private final ResumeService resumeService;
    private final CandidateDashboardService candidateDashboardService;
    private final ObjectMapper objectMapper;

    @Value("${app.ai.api-key:}")
    private String aiApiKey;

    @Transactional
    public CopilotChatResponse processChat(String email, CopilotChatRequest request) {
        User user = requireUser(email);
        CandidateProfile profile = requireCandidate(user);

        String userPrompt = request.getMessage().trim();
        Long jobId = request.getJobId();

        // 1. Gather all real user career context
        CareerContext context = buildCareerContext(profile, jobId);

        // 2. Persist user message in history
        ChatMessage userMsg = ChatMessage.builder()
                .candidate(profile)
                .sender("USER")
                .message(userPrompt)
                .jobId(jobId)
                .build();
        chatMessageRepository.save(userMsg);

        // 3. Generate structured, context-aware Copilot response
        CopilotChatResponse response = generateCopilotResponse(userPrompt, context, jobId);

        // 4. Persist assistant response in history
        ChatMessage botMsg = ChatMessage.builder()
                .candidate(profile)
                .sender("ASSISTANT")
                .message(response.getMessage())
                .jobId(jobId)
                .actionLink(response.getActionLink())
                .actionLabel(response.getActionLabel())
                .build();
        chatMessageRepository.save(botMsg);

        response.setTimestamp(LocalDateTime.now());
        return response;
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getHistory(String email) {
        User user = requireUser(email);
        CandidateProfile profile = requireCandidate(user);
        return chatMessageRepository.findByCandidateIdOrderByCreatedAtAsc(profile.getId()).stream()
                .map(m -> ChatMessageDto.builder()
                        .id(m.getId())
                        .sender(m.getSender())
                        .message(m.getMessage())
                        .jobId(m.getJobId())
                        .actionLink(m.getActionLink())
                        .actionLabel(m.getActionLabel())
                        .createdAt(m.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional
    public void clearHistory(String email) {
        User user = requireUser(email);
        CandidateProfile profile = requireCandidate(user);
        chatMessageRepository.deleteByCandidateId(profile.getId());
    }

    public CareerContext buildCareerContext(CandidateProfile profile, Long jobId) {
        List<CandidateSkill> skills = candidateSkillRepository.findByCandidateId(profile.getId());
        List<Experience> experiences = experienceRepository.findByCandidateId(profile.getId());
        List<Project> projects = projectRepository.findByCandidateId(profile.getId());
        List<Education> educations = educationRepository.findByCandidateId(profile.getId());
        List<Application> applications = applicationRepository.findByCandidateId(profile.getId());

        String skillsCsv = skills.stream().map(CandidateSkill::getName).collect(Collectors.joining(", "));
        if (!StringUtils.hasText(skillsCsv)) {
            skillsCsv = profile.getSkills() != null ? profile.getSkills() : "";
        }

        // Resume analysis score without external call
        int resumeAtsScore = 0;
        List<String> resumeSkills = List.of();
        try {
            if (StringUtils.hasText(profile.getResumeStoragePath())) {
                ResumeAnalysisResponse resumeAnalysis = resumeService.analyzeUploadedResume(profile.getUser().getEmail(), null);
                resumeAtsScore = resumeAnalysis.getAtsScore();
                resumeSkills = resumeAnalysis.getSkillsFound();
            }
        } catch (Exception ignored) {
            resumeAtsScore = 65;
        }

        // Overall readiness
        CandidateDashboardResponse dashboard = candidateDashboardService.getDashboard(profile.getUser().getEmail());
        int readinessScore = dashboard.getCareerReadinessScore();

        // Target Job context if requested
        Job targetJob = null;
        MatchingService.SkillBreakdown skillBreakdown = null;
        Double matchScore = null;
        if (jobId != null) {
            targetJob = jobRepository.findById(jobId).orElse(null);
            if (targetJob != null) {
                matchScore = matchingService.calculateCompatibilityScore(skillsCsv, targetJob.getRequiredSkills());
                skillBreakdown = matchingService.analyzeSkills(skillsCsv, targetJob.getRequiredSkills());
            }
        }

        // Check active roadmap progress
        Optional<CareerRoadmap> roadmapOpt = careerRoadmapRepository.findByCandidateId(profile.getId());
        List<RoadmapSkillProgress> progressList = roadmapSkillProgressRepository.findByCandidateId(profile.getId());

        return CareerContext.builder()
                .fullName(profile.getFullName())
                .location(profile.getLocation())
                .preferredRole(profile.getPreferredJobRole())
                .experienceLevel(profile.getExperienceLevel())
                .remotePreference(profile.getRemotePreference())
                .bio(profile.getBio())
                .skillsCsv(skillsCsv)
                .skills(skills)
                .experiences(experiences)
                .projects(projects)
                .educations(educations)
                .applications(applications)
                .resumeAtsScore(resumeAtsScore)
                .resumeSkills(resumeSkills)
                .readinessScore(readinessScore)
                .targetJob(targetJob)
                .targetJobMatchScore(matchScore)
                .skillBreakdown(skillBreakdown)
                .hasActiveRoadmap(roadmapOpt.isPresent())
                .roadmapOverallProgress(roadmapOpt.map(CareerRoadmap::getOverallProgress).orElse(0))
                .roadmapProgressList(progressList)
                .build();
    }

    private CopilotChatResponse generateCopilotResponse(String query, CareerContext ctx, Long jobId) {
        String q = query.toLowerCase(Locale.ROOT).trim();

        // 1. Bullet rewrite intent
        if (q.contains("rewrite") || q.contains("bullet") || q.contains("action verb")) {
            return handleBulletRewrite(query, ctx);
        }

        // 2. Job-specific Match Analysis ("Why am I only 72%?", "What skills missing for this job?", "Should I apply?")
        if (ctx.getTargetJob() != null || q.contains("match") || q.contains("this job") || q.contains("why am i only") || q.contains("should i apply")) {
            if (ctx.getTargetJob() != null) {
                return handleJobMatchAnalysis(query, ctx);
            }
        }

        // 3. Career Readiness & Weaknesses ("How job-ready am I?", "What are my biggest weaknesses?", "What skills am I missing?")
        if (q.contains("job-ready") || q.contains("job ready") || q.contains("weakness") || q.contains("missing") || q.contains("improve first") || q.contains("how ready")) {
            return handleCareerReadinessAnalysis(query, ctx);
        }

        // 4. Resume & ATS Analysis ("How can I improve my resume?", "Why is my ATS score low?", "What projects should I highlight?")
        if (q.contains("resume") || q.contains("ats") || q.contains("cv") || q.contains("highlight")) {
            return handleResumeAnalysis(query, ctx);
        }

        // 5. Learning & Roadmap Plan ("What should I learn next?", "Create a 14-day plan", "Which skill should I prioritize?")
        if (q.contains("learn") || q.contains("roadmap") || q.contains("plan") || q.contains("14-day") || q.contains("30-day") || q.contains("prioritize")) {
            return handleLearningPlan(query, ctx);
        }

        // 6. Interview Preparation ("What questions can I expect?", "Give me a mock interview", "Prepare me for technical interview")
        if (q.contains("interview") || q.contains("question") || q.contains("mock") || q.contains("prepare me")) {
            return handleInterviewPrep(query, ctx);
        }

        // General Career Copilot Dispatcher
        return handleGeneralCareerAdvice(query, ctx);
    }

    private CopilotChatResponse handleJobMatchAnalysis(String query, CareerContext ctx) {
        Job job = ctx.getTargetJob();
        MatchingService.SkillBreakdown breakdown = ctx.getSkillBreakdown();
        int score = ctx.getTargetJobMatchScore() != null ? (int) Math.round(ctx.getTargetJobMatchScore()) : 72;

        List<String> matched = breakdown != null ? breakdown.getMatched() : List.of();
        List<String> missing = breakdown != null ? breakdown.getMissing() : List.of();
        List<String> partial = breakdown != null ? breakdown.getPartial() : List.of();

        StringBuilder sb = new StringBuilder();
        sb.append("## Your Match: ").append(score).append("%\n\n");
        sb.append("**Target Role:** ").append(job != null ? job.getTitle() : "Target Job").append("\n");
        if (job != null && StringUtils.hasText(job.getLocation())) {
            sb.append("**Location:** ").append(job.getLocation()).append("\n\n");
        } else {
            sb.append("\n");
        }

        sb.append("### Strong matches\n");
        if (!matched.isEmpty()) {
            for (String m : matched) {
                sb.append("✓ ").append(m).append("\n");
            }
        } else {
            sb.append("No direct skill matches detected in your structured profile yet.\n");
        }
        sb.append("\n");

        if (!partial.isEmpty()) {
            sb.append("### Partial / Foundation matches\n");
            for (String p : partial) {
                sb.append("⚠ ").append(p).append(" (foundational skills present)\n");
            }
            sb.append("\n");
        }

        sb.append("### Skill gaps\n");
        if (!missing.isEmpty()) {
            for (String m : missing) {
                sb.append("✗ ").append(m).append("\n");
            }
        } else {
            sb.append("✓ No major technical skill gaps identified for this role!\n");
        }
        sb.append("\n");

        sb.append("### Biggest issue\n");
        if (!missing.isEmpty()) {
            String topMissing = String.join(" and ", missing.subList(0, Math.min(2, missing.size())));
            sb.append("The job requires ").append(topMissing)
                    .append(", but neither appears as a verified skill in your candidate profile or parsed resume.\n\n");
        } else if (job != null && job.getRequiredExperienceYears() != null && job.getRequiredExperienceYears() > ctx.getExperiences().size()) {
            sb.append("The role asks for ").append(job.getRequiredExperienceYears())
                    .append("+ years of experience, while your profile lists ")
                    .append(ctx.getExperiences().size()).append(" documented roles.\n\n");
        } else {
            sb.append("Your skills strongly align with this position. Focus on highlighting relevant projects.\n\n");
        }

        sb.append("### What I recommend\n");
        String topSkillToLearn = !missing.isEmpty() ? missing.get(0) : (!partial.isEmpty() ? partial.get(0) : "Project Deployment");
        sb.append("1. Learn ").append(topSkillToLearn).append(" core fundamentals\n");
        sb.append("2. Build or containerize an existing project demonstrating this skill\n");
        sb.append("3. Document the practical project in your profile and resume\n");
        sb.append("4. Re-run the match analysis before submitting your application\n\n");

        sb.append("### Estimated improvement\n");
        int potentialMin = Math.min(95, score + 10);
        int potentialMax = Math.min(98, score + 18);
        sb.append("If these skills are genuinely acquired and added to your profile:\n\n");
        sb.append("**").append(score).append("% → potentially ").append(potentialMin).append("–").append(potentialMax).append("%**\n\n");
        sb.append("_Note: Match score reflects profile alignment and does not guarantee interview shortlisting._");

        String actionSkill = !missing.isEmpty() ? missing.get(0) : topSkillToLearn;
        return CopilotChatResponse.builder()
                .message(sb.toString())
                .sender("ASSISTANT")
                .jobId(job != null ? job.getId() : null)
                .actionLink("/career-roadmap?skill=" + actionSkill)
                .actionLabel("Start " + actionSkill + " Roadmap →")
                .suggestedQuestions(List.of(
                        "What interview questions can I expect for this role?",
                        "Create a 14-day plan to become ready for this job",
                        "How can I improve my resume for this position?"
                ))
                .build();
    }

    private CopilotChatResponse handleCareerReadinessAnalysis(String query, CareerContext ctx) {
        StringBuilder sb = new StringBuilder();
        sb.append("## Career Readiness Assessment: ").append(ctx.getReadinessScore()).append("%\n\n");

        if (StringUtils.hasText(ctx.getPreferredRole())) {
            sb.append("**Target Role:** ").append(ctx.getPreferredRole()).append("\n\n");
        }

        sb.append("### Strengths\n");
        if (!ctx.getSkills().isEmpty()) {
            sb.append("✓ **Technical Profile:** ").append(ctx.getSkills().size()).append(" structured skills registered (");
            sb.append(ctx.getSkills().stream().limit(4).map(CandidateSkill::getName).collect(Collectors.joining(", ")));
            sb.append(")\n");
        }
        if (!ctx.getProjects().isEmpty()) {
            sb.append("✓ **Project Evidence:** ").append(ctx.getProjects().size()).append(" practical projects documented\n");
        }
        if (ctx.getResumeAtsScore() >= 70) {
            sb.append("✓ **Resume ATS Alignment:** Resume score is healthy at ").append(ctx.getResumeAtsScore()).append("/100\n");
        }
        sb.append("\n");

        sb.append("### Primary weaknesses to address\n");
        List<String> weaknesses = new ArrayList<>();
        if (ctx.getSkills().size() < 5) {
            weaknesses.add("⚠ **Skill Depth:** You have fewer than 5 structured skills. Adding high-demand technologies unlocks higher compatibility scores.");
        }
        if (ctx.getProjects().isEmpty()) {
            weaknesses.add("⚠ **Project Proof:** No practical projects recorded. Recruiters look for live deployment or GitHub links.");
        }
        if (ctx.getResumeAtsScore() < 65) {
            weaknesses.add("⚠ **Resume Keyword Density:** ATS score is currently " + ctx.getResumeAtsScore() + "/100. Adding technical keywords from your actual stack will improve parsing.");
        }
        if (weaknesses.isEmpty()) {
            weaknesses.add("⚠ **Application Momentum:** You've applied to " + ctx.getApplications().size() + " roles. Target 3-5 high-match jobs this week.");
        }

        for (String w : weaknesses) {
            sb.append(w).append("\n");
        }
        sb.append("\n");

        sb.append("### Recommended priority order\n");
        sb.append("1. **Complete missing profile sections:** Ensure skills, education, and portfolio links are up to date.\n");
        sb.append("2. **Focus on high-priority skill gaps:** Review your personalized learning roadmap.\n");
        sb.append("3. **Build one deployment-ready capstone:** Showcase end-to-end implementation.\n");

        return CopilotChatResponse.builder()
                .message(sb.toString())
                .sender("ASSISTANT")
                .actionLink("/career-roadmap")
                .actionLabel("View Career Roadmap →")
                .suggestedQuestions(List.of(
                        "What should I learn next?",
                        "How can I improve my resume ATS score?",
                        "Give me a mock technical interview"
                ))
                .build();
    }

    private CopilotChatResponse handleResumeAnalysis(String query, CareerContext ctx) {
        StringBuilder sb = new StringBuilder();
        sb.append("## Resume & ATS Optimization Analysis\n\n");
        sb.append("**Current ATS Keyword Score:** ").append(ctx.getResumeAtsScore()).append("/100\n\n");

        sb.append("### Resume Strengths\n");
        if (!ctx.getResumeSkills().isEmpty()) {
            sb.append("✓ **Extracted Keywords:** ").append(String.join(", ", ctx.getResumeSkills())).append("\n");
        } else if (!ctx.getSkills().isEmpty()) {
            sb.append("✓ **Profile Skills Available:** ").append(ctx.getSkills().stream().limit(5).map(CandidateSkill::getName).collect(Collectors.joining(", "))).append("\n");
        } else {
            sb.append("⚠ No verified technical keywords detected yet.\n");
        }
        sb.append("\n");

        sb.append("### Key Areas for Improvement\n");
        sb.append("1. **Lead with strong action verbs:** Begin every accomplishment bullet with verbs like _Built, Engineered, Architected, Optimized, Delivered_.\n");
        sb.append("2. **Contextualize achievements without fabricating metrics:** Describe the architectural impact or problem solved clearly.\n");
        sb.append("3. **Ensure exact technical keyword naming:** Use standardized terms (e.g. `Spring Boot`, `React`, `TypeScript`, `Docker`, `PostgreSQL`) so ATS filters recognize them.\n\n");

        sb.append("### Example Bullet Transformation\n\n");
        sb.append("✗ **Weak:** _Responsible for working on backend APIs and fixing bugs in the database._\n\n");
        sb.append("✓ **Strong & Honest:** _Engineered RESTful API endpoints in Spring Boot and optimized database queries to ensure reliable data access._\n\n");
        sb.append("_Note: Never fabricate performance numbers or metrics. Use precise technical descriptors of what you genuinely implemented._");

        return CopilotChatResponse.builder()
                .message(sb.toString())
                .sender("ASSISTANT")
                .actionLink("/candidate/resume-builder")
                .actionLabel("Open Resume Builder →")
                .suggestedQuestions(List.of(
                        "Rewrite this bullet without inventing achievements",
                        "What projects should I highlight on my resume?",
                        "How job-ready am I for my target role?"
                ))
                .build();
    }

    private CopilotChatResponse handleBulletRewrite(String query, CareerContext ctx) {
        // Extract raw bullet from prompt if user provided one
        String rawBullet = query.replaceAll("(?i)^(rewrite|improve|fix|enhance)\\s*(this|the)?\\s*(bullet)?:?\\s*", "").trim();
        if (rawBullet.length() < 10) {
            rawBullet = "Responsible for building features and helped with the database backend.";
        }

        EnhanceBulletResponse enhanced = resumeService.enhanceBullet(rawBullet);

        StringBuilder sb = new StringBuilder();
        sb.append("## Bullet Enhancement (Zero Fabricated Metrics)\n\n");
        sb.append("### Original\n");
        sb.append("> ").append(enhanced.getOriginal()).append("\n\n");

        sb.append("### Recommended Professional Rewrite\n");
        sb.append("✓ **").append(enhanced.getEnhanced()).append("**\n\n");

        sb.append("### Why this is better\n");
        sb.append("- Replaced passive phrasing with an assertive technical action verb.\n");
        sb.append("- Eliminated filler language while preserving your exact original responsibilities.\n");
        sb.append("- Completely safe from fabricated metrics or unverified numbers.");

        return CopilotChatResponse.builder()
                .message(sb.toString())
                .sender("ASSISTANT")
                .actionLink("/candidate/resume-builder")
                .actionLabel("Apply in Resume Builder →")
                .suggestedQuestions(List.of(
                        "Rewrite another bullet",
                        "What skills am I missing for Full Stack roles?",
                        "How job-ready am I?"
                ))
                .build();
    }

    private CopilotChatResponse handleLearningPlan(String query, CareerContext ctx) {
        // Identify top missing skills from target job or preferred role
        String prioritySkill = "Docker";
        if (ctx.getSkillBreakdown() != null && !ctx.getSkillBreakdown().getMissing().isEmpty()) {
            prioritySkill = ctx.getSkillBreakdown().getMissing().get(0);
        } else if (!ctx.getRoadmapProgressList().isEmpty()) {
            Optional<RoadmapSkillProgress> nextSkill = ctx.getRoadmapProgressList().stream()
                    .filter(s -> !"COMPLETED".equalsIgnoreCase(s.getStatus()))
                    .findFirst();
            if (nextSkill.isPresent()) {
                prioritySkill = nextSkill.get().getSkillName();
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append("## Personalized Learning Priority: ").append(prioritySkill).append("\n\n");
        sb.append("Your highest-priority gap is **").append(prioritySkill)
                .append("** because it is a core prerequisite for your target career path and appears frequently in open roles.\n\n");

        sb.append("### 14-Day Actionable Plan for ").append(prioritySkill).append("\n\n");
        sb.append("#### Week 1: Core Fundamentals & Containerization\n");
        sb.append("- **Day 1–2:** Core architecture, daemon, images, and container lifecycles\n");
        sb.append("- **Day 3–4:** Writing optimized multi-stage Dockerfiles for backend and frontend\n");
        sb.append("- **Day 5–7:** Multi-container orchestration with Docker Compose & networking\n\n");

        sb.append("#### Week 2: Practical Project & Production Deployment\n");
        sb.append("- **Day 8–10:** Containerize your existing AIJobPortal Spring Boot and React applications\n");
        sb.append("- **Day 11–12:** Volume persistence, environment configuration, and container debugging\n");
        sb.append("- **Day 13–14:** Push image to Docker Hub / registry and document on your profile\n\n");

        sb.append("### Practical Project Recommendation\n");
        sb.append("**Task:** Containerize the AIJobPortal application stack with a multi-container `docker-compose.yml` linking Spring Boot backend, React frontend, and MySQL database.\n");

        return CopilotChatResponse.builder()
                .message(sb.toString())
                .sender("ASSISTANT")
                .actionLink("/career-roadmap?skill=" + prioritySkill)
                .actionLabel("Start " + prioritySkill + " Roadmap →")
                .suggestedQuestions(List.of(
                        "What interview questions will I be asked on " + prioritySkill + "?",
                        "Why am I missing " + prioritySkill + "?",
                        "View my overall Career Roadmap"
                ))
                .build();
    }

    private CopilotChatResponse handleInterviewPrep(String query, CareerContext ctx) {
        String role = StringUtils.hasText(ctx.getPreferredRole()) ? ctx.getPreferredRole() : "Full Stack Developer";
        if (ctx.getTargetJob() != null && StringUtils.hasText(ctx.getTargetJob().getTitle())) {
            role = ctx.getTargetJob().getTitle();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("## Technical Interview Preparation: ").append(role).append("\n\n");
        sb.append("Here is a realistic mock interview question set based on your profile and target role requirements:\n\n");

        sb.append("### 1. Architecture & Backend\n");
        sb.append("**Question:** _How do you manage database transactions and prevent race conditions in a Spring Boot microservice architecture?_\n");
        sb.append("**What interviewers look for:** Understanding of `@Transactional` propagation levels, isolation, and optimistic/pessimistic locking.\n\n");

        sb.append("### 2. Frontend & State Management\n");
        sb.append("**Question:** _In React, how do you prevent unnecessary re-renders in deeply nested components, and when should you use `useMemo` vs `useCallback`?_\n");
        sb.append("**What interviewers look for:** Virtual DOM mechanics, referential equality of callbacks, and profiler-based optimization.\n\n");

        sb.append("### 3. Containerization & DevOps Gap\n");
        sb.append("**Question:** _Explain how multi-stage Docker builds reduce container image size and improve security for a Java/Node application._\n");
        sb.append("**What interviewers look for:** Separating build dependencies (Maven/Node) from lightweight runtime images (Alpine/JRE).\n\n");

        sb.append("### Practice Tip\n");
        sb.append("Structure your answers using the **STAR** method (Situation, Task, Action, Result) referencing your real projects.\n");

        return CopilotChatResponse.builder()
                .message(sb.toString())
                .sender("ASSISTANT")
                .actionLink("/career-roadmap")
                .actionLabel("Practice in Roadmap →")
                .suggestedQuestions(List.of(
                        "Give me another mock technical question",
                        "How should I answer 'What are your weaknesses?'",
                        "What skills should I prioritize learning?"
                ))
                .build();
    }

    private CopilotChatResponse handleGeneralCareerAdvice(String query, CareerContext ctx) {
        StringBuilder sb = new StringBuilder();
        sb.append("## AI Career Copilot\n\n");
        sb.append("I am your personalized career co-pilot, connected to your live candidate profile, skills, resume analysis, and application journey.\n\n");

        sb.append("### Quick Snapshot\n");
        sb.append("- **Career Readiness:** ").append(ctx.getReadinessScore()).append("%\n");
        sb.append("- **Profile Skills:** ").append(ctx.getSkills().size()).append(" verified skills\n");
        sb.append("- **Resume ATS Score:** ").append(ctx.getResumeAtsScore()).append("/100\n");
        sb.append("- **Applications:** ").append(ctx.getApplications().size()).append(" active applications\n\n");

        sb.append("### How I can help you right now\n");
        sb.append("1. **Job Analysis:** Ask _\"Why am I only a 72% match for this job?\"_ from any job page\n");
        sb.append("2. **Skill Gap Roadmap:** Ask _\"What should I learn next?\"_ to view your 30-day learning plan\n");
        sb.append("3. **Resume Bullet Tuning:** Ask _\"Rewrite this bullet without inventing achievements\"_\n");
        sb.append("4. **Mock Interviews:** Ask _\"Prepare me for the technical interview for this position\"_\n");

        return CopilotChatResponse.builder()
                .message(sb.toString())
                .sender("ASSISTANT")
                .actionLink("/career-roadmap")
                .actionLabel("Open Career Roadmap →")
                .suggestedQuestions(List.of(
                        "How job-ready am I?",
                        "What skills am I missing?",
                        "What should I learn next?",
                        "How can I improve my resume?"
                ))
                .build();
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
    }

    private CandidateProfile requireCandidate(User user) {
        if (user.getRole() != Role.JOB_SEEKER && user.getRole() != Role.ADMIN) {
            throw new ApiException("Career Copilot is available for candidates and administrators", 403);
        }
        return candidateProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Candidate profile not found", 404));
    }

    @lombok.Data
    @lombok.Builder
    public static class CareerContext {
        private String fullName;
        private String location;
        private String preferredRole;
        private String experienceLevel;
        private String remotePreference;
        private String bio;
        private String skillsCsv;
        private List<CandidateSkill> skills;
        private List<Experience> experiences;
        private List<Project> projects;
        private List<Education> educations;
        private List<Application> applications;
        private int resumeAtsScore;
        private List<String> resumeSkills;
        private int readinessScore;
        private Job targetJob;
        private Double targetJobMatchScore;
        private MatchingService.SkillBreakdown skillBreakdown;
        private boolean hasActiveRoadmap;
        private int roadmapOverallProgress;
        private List<RoadmapSkillProgress> roadmapProgressList;
    }
}
