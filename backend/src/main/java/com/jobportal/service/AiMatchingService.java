package com.jobportal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiMatchingService {

    private final MatchingService matchingService;

    public Double calculateCompatibilityScore(String candidateSkills, String jobRequiredSkills) {
        return matchingService.calculateCompatibilityScore(candidateSkills, jobRequiredSkills);
    }

    public String generateSkillGapAnalysis(String candidateSkills, String jobRequiredSkills) {
        return matchingService.generateSkillGapAnalysis(candidateSkills, jobRequiredSkills);
    }
}
