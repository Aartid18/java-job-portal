package com.jobportal.controller;

import com.jobportal.dto.RoadmapGenerateRequest;
import com.jobportal.dto.RoadmapProgressUpdateRequest;
import com.jobportal.dto.RoadmapResponse;
import com.jobportal.dto.SkillGapDetailResponse;
import com.jobportal.service.CareerRoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
@Tag(name = "Career Roadmap & Skill Gap", description = "Personalized learning roadmap and explainable skill gap engine")
public class CareerRoadmapController {

    private final CareerRoadmapService careerRoadmapService;

    @GetMapping({"/skill-gap/{jobId}", "/skill-gap"})
    @Operation(summary = "Get deep skill-gap analysis comparing authenticated candidate against a target role")
    public SkillGapDetailResponse getSkillGap(
            Authentication authentication,
            @PathVariable(required = false) Long jobId
    ) {
        return careerRoadmapService.getSkillGapDetail(authentication.getName(), jobId);
    }

    @PostMapping("/roadmap")
    @Operation(summary = "Generate or regenerate a personalized 30-day learning roadmap")
    public RoadmapResponse generateRoadmap(
            Authentication authentication,
            @RequestBody(required = false) RoadmapGenerateRequest request
    ) {
        return careerRoadmapService.generateOrGetRoadmap(authentication.getName(), request);
    }

    @GetMapping("/roadmap")
    @Operation(summary = "Get current saved learning roadmap and progress milestones")
    public RoadmapResponse getRoadmap(Authentication authentication) {
        return careerRoadmapService.getRoadmap(authentication.getName());
    }

    @PatchMapping("/roadmap/progress")
    @Operation(summary = "Update learning progress for a skill or roadmap milestone")
    public RoadmapResponse updateProgress(
            Authentication authentication,
            @Valid @RequestBody RoadmapProgressUpdateRequest request
    ) {
        return careerRoadmapService.updateProgress(authentication.getName(), request);
    }
}
