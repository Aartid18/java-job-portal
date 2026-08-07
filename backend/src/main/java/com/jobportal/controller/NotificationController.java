package com.jobportal.controller;

import com.jobportal.dto.NotificationResponse;
import com.jobportal.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "List notifications for the authenticated user")
    public List<NotificationResponse> list(Authentication auth) {
        return notificationService.listForEmail(auth.getName());
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public NotificationResponse markRead(Authentication auth, @PathVariable Long id) {
        return notificationService.markRead(auth.getName(), id);
    }
}
