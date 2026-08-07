package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyOrPoster;
    private Long candidateId;
    private String candidateName;
    private String status;
    private Double compatibilityScore;
    private String skillGapAnalysis;
    private LocalDateTime appliedAt;
}
