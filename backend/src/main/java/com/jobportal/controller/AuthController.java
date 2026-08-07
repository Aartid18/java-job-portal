package com.jobportal.controller;

import com.jobportal.dto.*;
import com.jobportal.service.AuthService;
import com.jobportal.service.OnboardingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;
    private final OnboardingService onboardingService;

    @PostMapping("/register")
    @Operation(summary = "Register a job seeker or recruiter")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Sign in and receive access + refresh tokens")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify email with token from registration email")
    public MessageResponse verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return authService.verifyEmail(request.getToken());
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend email verification link")
    public MessageResponse resendVerification(@Valid @RequestBody EmailRequest request) {
        return authService.resendVerification(request.getEmail());
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset email")
    public MessageResponse forgotPassword(@Valid @RequestBody EmailRequest request) {
        return authService.forgotPassword(request.getEmail());
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Exchange refresh token for a new access token")
    public AuthResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refresh(request.getRefreshToken());
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke refresh token")
    public MessageResponse logout(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.logout(request.getRefreshToken());
    }

    @GetMapping("/me")
    @Operation(summary = "Current authenticated user")
    public UserResponse me(Authentication authentication) {
        return authService.me(authentication.getName());
    }

    @PostMapping("/complete-onboarding")
    @Operation(summary = "Finish onboarding when profile requirements are met")
    public UserResponse completeOnboarding(Authentication authentication) {
        onboardingService.finish(authentication.getName());
        return authService.me(authentication.getName());
    }
}
