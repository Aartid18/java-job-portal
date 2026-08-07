package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResumeVersionRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    @Size(max = 100)
    private String templateName;

    @Size(max = 500_000)
    private String contentJson;
}
