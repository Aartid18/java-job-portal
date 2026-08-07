package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class CandidateDashboardResponse {
    private String fullName;
    private String preferredRole;
    private String location;

    private int profileCompletionPercent;
    private List<String> profileMissing;

    private int careerReadinessScore;
    private Map<String, Integer> readinessBreakdown;
    private String readinessNote;

    private int resumeScore;
    private boolean resumeUploaded;
    private String resumeFileName;

    private int skillCount;
    private List<SkillSlice> skills;

    private long applicationCount;
    private long interviewCount;
    private long offerCount;
    private Map<String, Long> applicationsByStatus;

    private List<ApplicationSummary> recentApplications;
    private List<NextAction> nextActions;

    private long openJobsCount;

    @Data
    @Builder
    public static class SkillSlice {
        private String name;
        private String level;
    }

    @Data
    @Builder
    public static class ApplicationSummary {
        private Long id;
        private String jobTitle;
        private String companyOrPoster;
        private String status;
        private Double matchScore;
        private String appliedAt;
    }

    @Data
    @Builder
    public static class NextAction {
        private String title;
        private String description;
        private String ctaLabel;
        private String ctaPath;
        private String priority; // high | medium | low
    }
}
