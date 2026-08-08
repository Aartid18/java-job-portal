package com.jobportal.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.*;
import com.jobportal.entity.*;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CareerRoadmapService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final JobRepository jobRepository;
    private final CareerRoadmapRepository careerRoadmapRepository;
    private final RoadmapSkillProgressRepository roadmapSkillProgressRepository;
    private final MatchingService matchingService;
    private final ResumeService resumeService;
    private final ObjectMapper objectMapper;

    // Curated learning repository
    private static final Map<String, RoadmapResponse.LearningResourceDto> RESOURCE_CATALOG = new LinkedHashMap<>();
    static {
        RESOURCE_CATALOG.put("docker", RoadmapResponse.LearningResourceDto.builder()
                .skillName("Docker")
                .officialDocTitle("Official Docker Documentation")
                .officialDocUrl("https://docs.docker.com/get-started/")
                .freeResources(List.of(
                        "Docker Curriculum — A comprehensive tutorial for beginners",
                        "Docker 101 Tutorial by Docker",
                        "FreeCodeCamp Docker for Java & Node.js Developers"
                ))
                .practiceSuggestions(List.of(
                        "Write a multi-stage Dockerfile for a Java Spring Boot JAR",
                        "Create a docker-compose.yml linking React, Spring Boot, and MySQL",
                        "Inspect container logs and mount persistent host volumes"
                ))
                .practicalProjectIdea("Containerize your existing AIJobPortal backend and frontend into lightweight production images.")
                .build());

        RESOURCE_CATALOG.put("aws", RoadmapResponse.LearningResourceDto.builder()
                .skillName("AWS")
                .officialDocTitle("AWS Documentation & Skill Builder")
                .officialDocUrl("https://aws.amazon.com/getting-started/")
                .freeResources(List.of(
                        "AWS Cloud Practitioner Essentials (Free Digital Course)",
                        "AWS Hands-On Labs (Free Tier Tutorials)",
                        "AWS ECS & Fargate Architecture Guide"
                ))
                .practiceSuggestions(List.of(
                        "Configure AWS S3 bucket policies for secure file storage",
                        "Deploy a containerized Spring Boot app to AWS App Runner or ECS",
                        "Set up an AWS RDS MySQL database with security groups"
                ))
                .practicalProjectIdea("Deploy the AIJobPortal application using an AWS-compatible containerized deployment architecture.")
                .build());

        RESOURCE_CATALOG.put("typescript", RoadmapResponse.LearningResourceDto.builder()
                .skillName("TypeScript")
                .officialDocTitle("The TypeScript Handbook")
                .officialDocUrl("https://www.typescriptlang.org/docs/handbook/intro.html")
                .freeResources(List.of(
                        "TypeScript for Java/C# Programmers (Official Guide)",
                        "Execute Program TypeScript Course",
                        "Total TypeScript Beginner Tutorials by Matt Pocock"
                ))
                .practiceSuggestions(List.of(
                        "Convert plain JavaScript React components to strictly typed TSX",
                        "Create generic API response wrappers and utility types",
                        "Define discriminated unions for complex application states"
                ))
                .practicalProjectIdea("Refactor frontend data-fetching hooks with strict TypeScript generics and discriminated unions.")
                .build());

        RESOURCE_CATALOG.put("kubernetes", RoadmapResponse.LearningResourceDto.builder()
                .skillName("Kubernetes")
                .officialDocTitle("Kubernetes Official Interactive Tutorial")
                .officialDocUrl("https://kubernetes.io/docs/tutorials/kubernetes-basics/")
                .freeResources(List.of(
                        "Kubernetes Basics Tutorial by CNCF",
                        "Minikube Local Cluster Setup Guide",
                        "K9s CLI tooling and Pod debugging guides"
                ))
                .practiceSuggestions(List.of(
                        "Deploy a local cluster with Minikube / Kind",
                        "Write Deployment and Service manifests for backend and frontend",
                        "Configure ConfigMaps and Secrets for environment variables"
                ))
                .practicalProjectIdea("Create Kubernetes deployment manifests and ingress routing for the full-stack portal.")
                .build());

        RESOURCE_CATALOG.put("postgresql", RoadmapResponse.LearningResourceDto.builder()
                .skillName("PostgreSQL")
                .officialDocTitle("PostgreSQL Official Documentation")
                .officialDocUrl("https://www.postgresql.org/docs/")
                .freeResources(List.of(
                        "PostgreSQL Tutorial for Developers (postgresqltutorial.com)",
                        "Use The Index, Luke! — SQL Indexing Performance",
                        "PostgreSQL EXPLAIN ANALYZE Deep Dive"
                ))
                .practiceSuggestions(List.of(
                        "Write query execution plans with EXPLAIN ANALYZE",
                        "Design B-Tree and GIN indexes for high-volume text search",
                        "Implement ACID transactions with correct isolation levels"
                ))
                .practicalProjectIdea("Migrate database schema to PostgreSQL with optimized indexing and full-text job search.")
                .build());

        RESOURCE_CATALOG.put("redis", RoadmapResponse.LearningResourceDto.builder()
                .skillName("Redis")
                .officialDocTitle("Redis University & Docs")
                .officialDocUrl("https://redis.io/docs/")
                .freeResources(List.of(
                        "Redis Crash Course by FreeCodeCamp",
                        "Spring Data Redis Caching Guide",
                        "Redis Data Structures in Practice"
                ))
                .practiceSuggestions(List.of(
                        "Implement `@Cacheable` and `@CacheEvict` on job search endpoints",
                        "Use Redis Hashes and Sorted Sets for fast leaderboard scoring",
                        "Configure TTL expiration for user session caching"
                ))
                .practicalProjectIdea("Implement a Redis caching layer for job compatibility scores and active user analytics.")
                .build());

        RESOURCE_CATALOG.put("system design", RoadmapResponse.LearningResourceDto.builder()
                .skillName("System Design")
                .officialDocTitle("System Design Primer by Donne Martin")
                .officialDocUrl("https://github.com/donnemartin/system-design-primer")
                .freeResources(List.of(
                        "ByteByteGo System Design Newsletter & Blog",
                        "High Scalability Architecture Case Studies",
                        "Martin Fowler Microservices Architecture Guides"
                ))
                .practiceSuggestions(List.of(
                        "Diagram load-balanced multi-region application architectures",
                        "Design rate limiting with Token Bucket algorithm",
                        "Compare synchronous REST vs asynchronous message queues (Kafka)"
                ))
                .practicalProjectIdea("Design a scalable distributed resume-parsing queue with asynchronous processing workers.")
                .build());
    }

    @Transactional(readOnly = true)
    public SkillGapDetailResponse getSkillGapDetail(String email, Long jobId) {
        User user = requireUser(email);
        CandidateProfile profile = requireCandidate(user);

        List<CandidateSkill> skills = candidateSkillRepository.findByCandidateId(profile.getId());
        List<Experience> experiences = experienceRepository.findByCandidateId(profile.getId());
        List<Project> projects = projectRepository.findByCandidateId(profile.getId());

        String skillsCsv = skills.stream().map(CandidateSkill::getName).collect(Collectors.joining(", "));
        if (!StringUtils.hasText(skillsCsv)) {
            skillsCsv = profile.getSkills() != null ? profile.getSkills() : "";
        }

        Job job = null;
        if (jobId != null) {
            job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new ApiException("Job not found", 404));
        } else {
            // Find most recent open job or fallback
            List<Job> openJobs = jobRepository.findByStatus("OPEN", org.springframework.data.domain.PageRequest.of(0, 1)).getContent();
            if (!openJobs.isEmpty()) {
                job = openJobs.get(0);
            }
        }

        String requiredSkillsCsv = job != null && StringUtils.hasText(job.getRequiredSkills())
                ? job.getRequiredSkills()
                : "Java, Spring Boot, React, TypeScript, Docker, AWS, SQL, PostgreSQL";

        MatchingService.SkillBreakdown breakdown = matchingService.analyzeSkills(skillsCsv, requiredSkillsCsv);
        Double rawMatch = matchingService.calculateCompatibilityScore(skillsCsv, requiredSkillsCsv);
        int overallReadiness = rawMatch != null ? (int) Math.round(rawMatch) : 74;

        // Breakdown scores
        int techScore = Math.min(100, (int) Math.round((double) breakdown.getMatched().size() / Math.max(1, breakdown.getMatched().size() + breakdown.getMissing().size()) * 100));
        int toolsScore = computeToolsScore(skills, breakdown.getMatched());
        int expScore = job != null && job.getRequiredExperienceYears() != null
                ? Math.min(100, Math.max(30, (experiences.size() * 35) + (projects.size() * 15)))
                : (experiences.isEmpty() ? 50 : 85);
        int resumeScore = computeResumeEvidenceScore(profile, skills, projects);

        // Prioritize gaps
        List<SkillGapDetailResponse.PrioritizedSkillGap> prioritized = buildPrioritizedGaps(breakdown, job, skills);

        List<String> recommendations = new ArrayList<>();
        if (!breakdown.getMissing().isEmpty()) {
            recommendations.add("Start the " + breakdown.getMissing().get(0) + " learning roadmap (High Priority).");
        }
        if (toolsScore < 70) {
            recommendations.add("Add practical DevOps / deployment tools (Docker, AWS, CI/CD) to your portfolio.");
        }
        if (resumeScore < 75) {
            recommendations.add("Surface technical keywords clearly in your resume summary.");
        }
        recommendations.add("Containerize or deploy a full-stack project to showcase practical proof.");

        String targetRole = job != null ? job.getTitle() : (StringUtils.hasText(profile.getPreferredJobRole()) ? profile.getPreferredJobRole() : "Full Stack Developer");
        String companyOrPoster = job != null && job.getPostedBy() != null
                ? (job.getPostedBy().getCompany() != null ? job.getPostedBy().getCompany().getName() : job.getPostedBy().getFullName())
                : "Target Role Specification";

        return SkillGapDetailResponse.builder()
                .jobId(job != null ? job.getId() : null)
                .jobTitle(job != null ? job.getTitle() : targetRole)
                .companyOrPoster(companyOrPoster)
                .targetRole(targetRole)
                .overallReadiness(overallReadiness)
                .technicalSkillsScore(Math.max(40, techScore))
                .requiredToolsScore(toolsScore)
                .experienceScore(expScore)
                .resumeEvidenceScore(resumeScore)
                .matchedSkills(breakdown.getMatched())
                .missingSkills(breakdown.getMissing())
                .partialSkills(breakdown.getPartial())
                .prioritizedGaps(prioritized)
                .nextRecommendations(recommendations)
                .build();
    }

    @Transactional
    public RoadmapResponse generateOrGetRoadmap(String email, RoadmapGenerateRequest request) {
        User user = requireUser(email);
        CandidateProfile profile = requireCandidate(user);

        boolean forceRegenerate = request != null && Boolean.TRUE.equals(request.getRegenerate());
        Optional<CareerRoadmap> existing = careerRoadmapRepository.findByCandidateId(profile.getId());

        if (existing.isPresent() && !forceRegenerate && (request == null || request.getJobId() == null)) {
            return toRoadmapResponse(existing.get(), profile);
        }

        Long targetJobId = request != null ? request.getJobId() : (existing.map(CareerRoadmap::getTargetJobId).orElse(null));
        SkillGapDetailResponse gapDetail = getSkillGapDetail(email, targetJobId);

        String targetRole = request != null && StringUtils.hasText(request.getTargetRole())
                ? request.getTargetRole().trim()
                : gapDetail.getTargetRole();

        // Build 4 structured weeks
        List<RoadmapResponse.RoadmapWeekDto> weeks = buildRoadmapWeeks(gapDetail);
        List<RoadmapResponse.RoadmapProjectDto> projects = buildRoadmapProjects(gapDetail);

        // Synchronize RoadmapSkillProgress records in DB
        syncSkillProgressRecords(profile, gapDetail.getPrioritizedGaps());

        // Calculate progress %
        int currentReadiness = gapDetail.getOverallReadiness();
        int overallProgress = computeOverallProgress(profile);

        CareerRoadmap roadmap = existing.orElseGet(() -> CareerRoadmap.builder()
                .candidate(profile)
                .build());

        roadmap.setTargetJobId(targetJobId);
        roadmap.setTargetRole(targetRole);
        roadmap.setCurrentReadiness(currentReadiness);
        roadmap.setOverallProgress(overallProgress);

        Map<String, Object> roadmapData = new LinkedHashMap<>();
        roadmapData.put("weeks", weeks);
        roadmapData.put("projects", projects);
        roadmapData.put("prioritizedGaps", gapDetail.getPrioritizedGaps());

        try {
            roadmap.setRoadmapJson(objectMapper.writeValueAsString(roadmapData));
        } catch (Exception e) {
            roadmap.setRoadmapJson("{}");
        }

        CareerRoadmap saved = careerRoadmapRepository.save(roadmap);
        return toRoadmapResponse(saved, profile);
    }

    @Transactional(readOnly = true)
    public RoadmapResponse getRoadmap(String email) {
        User user = requireUser(email);
        CandidateProfile profile = requireCandidate(user);
        CareerRoadmap roadmap = careerRoadmapRepository.findByCandidateId(profile.getId())
                .orElseGet(() -> {
                    // Generate initial roadmap on first access
                    return generateInitialRoadmap(profile);
                });
        return toRoadmapResponse(roadmap, profile);
    }

    @Transactional
    public RoadmapResponse updateProgress(String email, RoadmapProgressUpdateRequest request) {
        User user = requireUser(email);
        CandidateProfile profile = requireCandidate(user);

        String skillName = request.getSkillName().trim();
        String status = StringUtils.hasText(request.getStatus()) ? request.getStatus().trim().toUpperCase(Locale.ROOT) : "IN_PROGRESS";
        int percent = request.getProgressPercent() != null ? Math.max(0, Math.min(100, request.getProgressPercent()))
                : ("COMPLETED".equals(status) ? 100 : ("IN_PROGRESS".equals(status) ? 50 : 0));

        RoadmapSkillProgress record = roadmapSkillProgressRepository
                .findByCandidateIdAndSkillNameIgnoreCase(profile.getId(), skillName)
                .orElseGet(() -> RoadmapSkillProgress.builder()
                        .candidate(profile)
                        .skillName(skillName)
                        .priority("HIGH")
                        .build());

        record.setStatus(status);
        record.setProgressPercent(percent);
        roadmapSkillProgressRepository.save(record);

        // If completed, check if candidate wants to add it to candidate_skills table as verified
        if ("COMPLETED".equals(status) && percent >= 100) {
            boolean alreadyHas = candidateSkillRepository.findByCandidateId(profile.getId()).stream()
                    .anyMatch(s -> s.getName().equalsIgnoreCase(skillName));
            if (!alreadyHas) {
                candidateSkillRepository.save(CandidateSkill.builder()
                        .candidate(profile)
                        .name(matchingService.toDisplayCase(skillName))
                        .level("Intermediate")
                        .build());
            }
        }

        // Recompute overall progress
        int overall = computeOverallProgress(profile);
        Optional<CareerRoadmap> roadmapOpt = careerRoadmapRepository.findByCandidateId(profile.getId());
        if (roadmapOpt.isPresent()) {
            CareerRoadmap rm = roadmapOpt.get();
            rm.setOverallProgress(overall);
            // Boost readiness score proportionally as roadmap milestones are completed
            int baseReadiness = rm.getCurrentReadiness() != null ? rm.getCurrentReadiness() : 70;
            int updatedReadiness = Math.min(96, baseReadiness + (overall / 8));
            rm.setCurrentReadiness(updatedReadiness);
            careerRoadmapRepository.save(rm);
            return toRoadmapResponse(rm, profile);
        }

        return getRoadmap(email);
    }

    private CareerRoadmap generateInitialRoadmap(CandidateProfile profile) {
        SkillGapDetailResponse gapDetail = getSkillGapDetail(profile.getUser().getEmail(), null);
        List<RoadmapResponse.RoadmapWeekDto> weeks = buildRoadmapWeeks(gapDetail);
        List<RoadmapResponse.RoadmapProjectDto> projects = buildRoadmapProjects(gapDetail);

        syncSkillProgressRecords(profile, gapDetail.getPrioritizedGaps());

        Map<String, Object> roadmapData = new LinkedHashMap<>();
        roadmapData.put("weeks", weeks);
        roadmapData.put("projects", projects);
        roadmapData.put("prioritizedGaps", gapDetail.getPrioritizedGaps());

        String json = "{}";
        try {
            json = objectMapper.writeValueAsString(roadmapData);
        } catch (Exception ignored) {}

        CareerRoadmap rm = CareerRoadmap.builder()
                .candidate(profile)
                .targetRole(gapDetail.getTargetRole())
                .currentReadiness(gapDetail.getOverallReadiness())
                .overallProgress(0)
                .roadmapJson(json)
                .build();
        return careerRoadmapRepository.save(rm);
    }

    private void syncSkillProgressRecords(CandidateProfile profile, List<SkillGapDetailResponse.PrioritizedSkillGap> gaps) {
        for (SkillGapDetailResponse.PrioritizedSkillGap gap : gaps) {
            String skill = gap.getSkillName();
            Optional<RoadmapSkillProgress> existing = roadmapSkillProgressRepository
                    .findByCandidateIdAndSkillNameIgnoreCase(profile.getId(), skill);
            if (existing.isEmpty()) {
                roadmapSkillProgressRepository.save(RoadmapSkillProgress.builder()
                        .candidate(profile)
                        .skillName(skill)
                        .priority(gap.getPriority())
                        .status("NOT_STARTED")
                        .progressPercent(0)
                        .build());
            }
        }
    }

    private int computeOverallProgress(CandidateProfile profile) {
        List<RoadmapSkillProgress> list = roadmapSkillProgressRepository.findByCandidateId(profile.getId());
        if (list.isEmpty()) return 0;
        int sum = list.stream().mapToInt(RoadmapSkillProgress::getProgressPercent).sum();
        return sum / list.size();
    }

    private List<SkillGapDetailResponse.PrioritizedSkillGap> buildPrioritizedGaps(
            MatchingService.SkillBreakdown breakdown,
            Job job,
            List<CandidateSkill> candidateSkills
    ) {
        List<SkillGapDetailResponse.PrioritizedSkillGap> list = new ArrayList<>();
        String jobDesc = job != null ? job.getDescription() : "";

        // 1. Missing skills -> High / Medium priority
        int rank = 0;
        for (String missing : breakdown.getMissing()) {
            boolean isHigh = rank == 0 || missing.equalsIgnoreCase("Docker") || missing.equalsIgnoreCase("AWS");
            String priority = isHigh ? "HIGH" : "MEDIUM";
            String reason = isHigh
                    ? "Essential requirement appearing as a core prerequisite for target role."
                    : "Important industry requirement that strengthens competitive applicant scoring.";
            String canonical = matchingService.normalizeSkillToken(missing);
            RoadmapResponse.LearningResourceDto res = getResourceForSkill(canonical, missing);

            list.add(SkillGapDetailResponse.PrioritizedSkillGap.builder()
                    .skillName(missing)
                    .priority(priority)
                    .reason(reason)
                    .isRequired(true)
                    .frequencyInDescription(matchingService.calculatePriorityRank(missing, jobDesc, true, "None"))
                    .recommendedProject(res.getPracticalProjectIdea())
                    .roadmapLink("/career-roadmap?skill=" + missing)
                    .build());
            rank++;
        }

        // 2. Partial skills -> Medium / Low priority
        for (String partial : breakdown.getPartial()) {
            String canonical = matchingService.normalizeSkillToken(partial);
            RoadmapResponse.LearningResourceDto res = getResourceForSkill(canonical, partial);

            list.add(SkillGapDetailResponse.PrioritizedSkillGap.builder()
                    .skillName(partial)
                    .priority("MEDIUM")
                    .reason("You have foundational related skills. Advance proficiency to full mastery.")
                    .isRequired(false)
                    .frequencyInDescription(matchingService.calculatePriorityRank(partial, jobDesc, false, "Beginner"))
                    .recommendedProject(res.getPracticalProjectIdea())
                    .roadmapLink("/career-roadmap?skill=" + partial)
                    .build());
        }

        if (list.isEmpty()) {
            // Default roadmap gaps if candidate has all base skills
            list.add(SkillGapDetailResponse.PrioritizedSkillGap.builder()
                    .skillName("Docker")
                    .priority("HIGH")
                    .reason("High-demand containerization tool for microservice deployments.")
                    .isRequired(true)
                    .frequencyInDescription(85)
                    .recommendedProject("Containerize the AIJobPortal backend and frontend.")
                    .roadmapLink("/career-roadmap?skill=Docker")
                    .build());
            list.add(SkillGapDetailResponse.PrioritizedSkillGap.builder()
                    .skillName("AWS")
                    .priority("MEDIUM")
                    .reason("Cloud infrastructure and deployment automation.")
                    .isRequired(true)
                    .frequencyInDescription(70)
                    .recommendedProject("Deploy the AIJobPortal application using AWS ECS.")
                    .roadmapLink("/career-roadmap?skill=AWS")
                    .build());
            list.add(SkillGapDetailResponse.PrioritizedSkillGap.builder()
                    .skillName("TypeScript")
                    .priority("MEDIUM")
                    .reason("Strict type safety for modern enterprise frontend applications.")
                    .isRequired(false)
                    .frequencyInDescription(65)
                    .recommendedProject("Refactor frontend components with strict TypeScript types.")
                    .roadmapLink("/career-roadmap?skill=TypeScript")
                    .build());
        }

        // Sort by HIGH > MEDIUM > LOW
        list.sort((a, b) -> {
            int pA = "HIGH".equals(a.getPriority()) ? 3 : ("MEDIUM".equals(a.getPriority()) ? 2 : 1);
            int pB = "HIGH".equals(b.getPriority()) ? 3 : ("MEDIUM".equals(b.getPriority()) ? 2 : 1);
            return Integer.compare(pB, pA);
        });

        return list;
    }

    private List<RoadmapResponse.RoadmapWeekDto> buildRoadmapWeeks(SkillGapDetailResponse gapDetail) {
        List<SkillGapDetailResponse.PrioritizedSkillGap> gaps = gapDetail.getPrioritizedGaps();
        String skill1 = !gaps.isEmpty() ? gaps.get(0).getSkillName() : "Docker";
        String skill2 = gaps.size() > 1 ? gaps.get(1).getSkillName() : "AWS";
        String skill3 = gaps.size() > 2 ? gaps.get(2).getSkillName() : "TypeScript";

        List<RoadmapResponse.RoadmapWeekDto> weeks = new ArrayList<>();

        // Week 1 — Primary Skill Gap
        weeks.add(RoadmapResponse.RoadmapWeekDto.builder()
                .weekNumber(1)
                .skillFocus(skill1)
                .priority("HIGH")
                .weeklyGoal("Master core fundamentals of " + skill1 + " and implement containerized configuration.")
                .days(List.of(
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(1).title(skill1 + " Architecture & Concepts").task("Study core daemons, images, and process isolation.").practicePrompt("Run your first hello-world container and inspect container status.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(2).title("Images & Container Lifecycles").task("Understand image layers, caching, and tag versioning.").practicePrompt("Build a custom image using an alpine base.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(3).title("Writing Production Dockerfiles").task("Implement multi-stage builds to minimize image size.").practicePrompt("Write a multi-stage Dockerfile for a Spring Boot / Node application.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(4).title("Multi-Container Orchestration").task("Master Docker Compose service definitions and networks.").practicePrompt("Compose backend, frontend, and database services together.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(5).title("Containerizing AIJobPortal").task("Containerize your existing AIJobPortal backend and frontend.").practicePrompt("Verify cross-container networking and environment variables.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(6).title("Debugging & Volume Persistence").task("Inspect container logs, mount host volumes, and fix errors.").practicePrompt("Persist database data across container restarts.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(7).title("Mini-Project Review & Resume Update").task("Push images to registry and document skill on profile.").practicePrompt("Add the containerized project link to your candidate profile.").build()
                ))
                .learningResources(getResourceForSkill(matchingService.normalizeSkillToken(skill1), skill1))
                .build());

        // Week 2 — Cloud & Deployment
        weeks.add(RoadmapResponse.RoadmapWeekDto.builder()
                .weekNumber(2)
                .skillFocus(skill2)
                .priority("MEDIUM")
                .weeklyGoal("Deploy application workloads to " + skill2 + " cloud infrastructure.")
                .days(List.of(
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(8).title(skill2 + " Core Services & IAM").task("Understand IAM roles, security policies, and resource access.").practicePrompt("Configure least-privilege credentials for deployment.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(9).title("Cloud Storage & Object Hosting").task("Configure S3 buckets / storage for static assets and resumes.").practicePrompt("Implement programmatic upload and signed URLs.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(10).title("Managed Cloud Databases").task("Provision cloud database instance (RDS / Managed SQL).").practicePrompt("Connect local application to cloud database securely.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(11).title("Containerized Deployment").task("Deploy container image to ECS / App Runner / Cloud Run.").practicePrompt("Configure health checks and automatic restarts.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(12).title("Environment & Secret Management").task("Secure API keys and database passwords with Parameter Store.").practicePrompt("Inject secrets into runtime environment seamlessly.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(13).title("Deployment Architecture Verification").task("Test end-to-end user flows on live deployment.").practicePrompt("Verify CORS, HTTPS certificates, and load times.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(14).title("Weekly Milestone Review").task("Document deployment architecture in GitHub README.").practicePrompt("Include live link and architecture diagram.").build()
                ))
                .learningResources(getResourceForSkill(matchingService.normalizeSkillToken(skill2), skill2))
                .build());

        // Week 3 — Framework & Type Safety
        weeks.add(RoadmapResponse.RoadmapWeekDto.builder()
                .weekNumber(3)
                .skillFocus(skill3)
                .priority("MEDIUM")
                .weeklyGoal("Enhance frontend and API contracts using strict " + skill3 + " typings.")
                .days(List.of(
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(15).title(skill3 + " Type System Fundamentals").task("Master primitives, interfaces, and type aliases.").practicePrompt("Define typed domain models matching backend DTOs.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(16).title("Generics & Utility Types").task("Learn Partial, Pick, Omit, and custom generic functions.").practicePrompt("Write a generic typed Axios wrapper function.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(17).title("React + TypeScript Integration").task("Type props, events, and hook return signatures.").practicePrompt("Refactor interactive forms with strict type validation.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(18).title("Discriminated Unions for UI States").task("Model loading, error, and success states cleanly.").practicePrompt("Implement pattern matching on async state responses.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(19).title("Refactoring Portal Components").task("Apply TypeScript types across candidate dashboard views.").practicePrompt("Eliminate all 'any' types and verify zero compiler warnings.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(20).title("API Contract Testing").task("Validate runtime response payloads against TypeScript types.").practicePrompt("Write automated checks for API schemas.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(21).title("Type Safety Audit & Review").task("Run strict compiler checks across the full frontend.").practicePrompt("Record new skill level on your candidate profile.").build()
                ))
                .learningResources(getResourceForSkill(matchingService.normalizeSkillToken(skill3), skill3))
                .build());

        // Week 4 — Capstone Project & Technical Interview Preparation
        weeks.add(RoadmapResponse.RoadmapWeekDto.builder()
                .weekNumber(4)
                .skillFocus("Project & Interview Readiness")
                .priority("HIGH")
                .weeklyGoal("Assemble end-to-end portfolio proof and prepare for technical interviews.")
                .days(List.of(
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(22).title("Full-Stack Capstone Integration").task("Connect containerized backend, typed frontend, and cloud DB.").practicePrompt("Verify end-to-end integration tests.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(23).title("Performance & Query Optimization").task("Inspect database queries and add caching with Redis.").practicePrompt("Measure response latency improvements.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(24).title("Resume Bullet Transformation").task("Rewrite project accomplishment bullets with strong action verbs.").practicePrompt("Use Copilot to enhance bullets without fabricating metrics.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(25).title("Mock Technical Interview — Backend").task("Practice Spring Boot, concurrency, and database transaction questions.").practicePrompt("Use Career Copilot mock interview feature.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(26).title("Mock Technical Interview — Frontend & System Design").task("Practice React rendering lifecycle and architecture questions.").practicePrompt("Explain architectural trade-offs using STAR format.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(27).title("Live Portfolio & Profile Polish").task("Add live URLs, GitHub repositories, and updated ATS keywords.").practicePrompt("Confirm Career Readiness Score reaches 85%+.").build(),
                        RoadmapResponse.RoadmapDayDto.builder().dayNumber(28).title("30-Day Roadmap Completion & Applications").task("Apply to 5 high-match jobs with your updated profile.").practicePrompt("Celebrate milestone completion and track application journey.").build()
                ))
                .learningResources(RoadmapResponse.LearningResourceDto.builder()
                        .skillName("Capstone & Interview Prep")
                        .officialDocTitle("System Design Primer & Tech Interview Handbook")
                        .officialDocUrl("https://techinterviewhandbook.org/")
                        .freeResources(List.of(
                                "STAR Method Interview Framework Guide",
                                "Full-Stack System Design Architectures",
                                "Top 50 Spring Boot & React Technical Questions"
                        ))
                        .practiceSuggestions(List.of(
                                "Conduct 3 mock interview rounds with Career Copilot",
                                "Verify project demo links in portfolio",
                                "Re-run ATS match analysis on target job descriptions"
                        ))
                        .practicalProjectIdea("Complete AIJobPortal full deployment with GitHub Actions CI/CD pipeline.")
                        .build())
                .build());

        return weeks;
    }

    private List<RoadmapResponse.RoadmapProjectDto> buildRoadmapProjects(SkillGapDetailResponse gapDetail) {
        List<RoadmapResponse.RoadmapProjectDto> list = new ArrayList<>();
        list.add(RoadmapResponse.RoadmapProjectDto.builder()
                .skillName("Docker")
                .title("Containerized AIJobPortal Stack")
                .description("Containerize your existing AIJobPortal backend and frontend into production-grade multi-stage Docker images.")
                .practicalArchitecture("Spring Boot (Java 17) + React (Vite/TS) + MySQL 8.0 interconnected via docker-compose bridge network.")
                .deliverables(List.of(
                        "Multi-stage Dockerfile for Spring Boot JAR with Alpine JRE",
                        "Multi-stage Dockerfile for React frontend served via Nginx",
                        "docker-compose.yml with health checks and persistent volume mounts"
                ))
                .build());

        list.add(RoadmapResponse.RoadmapProjectDto.builder()
                .skillName("AWS")
                .title("Cloud Deployment Architecture")
                .description("Deploy the containerized portal using an AWS-compatible cloud architecture with secure secret management.")
                .practicalArchitecture("ECS Fargate / App Runner + RDS MySQL + S3 Bucket for resume storage + CloudWatch logging.")
                .deliverables(List.of(
                        "S3 Bucket configuration for secure resume storage",
                        "RDS MySQL instance connection with encrypted parameters",
                        "Live production URL documented in GitHub repository"
                ))
                .build());

        list.add(RoadmapResponse.RoadmapProjectDto.builder()
                .skillName("TypeScript")
                .title("Strictly-Typed Domain Architecture")
                .description("Refactor frontend API layers and candidate dashboard components to 100% strict TypeScript typing.")
                .practicalArchitecture("Discriminated unions for async query states + Generic Axios HTTP client wrapper.")
                .deliverables(List.of(
                        "Strongly-typed DTO models matching backend Spring Boot contracts",
                        "Elimination of all implicit 'any' types across the codebase",
                        "Strict TypeScript compilation with zero lint warnings"
                ))
                .build());

        return list;
    }

    private RoadmapResponse.LearningResourceDto getResourceForSkill(String canonical, String displayName) {
        if (RESOURCE_CATALOG.containsKey(canonical)) {
            return RESOURCE_CATALOG.get(canonical);
        }
        return RoadmapResponse.LearningResourceDto.builder()
                .skillName(displayName)
                .officialDocTitle(displayName + " Official Documentation")
                .officialDocUrl("https://www.google.com/search?q=" + displayName + "+official+documentation")
                .freeResources(List.of(
                        displayName + " Complete Beginner's Guide on FreeCodeCamp",
                        displayName + " Crash Course for Full Stack Developers",
                        "Official GitHub Examples and Best Practices"
                ))
                .practiceSuggestions(List.of(
                        "Build a mini-application implementing " + displayName + " core patterns",
                        "Integrate " + displayName + " into an existing project module",
                        "Document lessons learned and code snippets on your profile"
                ))
                .practicalProjectIdea("Implement a practical mini-feature in AIJobPortal using " + displayName + ".")
                .build();
    }

    private RoadmapResponse toRoadmapResponse(CareerRoadmap rm, CandidateProfile profile) {
        List<RoadmapResponse.RoadmapWeekDto> weeks = List.of();
        List<RoadmapResponse.RoadmapProjectDto> projects = List.of();
        List<SkillGapDetailResponse.PrioritizedSkillGap> gaps = List.of();

        if (StringUtils.hasText(rm.getRoadmapJson())) {
            try {
                Map<String, Object> data = objectMapper.readValue(rm.getRoadmapJson(), new TypeReference<>() {});
                if (data.containsKey("weeks")) {
                    weeks = objectMapper.convertValue(data.get("weeks"), new TypeReference<>() {});
                }
                if (data.containsKey("projects")) {
                    projects = objectMapper.convertValue(data.get("projects"), new TypeReference<>() {});
                }
                if (data.containsKey("prioritizedGaps")) {
                    gaps = objectMapper.convertValue(data.get("prioritizedGaps"), new TypeReference<>() {});
                }
            } catch (Exception ignored) {}
        }

        List<RoadmapSkillProgress> progressList = roadmapSkillProgressRepository.findByCandidateId(profile.getId());
        List<RoadmapResponse.SkillProgressDto> dtos = progressList.stream()
                .map(p -> RoadmapResponse.SkillProgressDto.builder()
                        .skillName(p.getSkillName())
                        .priority(p.getPriority())
                        .status(p.getStatus())
                        .progressPercent(p.getProgressPercent())
                        .updatedAt(p.getUpdatedAt())
                        .build())
                .toList();

        String jobTitle = null;
        if (rm.getTargetJobId() != null) {
            jobTitle = jobRepository.findById(rm.getTargetJobId()).map(Job::getTitle).orElse(null);
        }

        return RoadmapResponse.builder()
                .id(rm.getId())
                .targetRole(rm.getTargetRole())
                .targetJobId(rm.getTargetJobId())
                .targetJobTitle(jobTitle)
                .currentReadiness(rm.getCurrentReadiness() != null ? rm.getCurrentReadiness() : 74)
                .overallProgress(rm.getOverallProgress() != null ? rm.getOverallProgress() : 0)
                .mainSkillGaps(gaps)
                .weeks(weeks)
                .projectRecommendations(projects)
                .skillProgressList(dtos)
                .createdAt(rm.getCreatedAt())
                .updatedAt(rm.getUpdatedAt())
                .build();
    }

    private int computeToolsScore(List<CandidateSkill> skills, List<String> matched) {
        Set<String> tools = Set.of("docker", "kubernetes", "aws", "gcp", "azure", "git", "ci/cd", "redis", "postgresql", "mysql", "mongodb");
        long toolMatches = skills.stream()
                .map(s -> matchingService.normalizeSkillToken(s.getName()))
                .filter(tools::contains)
                .count();
        return Math.min(100, Math.max(35, (int) toolMatches * 25));
    }

    private int computeResumeEvidenceScore(CandidateProfile profile, List<CandidateSkill> skills, List<Project> projects) {
        int score = 40;
        if (StringUtils.hasText(profile.getResumeStoragePath())) score += 30;
        if (!skills.isEmpty()) score += Math.min(15, skills.size() * 3);
        if (!projects.isEmpty()) score += Math.min(15, projects.size() * 5);
        return Math.min(100, score);
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
    }

    private CandidateProfile requireCandidate(User user) {
        if (user.getRole() != Role.JOB_SEEKER && user.getRole() != Role.ADMIN) {
            throw new ApiException("Career Roadmap is available for candidates and administrators", 403);
        }
        return candidateProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Candidate profile not found", 404));
    }
}
