package com.jobportal.controller;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Jobs")
public class JobController {

    private final JobService jobService;

    @PostMapping("/api/recruiter/jobs")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a job posting (recruiter)")
    public JobResponse create(Authentication auth, @Valid @RequestBody JobRequest request) {
        return jobService.create(auth.getName(), request);
    }

    @GetMapping("/api/recruiter/jobs")
    @Operation(summary = "List jobs posted by the authenticated recruiter")
    public List<JobResponse> listMine(Authentication auth) {
        return jobService.listForRecruiter(auth.getName());
    }

    @PutMapping("/api/recruiter/jobs/{id}")
    @Operation(summary = "Update own job posting")
    public JobResponse update(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request
    ) {
        return jobService.update(auth.getName(), id, request);
    }

    @GetMapping("/api/jobs")
    @Operation(summary = "List open jobs with pagination")
    public Page<JobResponse> listOpen(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.listOpenJobs(page, size);
    }

    @GetMapping("/api/jobs/{id}")
    @Operation(summary = "Get job by id")
    public JobResponse getById(@PathVariable Long id) {
        return jobService.getById(id);
    }
}
