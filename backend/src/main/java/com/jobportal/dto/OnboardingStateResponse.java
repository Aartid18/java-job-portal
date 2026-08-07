package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OnboardingStateResponse {
    private BasicInfoDto basic;
    private List<EducationDto> educations;
    private List<SkillDto> skills;
    private List<ExperienceDto> experiences;
    private List<ProjectDto> projects;
    private PreferencesDto preferences;
    private ResumeInfoDto resume;
    private ProfileCompletionResponse completion;
    private boolean onboardingCompleted;

    @Data
    @Builder
    public static class BasicInfoDto {
        private String fullName;
        private String phone;
        private String location;
        private String bio;
        private String photoUrl;
    }

    @Data
    @Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class EducationDto {
        private Long id;
        private String degree;
        private String college;
        private String fieldOfStudy;
        private Integer startYear;
        private Integer graduationYear;
        private String cgpa;
    }

    @Data
    @Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SkillDto {
        private Long id;
        private String name;
        private String level;
    }

    @Data
    @Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ExperienceDto {
        private Long id;
        private String type;
        private String company;
        private String roleTitle;
        private String startDate;
        private String endDate;
        private String description;
    }

    @Data
    @Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ProjectDto {
        private Long id;
        private String name;
        private String description;
        private String technologies;
        private String githubUrl;
        private String liveUrl;
    }

    @Data
    @Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class PreferencesDto {
        private String preferredJobRole;
        private String preferredLocations;
        private String remotePreference;
        private String expectedSalary;
        private String experienceLevel;
        private String jobTypes;
    }

    @Data
    @Builder
    public static class ResumeInfoDto {
        private boolean uploaded;
        private String fileName;
    }
}
