package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InterviewResponse {
    private Long id;
    private Long applicationId;
    private String jobTitle;
    private String candidateName;
    private LocalDateTime scheduledAt;
    private String meetingLink;
    private String notes;
    private String status;
}
