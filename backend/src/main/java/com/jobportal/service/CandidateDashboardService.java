package com.jobportal.service;

import com.jobportal.dto.CandidateDashboardResponse;
import com.jobportal.dto.ProfileCompletionResponse;
import com.jobportal.entity.*;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateDashboardService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final OnboardingService onboardingService;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    @Transactional(readOnly = true)
    public CandidateDashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        if (user.getRole() != Role.JOB_SEEKER && user.getRole() != Role.ADMIN) {
            throw new ApiException("Candidate dashboard is for job seekers", 403);
        }

        CandidateProfile profile = candidateProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Candidate profile not found", 404));

        ProfileCompletionResponse completion = onboardingService.calculateCompletion(profile);
        List<CandidateSkill> skills = candidateSkillRepository.findByCandidateId(profile.getId());
        List<Experience> experiences = experienceRepository.findByCandidateId(profile.getId());
        List<Project> projects = projectRepository.findByCandidateId(profile.getId());
        List<Education> educations = educationRepository.findByCandidateId(profile.getId());
        List<Application> applications = applicationRepository.findByCandidateId(profile.getId());

        Map<String, Long> byStatus = applications.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus() != null ? a.getStatus() : "APPLIED",
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        long interviews = countStatus(byStatus, "INTERVIEW", "ASSESSMENT", "SHORTLISTED");
        long offers = countStatus(byStatus, "OFFER", "HIRED");

        Map<String, Integer> readiness = buildReadinessBreakdown(profile, completion, skills, experiences, projects, educations);
        int careerScore = readiness.values().stream().mapToInt(Integer::intValue).sum() / Math.max(1, readiness.size());

        int resumeScore = computeResumeScore(profile, skills, experiences, projects);

        List<CandidateDashboardResponse.ApplicationSummary> recent = applications.stream()
                .sorted((a, b) -> {
                    if (a.getAppliedAt() == null) return 1;
                    if (b.getAppliedAt() == null) return -1;
                    return b.getAppliedAt().compareTo(a.getAppliedAt());
                })
                .limit(5)
                .map(this::toSummary)
                .toList();

        long openJobs = jobRepository.countByStatus("OPEN");

        return CandidateDashboardResponse.builder()
                .fullName(profile.getFullName())
                .preferredRole(profile.getPreferredJobRole())
                .location(profile.getLocation())
                .profileCompletionPercent(completion.getPercent())
                .profileMissing(completion.getMissing())
                .careerReadinessScore(careerScore)
                .readinessBreakdown(readiness)
                .readinessNote("Career Readiness is a weighted profile signal — not a prediction of hiring success.")
                .resumeScore(resumeScore)
                .resumeUploaded(StringUtils.hasText(profile.getResumeStoragePath()))
                .resumeFileName(profile.getResumeFileName())
                .skillCount(skills.size())
                .skills(skills.stream()
                        .map(s -> CandidateDashboardResponse.SkillSlice.builder()
                                .name(s.getName())
                                .level(s.getLevel())
                                .build())
                        .toList())
                .applicationCount(applications.size())
                .interviewCount(interviews)
                .offerCount(offers)
                .applicationsByStatus(byStatus)
                .recentApplications(recent)
                .nextActions(buildNextActions(completion, profile, applications.size(), openJobs, skills.size()))
                .openJobsCount(openJobs)
                .build();
    }

    private Map<String, Integer> buildReadinessBreakdown(
            CandidateProfile profile,
            ProfileCompletionResponse completion,
            List<CandidateSkill> skills,
            List<Experience> experiences,
            List<Project> projects,
            List<Education> educations
    ) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("Profile", Math.min(100, completion.getPercent()));
        map.put("Resume", StringUtils.hasText(profile.getResumeStoragePath()) ? 90 : (StringUtils.hasText(profile.getBio()) ? 40 : 15));
        map.put("Technical skills", Math.min(100, skills.size() * 18));
        map.put("Experience", Math.min(100, experiences.isEmpty() ? (projects.isEmpty() ? 20 : 55) : 40 + Math.min(60, experiences.size() * 20)));
        int educationScore = educations.isEmpty() ? 25 : 75;
        int prefs = (StringUtils.hasText(profile.getPreferredJobRole()) && StringUtils.hasText(profile.getRemotePreference())) ? 80 : 35;
        map.put("Education", educationScore);
        map.put("Job market alignment", prefs);
        return map;
    }

    private int computeResumeScore(CandidateProfile profile, List<CandidateSkill> skills, List<Experience> experiences, List<Project> projects) {
        int score = 0;
        if (StringUtils.hasText(profile.getResumeStoragePath())) score += 40;
        if (StringUtils.hasText(profile.getBio())) score += 15;
        score += Math.min(20, skills.size() * 4);
        score += Math.min(15, experiences.size() * 8);
        score += Math.min(10, projects.size() * 5);
        return Math.min(100, score);
    }

    private List<CandidateDashboardResponse.NextAction> buildNextActions(
            ProfileCompletionResponse completion,
            CandidateProfile profile,
            int applicationCount,
            long openJobs,
            int skillCount
    ) {
        List<CandidateDashboardResponse.NextAction> actions = new ArrayList<>();

        if (!completion.isCanFinish() || completion.getPercent() < 80) {
            actions.add(CandidateDashboardResponse.NextAction.builder()
                    .title("Complete your profile")
                    .description(completion.getMissing().isEmpty()
                            ? "Strengthen missing career profile sections."
                            : completion.getMissing().get(0))
                    .ctaLabel("Continue setup")
                    .ctaPath("/onboarding")
                    .priority("high")
                    .build());
        }

        if (!StringUtils.hasText(profile.getResumeStoragePath())) {
            actions.add(CandidateDashboardResponse.NextAction.builder()
                    .title("Upload or build a resume")
                    .description("A resume unlocks stronger matching and ATS-style analysis.")
                    .ctaLabel("Open builder")
                    .ctaPath("/candidate/resume-builder")
                    .priority("high")
                    .build());
        }

        if (skillCount < 5) {
            actions.add(CandidateDashboardResponse.NextAction.builder()
                    .title("Add more skills")
                    .description("Candidates with 5+ skills see richer match explanations.")
                    .ctaLabel("Update skills")
                    .ctaPath("/onboarding")
                    .priority("medium")
                    .build());
        }

        if (applicationCount == 0 && openJobs > 0) {
            actions.add(CandidateDashboardResponse.NextAction.builder()
                    .title("Explore open roles")
                    .description(openJobs + " open job" + (openJobs == 1 ? "" : "s") + " are available to browse.")
                    .ctaLabel("Browse jobs")
                    .ctaPath("/candidate/jobs")
                    .priority("medium")
                    .build());
        } else if (applicationCount == 0) {
            actions.add(CandidateDashboardResponse.NextAction.builder()
                    .title("Your career journey starts here")
                    .description("No applications yet. Keep your profile sharp and check back for roles.")
                    .ctaLabel("Improve profile")
                    .ctaPath("/onboarding")
                    .priority("low")
                    .build());
        } else {
            // Always include high-impact learning roadmap action
            actions.add(CandidateDashboardResponse.NextAction.builder()
                    .title("Personalized Learning Roadmap")
                    .description("Explore your 30-day skill milestone plan and close key job gaps.")
                    .ctaLabel("View Roadmap")
                    .ctaPath("/career-roadmap")
                    .priority("high")
                    .build());
        }

        return actions.stream().limit(4).toList();
    }

    private CandidateDashboardResponse.ApplicationSummary toSummary(Application app) {
        String title = "Application";
        String company = "—";
        if (app.getJob() != null) {
            title = app.getJob().getTitle() != null ? app.getJob().getTitle() : title;
            if (app.getJob().getPostedBy() != null && app.getJob().getPostedBy().getCompany() != null) {
                company = app.getJob().getPostedBy().getCompany().getName();
            } else if (app.getJob().getPostedBy() != null) {
                company = app.getJob().getPostedBy().getFullName();
            }
        }
        return CandidateDashboardResponse.ApplicationSummary.builder()
                .id(app.getId())
                .jobTitle(title)
                .companyOrPoster(company)
                .status(app.getStatus())
                .matchScore(app.getCompatibilityScore())
                .appliedAt(app.getAppliedAt() != null ? app.getAppliedAt().format(DATE_FMT) : null)
                .build();
    }

    private long countStatus(Map<String, Long> byStatus, String... keys) {
        long total = 0;
        for (String key : keys) {
            total += byStatus.getOrDefault(key, 0L);
        }
        return total;
    }
}
