package com.jobportal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleInterviewRequest {
    @NotNull
    private Long applicationId;

    @NotNull
    private LocalDateTime scheduledAt;

    private String meetingLink;
    private String notes;
}
