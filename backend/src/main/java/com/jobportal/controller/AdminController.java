package com.jobportal.controller;

import com.jobportal.dto.AdminOverviewResponse;
import com.jobportal.entity.Role;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @GetMapping("/overview")
    @Operation(summary = "Platform counts for admins")
    public AdminOverviewResponse overview() {
        return AdminOverviewResponse.builder()
                .users(userRepository.count())
                .candidates(userRepository.countByRole(Role.JOB_SEEKER))
                .recruiters(userRepository.countByRole(Role.RECRUITER))
                .openJobs(jobRepository.countByStatus("OPEN"))
                .applications(applicationRepository.count())
                .build();
    }
}
