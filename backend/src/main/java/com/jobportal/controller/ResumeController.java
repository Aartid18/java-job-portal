package com.jobportal.controller;

import com.jobportal.dto.*;
import com.jobportal.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/resumes")
@RequiredArgsConstructor
@Tag(name = "Candidate Resumes")
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    @Operation(summary = "List resume versions for the authenticated candidate")
    public List<ResumeVersionResponse> list(Authentication auth) {
        return resumeService.list(auth.getName());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a resume version by id")
    public ResumeVersionResponse get(Authentication auth, @PathVariable Long id) {
        return resumeService.get(auth.getName(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a resume version")
    public ResumeVersionResponse create(Authentication auth, @Valid @RequestBody ResumeVersionRequest request) {
        return resumeService.create(auth.getName(), request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a resume version")
    public ResumeVersionResponse update(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody ResumeVersionRequest request
    ) {
        return resumeService.update(auth.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a resume version")
    public void delete(Authentication auth, @PathVariable Long id) {
        resumeService.delete(auth.getName(), id);
    }

    @PostMapping(value = "/analyze", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE, MediaType.ALL_VALUE})
    @Operation(summary = "Analyze uploaded PDF or stored resume (keyword/ATS heuristics only)")
    public ResumeAnalysisResponse analyze(
            Authentication auth,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return resumeService.analyzeUploadedResume(auth.getName(), file);
    }

    @PostMapping("/enhance-bullet")
    @Operation(summary = "Rewrite a bullet with stronger action verbs (no invented metrics)")
    public EnhanceBulletResponse enhanceBullet(
            Authentication auth,
            @Valid @RequestBody EnhanceBulletRequest request
    ) {
        return resumeService.enhanceBullet(request.getText());
    }
}
