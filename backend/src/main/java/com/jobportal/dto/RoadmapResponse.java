package com.jobportal.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapResponse {
    private Long id;
    private String targetRole;
    private Long targetJobId;
    private String targetJobTitle;
    private int currentReadiness;
    private int overallProgress;
    private List<SkillGapDetailResponse.PrioritizedSkillGap> mainSkillGaps;
    private List<RoadmapWeekDto> weeks;
    private List<RoadmapProjectDto> projectRecommendations;
    private List<SkillProgressDto> skillProgressList;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapWeekDto {
        private int weekNumber;
        private String skillFocus;
        private String priority;
        private String weeklyGoal;
        private List<RoadmapDayDto> days;
        private LearningResourceDto learningResources;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapDayDto {
        private int dayNumber;
        private String title;
        private String task;
        private String practicePrompt;
        private boolean completed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LearningResourceDto {
        private String skillName;
        private String officialDocTitle;
        private String officialDocUrl;
        private List<String> freeResources;
        private List<String> practiceSuggestions;
        private String practicalProjectIdea;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapProjectDto {
        private String skillName;
        private String title;
        private String description;
        private String practicalArchitecture;
        private List<String> deliverables;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillProgressDto {
        private String skillName;
        private String priority;
        private String status;
        private int progressPercent;
        private LocalDateTime updatedAt;
    }
}
