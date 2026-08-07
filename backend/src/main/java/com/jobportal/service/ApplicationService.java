package com.jobportal.service;

import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.ApplyJobRequest;
import com.jobportal.dto.UpdateApplicationStatusRequest;
import com.jobportal.entity.*;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "APPLIED", "SHORTLISTED", "INTERVIEW", "REJECTED", "HIRED", "OFFER", "ASSESSMENT"
    );

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final MatchingService matchingService;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse apply(String email, ApplyJobRequest request) {
        CandidateProfile candidate = requireCandidate(email);
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ApiException("Job not found", 404));
        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw new ApiException("This job is not open for applications", 400);
        }
        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            throw new ApiException("You have already applied to this job", 409);
        }

        String candidateSkills = resolveCandidateSkillsCsv(candidate);
        Double score = matchingService.calculateCompatibilityScore(candidateSkills, job.getRequiredSkills());
        String gap = matchingService.generateSkillGapAnalysis(candidateSkills, job.getRequiredSkills());

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .compatibilityScore(score)
                .skillGapAnalysis(gap)
                .build();
        return toResponse(applicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listForCandidate(String email) {
        CandidateProfile candidate = requireCandidate(email);
        return applicationRepository.findByCandidateId(candidate.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listForRecruiter(String email, Long jobId) {
        RecruiterProfile recruiter = requireRecruiter(email);
        if (jobId != null) {
            Job job = jobRepository.findByIdAndPostedById(jobId, recruiter.getId())
                    .orElseThrow(() -> new ApiException("Job not found or you do not own this job", 404));
            return applicationRepository.findByJobId(job.getId()).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return applicationRepository.findByJobPostedById(recruiter.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ApplicationResponse updateStatus(String email, Long applicationId, UpdateApplicationStatusRequest request) {
        RecruiterProfile recruiter = requireRecruiter(email);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApiException("Application not found", 404));
        if (application.getJob() == null
                || application.getJob().getPostedBy() == null
                || !recruiter.getId().equals(application.getJob().getPostedBy().getId())) {
            throw new ApiException("You can only update applications for your own jobs", 403);
        }
        String status = request.getStatus().trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new ApiException("Invalid status. Allowed: " + String.join(", ", ALLOWED_STATUSES), 400);
        }
        application.setStatus(status);
        Application saved = applicationRepository.save(application);
        if (saved.getCandidate() != null && saved.getCandidate().getUser() != null) {
            String jobTitle = saved.getJob() != null ? saved.getJob().getTitle() : "a role";
            notificationService.notifyUser(
                    saved.getCandidate().getUser(),
                    "Application update",
                    "Your application for " + jobTitle + " is now " + status
            );
        }
        return toResponse(saved);
    }

    private String resolveCandidateSkillsCsv(CandidateProfile candidate) {
        List<CandidateSkill> structured = candidateSkillRepository.findByCandidateId(candidate.getId());
        if (!structured.isEmpty()) {
            return structured.stream().map(CandidateSkill::getName).collect(Collectors.joining(","));
        }
        return candidate.getSkills();
    }

    private CandidateProfile requireCandidate(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        if (user.getRole() != Role.JOB_SEEKER && user.getRole() != Role.ADMIN) {
            throw new ApiException("Only job seekers can apply to jobs", 403);
        }
        return candidateProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Candidate profile not found", 404));
    }

    private RecruiterProfile requireRecruiter(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        if (user.getRole() != Role.RECRUITER && user.getRole() != Role.ADMIN) {
            throw new ApiException("Only recruiters can manage applications", 403);
        }
        return recruiterProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Recruiter profile not found", 404));
    }

    private ApplicationResponse toResponse(Application app) {
        String jobTitle = null;
        Long jobId = null;
        String companyOrPoster = null;
        if (app.getJob() != null) {
            jobId = app.getJob().getId();
            jobTitle = app.getJob().getTitle();
            if (app.getJob().getPostedBy() != null) {
                if (app.getJob().getPostedBy().getCompany() != null
                        && StringUtils.hasText(app.getJob().getPostedBy().getCompany().getName())) {
                    companyOrPoster = app.getJob().getPostedBy().getCompany().getName();
                } else {
                    companyOrPoster = app.getJob().getPostedBy().getFullName();
                }
            }
        }
        Long candidateId = app.getCandidate() != null ? app.getCandidate().getId() : null;
        String candidateName = app.getCandidate() != null ? app.getCandidate().getFullName() : null;

        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(jobId)
                .jobTitle(jobTitle)
                .companyOrPoster(companyOrPoster)
                .candidateId(candidateId)
                .candidateName(candidateName)
                .status(app.getStatus())
                .compatibilityScore(app.getCompatibilityScore())
                .skillGapAnalysis(app.getSkillGapAnalysis())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
