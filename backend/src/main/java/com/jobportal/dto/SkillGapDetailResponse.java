package com.jobportal.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGapDetailResponse {
    private Long jobId;
    private String jobTitle;
    private String companyOrPoster;
    private String targetRole;
    private int overallReadiness;
    private int technicalSkillsScore;
    private int requiredToolsScore;
    private int experienceScore;
    private int resumeEvidenceScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> partialSkills;
    private List<PrioritizedSkillGap> prioritizedGaps;
    private List<String> nextRecommendations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PrioritizedSkillGap {
        private String skillName;
        /** HIGH | MEDIUM | LOW */
        private String priority;
        private String reason;
        private boolean isRequired;
        private int frequencyInDescription;
        private String recommendedProject;
        private String roadmapLink;
    }
}
