package com.jobportal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplyJobRequest {
    @NotNull
    private Long jobId;
}
