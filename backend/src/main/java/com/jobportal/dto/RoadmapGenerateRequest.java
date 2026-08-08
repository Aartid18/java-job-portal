package com.jobportal.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapGenerateRequest {
    private Long jobId;
    private String targetRole;
    private Boolean regenerate;
}
