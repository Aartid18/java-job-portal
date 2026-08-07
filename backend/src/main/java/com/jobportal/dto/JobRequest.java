package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JobRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 10_000)
    private String description;

    @Size(max = 200)
    private String location;

    @Size(max = 100)
    private String salaryRange;

    @Size(max = 2000)
    private String requiredSkills;

    private Integer requiredExperienceYears;
}
