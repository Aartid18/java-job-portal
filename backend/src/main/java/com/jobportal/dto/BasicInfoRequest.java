package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BasicInfoRequest {
    @NotBlank
    @Size(min = 2, max = 100)
    private String fullName;

    private String phone;
    private String location;

    @Size(max = 2000)
    private String bio;

    private String photoUrl;
}
