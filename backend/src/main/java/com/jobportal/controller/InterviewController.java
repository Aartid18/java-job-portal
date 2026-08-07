package com.jobportal.controller;

import com.jobportal.dto.InterviewResponse;
import com.jobportal.dto.ScheduleInterviewRequest;
import com.jobportal.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Interviews")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/api/recruiter/interviews")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Schedule an interview for an application")
    public InterviewResponse schedule(Authentication auth, @Valid @RequestBody ScheduleInterviewRequest request) {
        return interviewService.schedule(auth.getName(), request);
    }

    @GetMapping("/api/recruiter/interviews")
    @Operation(summary = "List interviews for recruiter jobs")
    public List<InterviewResponse> listRecruiter(Authentication auth) {
        return interviewService.listForRecruiter(auth.getName());
    }

    @GetMapping("/api/candidate/interviews")
    @Operation(summary = "List interviews for the candidate")
    public List<InterviewResponse> listCandidate(Authentication auth) {
        return interviewService.listForCandidate(auth.getName());
    }
}
