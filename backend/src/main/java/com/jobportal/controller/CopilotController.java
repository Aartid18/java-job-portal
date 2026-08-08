package com.jobportal.controller;

import com.jobportal.dto.ChatMessageDto;
import com.jobportal.dto.CopilotChatRequest;
import com.jobportal.dto.CopilotChatResponse;
import com.jobportal.dto.MessageResponse;
import com.jobportal.service.CareerCopilotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/copilot")
@RequiredArgsConstructor
@Tag(name = "Career Copilot", description = "AI Career Copilot grounded in authenticated candidate profile and job context")
public class CopilotController {

    private final CareerCopilotService careerCopilotService;

    @PostMapping("/chat")
    @Operation(summary = "Chat with AI Career Copilot using candidate profile and optional job context")
    public CopilotChatResponse chat(
            Authentication authentication,
            @Valid @RequestBody CopilotChatRequest request
    ) {
        return careerCopilotService.processChat(authentication.getName(), request);
    }

    @GetMapping("/history")
    @Operation(summary = "Get persistent chat history for authenticated candidate")
    public List<ChatMessageDto> history(Authentication authentication) {
        return careerCopilotService.getHistory(authentication.getName());
    }

    @DeleteMapping("/history")
    @Operation(summary = "Clear chat history for authenticated candidate")
    public MessageResponse clearHistory(Authentication authentication) {
        careerCopilotService.clearHistory(authentication.getName());
        return MessageResponse.builder()
                .message("Chat history cleared successfully")
                .build();
    }
}
