package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageResponse {
    private String message;
    /** Present only in non-production for local email verification / reset testing. */
    private String devToken;
}
