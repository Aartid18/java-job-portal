package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapProgressUpdateRequest {
    @NotBlank(message = "Skill name is required")
    private String skillName;

    /** NOT_STARTED | IN_PROGRESS | COMPLETED */
    private String status;

    private Integer progressPercent;
}
