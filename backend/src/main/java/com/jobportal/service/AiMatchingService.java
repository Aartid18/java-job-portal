package com.jobportal.service;
import org.springframework.stereotype.Service;

@Service
public class AiMatchingService {
    public Double calculateCompatibilityScore(String candidateSkills, String jobRequiredSkills) {
        // AI logic placeholder: Match skills, experience, location
        // Explainable Ranking
        return 87.5;
    }
    
    public String generateSkillGapAnalysis(String candidateSkills, String jobRequiredSkills) {
        // Generates the "WHAT YOU ARE MISSING" map
        return "{\"missingCritical\": [\"Docker\"], \"missingOptional\": [\"Kubernetes\"]}";
    }
}
