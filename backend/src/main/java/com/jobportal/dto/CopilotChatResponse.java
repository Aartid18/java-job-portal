package com.jobportal.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CopilotChatResponse {
    private String message;
    private String sender;
    private Long jobId;
    private String actionLink;
    private String actionLabel;
    private List<String> suggestedQuestions;
    private LocalDateTime timestamp;
}
