package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    @Transactional
    public JobResponse create(String email, JobRequest request) {
        RecruiterProfile recruiter = requireRecruiter(email);
        Job job = Job.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .location(blankToNull(request.getLocation()))
                .salaryRange(blankToNull(request.getSalaryRange()))
                .requiredSkills(blankToNull(request.getRequiredSkills()))
                .requiredExperienceYears(request.getRequiredExperienceYears())
                .postedBy(recruiter)
                .build();
        Job saved = jobRepository.save(job);
        return toResponse(saved, computeQualityScore(saved));
    }

    @Transactional(readOnly = true)
    public java.util.List<JobResponse> listForRecruiter(String email) {
        RecruiterProfile recruiter = requireRecruiter(email);
        return jobRepository.findByPostedByIdOrderByCreatedAtDesc(recruiter.getId()).stream()
                .map(j -> toResponse(j, computeQualityScore(j)))
                .toList();
    }

    @Transactional
    public JobResponse update(String email, Long id, JobRequest request) {
        RecruiterProfile recruiter = requireRecruiter(email);
        Job job = jobRepository.findByIdAndPostedById(id, recruiter.getId())
                .orElseThrow(() -> new ApiException("Job not found or you do not own this job", 404));
        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setLocation(blankToNull(request.getLocation()));
        job.setSalaryRange(blankToNull(request.getSalaryRange()));
        job.setRequiredSkills(blankToNull(request.getRequiredSkills()));
        job.setRequiredExperienceYears(request.getRequiredExperienceYears());
        Job saved = jobRepository.save(job);
        return toResponse(saved, computeQualityScore(saved));
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> listOpenJobs(int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(50, Math.max(1, size));
        PageRequest pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        return jobRepository.findByStatus("OPEN", pageable)
                .map(j -> toResponse(j, computeQualityScore(j)));
    }

    @Transactional(readOnly = true)
    public JobResponse getById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ApiException("Job not found", 404));
        return toResponse(job, computeQualityScore(job));
    }

    int computeQualityScore(Job job) {
        int score = 0;
        if (StringUtils.hasText(job.getTitle()) && job.getTitle().trim().length() >= 5) score += 15;
        String desc = job.getDescription() != null ? job.getDescription().trim() : "";
        if (desc.length() >= 80) score += 20;
        if (desc.length() >= 250) score += 10;
        if (StringUtils.hasText(job.getLocation())) score += 10;
        if (StringUtils.hasText(job.getSalaryRange())) score += 15;
        if (StringUtils.hasText(job.getRequiredSkills())) {
            long skillCount = countSkills(job.getRequiredSkills());
            score += Math.min(20, (int) skillCount * 4);
        }
        if (job.getRequiredExperienceYears() != null && job.getRequiredExperienceYears() >= 0) score += 10;
        return Math.min(100, score);
    }

    private long countSkills(String skills) {
        return java.util.Arrays.stream(skills.split("[,;|]"))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .count();
    }

    private RecruiterProfile requireRecruiter(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        if (user.getRole() != Role.RECRUITER && user.getRole() != Role.ADMIN) {
            throw new ApiException("Only recruiters can manage jobs", 403);
        }
        return recruiterProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Recruiter profile not found", 404));
    }

    private JobResponse toResponse(Job job, int qualityScore) {
        String recruiterName = null;
        String companyName = null;
        Long recruiterId = null;
        if (job.getPostedBy() != null) {
            recruiterId = job.getPostedBy().getId();
            recruiterName = job.getPostedBy().getFullName();
            if (job.getPostedBy().getCompany() != null) {
                companyName = job.getPostedBy().getCompany().getName();
            }
        }
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salaryRange(job.getSalaryRange())
                .requiredSkills(job.getRequiredSkills())
                .requiredExperienceYears(job.getRequiredExperienceYears())
                .status(job.getStatus())
                .recruiterId(recruiterId)
                .recruiterName(recruiterName)
                .companyName(companyName)
                .createdAt(job.getCreatedAt())
                .jobQualityScore(qualityScore)
                .build();
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
