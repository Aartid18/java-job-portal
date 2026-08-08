package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CopilotChatRequest {
    @NotBlank(message = "Message cannot be blank")
    private String message;

    private Long jobId;
}
