package com.jobportal.service;

import com.jobportal.dto.InterviewResponse;
import com.jobportal.dto.ScheduleInterviewRequest;
import com.jobportal.entity.*;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public InterviewResponse schedule(String email, ScheduleInterviewRequest request) {
        RecruiterProfile recruiter = requireRecruiter(email);
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ApiException("Application not found", 404));
        if (application.getJob() == null
                || application.getJob().getPostedBy() == null
                || !recruiter.getId().equals(application.getJob().getPostedBy().getId())) {
            throw new ApiException("You can only schedule interviews for your own jobs", 403);
        }

        Interview interview = Interview.builder()
                .application(application)
                .scheduledAt(request.getScheduledAt())
                .meetingLink(request.getMeetingLink())
                .notes(request.getNotes())
                .status("SCHEDULED")
                .build();
        Interview saved = interviewRepository.save(interview);

        application.setStatus("INTERVIEW");
        applicationRepository.save(application);

        if (application.getCandidate() != null && application.getCandidate().getUser() != null) {
            notificationService.notifyUser(
                    application.getCandidate().getUser(),
                    "Interview scheduled",
                    "Interview for " + application.getJob().getTitle()
                            + " on " + request.getScheduledAt()
            );
        }

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> listForRecruiter(String email) {
        RecruiterProfile recruiter = requireRecruiter(email);
        return interviewRepository.findByApplicationJobPostedByIdOrderByScheduledAtDesc(recruiter.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> listForCandidate(String email) {
        CandidateProfile candidate = requireCandidate(email);
        return interviewRepository.findByApplicationCandidateIdOrderByScheduledAtDesc(candidate.getId())
                .stream().map(this::toResponse).toList();
    }

    private RecruiterProfile requireRecruiter(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        if (user.getRole() != Role.RECRUITER && user.getRole() != Role.ADMIN) {
            throw new ApiException("Only recruiters can schedule interviews", 403);
        }
        return recruiterProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Recruiter profile not found", 404));
    }

    private CandidateProfile requireCandidate(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        return candidateProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Candidate profile not found", 404));
    }

    private InterviewResponse toResponse(Interview i) {
        Application app = i.getApplication();
        return InterviewResponse.builder()
                .id(i.getId())
                .applicationId(app != null ? app.getId() : null)
                .jobTitle(app != null && app.getJob() != null ? app.getJob().getTitle() : null)
                .candidateName(app != null && app.getCandidate() != null ? app.getCandidate().getFullName() : null)
                .scheduledAt(i.getScheduledAt())
                .meetingLink(i.getMeetingLink())
                .notes(i.getNotes())
                .status(i.getStatus())
                .build();
    }
}
