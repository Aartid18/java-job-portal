package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResumeVersionResponse {
    private Long id;
    private String title;
    private String templateName;
    private String contentJson;
    private LocalDateTime updatedAt;
}
