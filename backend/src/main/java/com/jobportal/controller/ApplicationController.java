package com.jobportal.controller;

import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.ApplyJobRequest;
import com.jobportal.dto.UpdateApplicationStatusRequest;
import com.jobportal.service.ApplicationService;
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
@Tag(name = "Applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/api/candidate/applications")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Apply to a job (computes match score)")
    public ApplicationResponse apply(Authentication auth, @Valid @RequestBody ApplyJobRequest request) {
        return applicationService.apply(auth.getName(), request);
    }

    @GetMapping("/api/candidate/applications")
    @Operation(summary = "List applications for the authenticated candidate")
    public List<ApplicationResponse> listMine(Authentication auth) {
        return applicationService.listForCandidate(auth.getName());
    }

    @GetMapping("/api/recruiter/applications")
    @Operation(summary = "List applications for recruiter jobs (optional jobId filter)")
    public List<ApplicationResponse> listForRecruiter(
            Authentication auth,
            @RequestParam(required = false) Long jobId
    ) {
        return applicationService.listForRecruiter(auth.getName(), jobId);
    }

    @PatchMapping("/api/recruiter/applications/{id}/status")
    @Operation(summary = "Update application status for own job")
    public ApplicationResponse updateStatus(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request
    ) {
        return applicationService.updateStatus(auth.getName(), id, request);
    }
}
