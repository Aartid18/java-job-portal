package com.jobportal.controller;

import com.jobportal.dto.CandidateDashboardResponse;
import com.jobportal.service.CandidateDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
@Tag(name = "Candidate Dashboard")
public class CandidateDashboardController {

    private final CandidateDashboardService candidateDashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "Career dashboard with real profile and application metrics")
    public CandidateDashboardResponse dashboard(Authentication authentication) {
        return candidateDashboardService.getDashboard(authentication.getName());
    }
}
