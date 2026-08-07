package com.jobportal.controller;

import com.jobportal.dto.BasicInfoRequest;
import com.jobportal.dto.OnboardingStateResponse;
import com.jobportal.service.OnboardingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/onboarding")
@RequiredArgsConstructor
@Tag(name = "Candidate Onboarding")
public class CandidateOnboardingController {

    private final OnboardingService onboardingService;

    @GetMapping
    @Operation(summary = "Get onboarding state and profile completion")
    public OnboardingStateResponse getState(Authentication auth) {
        return onboardingService.getState(auth.getName());
    }

    @PutMapping("/basic")
    public OnboardingStateResponse saveBasic(Authentication auth, @Valid @RequestBody BasicInfoRequest request) {
        return onboardingService.saveBasic(auth.getName(), request);
    }

    @PutMapping("/education")
    public OnboardingStateResponse saveEducation(
            Authentication auth,
            @RequestBody List<OnboardingStateResponse.EducationDto> items
    ) {
        return onboardingService.saveEducations(auth.getName(), items);
    }

    @PutMapping("/skills")
    public OnboardingStateResponse saveSkills(
            Authentication auth,
            @RequestBody List<OnboardingStateResponse.SkillDto> items
    ) {
        return onboardingService.saveSkills(auth.getName(), items);
    }

    @PutMapping("/experience")
    public OnboardingStateResponse saveExperience(
            Authentication auth,
            @RequestBody List<OnboardingStateResponse.ExperienceDto> items
    ) {
        return onboardingService.saveExperiences(auth.getName(), items);
    }

    @PutMapping("/projects")
    public OnboardingStateResponse saveProjects(
            Authentication auth,
            @RequestBody List<OnboardingStateResponse.ProjectDto> items
    ) {
        return onboardingService.saveProjects(auth.getName(), items);
    }

    @PutMapping("/preferences")
    public OnboardingStateResponse savePreferences(
            Authentication auth,
            @RequestBody OnboardingStateResponse.PreferencesDto prefs
    ) {
        return onboardingService.savePreferences(auth.getName(), prefs);
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public OnboardingStateResponse uploadResume(Authentication auth, @RequestPart("file") MultipartFile file) {
        return onboardingService.uploadResume(auth.getName(), file);
    }

    @PostMapping("/resume/skip")
    public OnboardingStateResponse skipResume(Authentication auth) {
        return onboardingService.skipResume(auth.getName());
    }

    @PostMapping("/finish")
    public OnboardingStateResponse finish(Authentication auth) {
        return onboardingService.finish(auth.getName());
    }
}
