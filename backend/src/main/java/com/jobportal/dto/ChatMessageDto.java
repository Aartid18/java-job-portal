package com.jobportal.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
    private Long id;
    private String sender;
    private String message;
    private Long jobId;
    private String actionLink;
    private String actionLabel;
    private LocalDateTime createdAt;
}
