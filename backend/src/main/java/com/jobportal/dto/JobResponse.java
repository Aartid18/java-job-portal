package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String salaryRange;
    private String requiredSkills;
    private Integer requiredExperienceYears;
    private String status;
    private Long recruiterId;
    private String recruiterName;
    private String companyName;
    private LocalDateTime createdAt;
    private Integer jobQualityScore;
}
