package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnhanceBulletResponse {
    private String original;
    private String enhanced;
}
