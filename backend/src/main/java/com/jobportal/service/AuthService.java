package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.*;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.*;
import com.jobportal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.HexFormat;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$"
    );

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${jwt.expiration}")
    private long accessExpirationMs;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshExpirationMs;

    @Value("${app.auth.verification-token-hours:24}")
    private long verificationTokenHours;

    @Value("${app.auth.reset-token-hours:1}")
    private long resetTokenHours;

    @Value("${app.dev-expose-tokens:true}")
    private boolean devExposeTokens;

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ApiException("Passwords do not match", 400);
        }
        validatePasswordStrength(request.getPassword());

        Role role = request.getAccountType();
        if (role != Role.JOB_SEEKER && role != Role.RECRUITER) {
            throw new ApiException("Invalid account type", 400);
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ApiException("An account with this email already exists", 409);
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isEmailVerified(false)
                .isActive(true)
                .onboardingCompleted(false)
                .build();
        user = userRepository.save(user);

        if (role == Role.JOB_SEEKER) {
            candidateProfileRepository.save(CandidateProfile.builder()
                    .user(user)
                    .fullName(request.getFullName().trim())
                    .build());
        } else {
            recruiterProfileRepository.save(RecruiterProfile.builder()
                    .user(user)
                    .fullName(request.getFullName().trim())
                    .build());
        }

        String token = createEmailVerificationToken(user);
        emailService.sendVerificationEmail(user.getEmail(), token);

        return MessageResponse.builder()
                .message("Check your email to verify your account.")
                .devToken(devExposeTokens ? token : null)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("Invalid email or password", 401));

        if (!user.isActive()) {
            throw new ApiException("This account has been suspended", 403);
        }
        if (!user.isEmailVerified()) {
            throw new ApiException("Please verify your email before signing in", 403);
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        return issueTokens(user, request.isRememberMe());
    }

    @Transactional
    public MessageResponse verifyEmail(String rawToken) {
        EmailVerificationToken token = emailVerificationTokenRepository.findByToken(rawToken)
                .orElseThrow(() -> new ApiException("Invalid or expired verification link", 400));

        if (token.isUsed() || token.isExpired()) {
            throw new ApiException("Invalid or expired verification link", 400);
        }

        User user = token.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        token.setUsedAt(Instant.now());
        emailVerificationTokenRepository.save(token);

        return MessageResponse.builder()
                .message("Email verified successfully. You can now sign in.")
                .build();
    }

    @Transactional
    public MessageResponse resendVerification(String email) {
        MessageResponse.MessageResponseBuilder response = MessageResponse.builder()
                .message("If that email exists, a verification link will be sent.");

        userRepository.findByEmail(email.trim().toLowerCase()).ifPresent(user -> {
            if (!user.isEmailVerified()) {
                emailVerificationTokenRepository.deleteByUser(user);
                emailVerificationTokenRepository.flush();
                String token = createEmailVerificationToken(user);
                emailService.sendVerificationEmail(user.getEmail(), token);
                if (devExposeTokens) {
                    response.devToken(token);
                }
            }
        });

        return response.build();
    }

    @Transactional
    public MessageResponse forgotPassword(String email) {
        String normalized = email.trim().toLowerCase();
        var userOpt = userRepository.findByEmail(normalized);

        // Always same response to avoid email enumeration
        MessageResponse.MessageResponseBuilder response = MessageResponse.builder()
                .message("If that email exists, a password reset link will be sent.");

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            passwordResetTokenRepository.deleteByUser(user);
            passwordResetTokenRepository.flush();
            String token = createPasswordResetToken(user);
            emailService.sendPasswordResetEmail(user.getEmail(), token);
            if (devExposeTokens) {
                response.devToken(token);
            }
        }

        return response.build();
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ApiException("Passwords do not match", 400);
        }
        validatePasswordStrength(request.getNewPassword());

        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ApiException("Invalid or expired reset link", 400));

        if (token.isUsed() || token.isExpired()) {
            throw new ApiException("Invalid or expired reset link", 400);
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(token);

        // Invalidate other reset tokens + refresh sessions
        passwordResetTokenRepository.deleteByUser(user);
        refreshTokenRepository.deleteByUser(user);

        return MessageResponse.builder()
                .message("Password updated successfully. You can now sign in.")
                .build();
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        RefreshToken stored = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new ApiException("Invalid refresh token", 401));

        if (stored.isRevoked() || stored.isExpired()) {
            throw new ApiException("Refresh token expired. Please sign in again.", 401);
        }

        User user = stored.getUser();
        if (!user.isActive()) {
            throw new ApiException("This account has been suspended", 403);
        }

        stored.setRevokedAt(Instant.now());
        refreshTokenRepository.save(stored);

        return issueTokens(user, false);
    }

    @Transactional
    public MessageResponse logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue).ifPresent(token -> {
            token.setRevokedAt(Instant.now());
            refreshTokenRepository.save(token);
        });
        return MessageResponse.builder().message("Signed out successfully").build();
    }

    @Transactional(readOnly = true)
    public UserResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        return toUserResponse(user);
    }

    /** Phase 2 bridge — replaced by real multi-step onboarding in Phase 3. */
    @Transactional
    public UserResponse markOnboardingComplete(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        user.setOnboardingCompleted(true);
        userRepository.save(user);
        return toUserResponse(user);
    }

    private AuthResponse issueTokens(User user, boolean rememberMe) {
        String access = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name(), user.getId());
        long refreshTtl = rememberMe ? refreshExpirationMs * 2 : refreshExpirationMs;
        String refreshValue = generateSecureToken(48);

        refreshTokenRepository.save(RefreshToken.builder()
                .token(refreshValue)
                .user(user)
                .expiresAt(Instant.now().plusMillis(refreshTtl))
                .build());

        return AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refreshValue)
                .tokenType("Bearer")
                .expiresInMs(accessExpirationMs)
                .user(toUserResponse(user))
                .build();
    }

    private String createEmailVerificationToken(User user) {
        String value = generateSecureToken(32);
        emailVerificationTokenRepository.save(EmailVerificationToken.builder()
                .token(value)
                .user(user)
                .expiresAt(Instant.now().plusSeconds(verificationTokenHours * 3600))
                .build());
        return value;
    }

    private String createPasswordResetToken(User user) {
        String value = generateSecureToken(32);
        passwordResetTokenRepository.save(PasswordResetToken.builder()
                .token(value)
                .user(user)
                .expiresAt(Instant.now().plusSeconds(resetTokenHours * 3600))
                .build());
        return value;
    }

    private String generateSecureToken(int byteLength) {
        byte[] bytes = new byte[byteLength];
        secureRandom.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private void validatePasswordStrength(String password) {
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new ApiException(
                    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
                    400
            );
        }
    }

    private UserResponse toUserResponse(User user) {
        String fullName = resolveFullName(user);
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(fullName)
                .role(user.getRole())
                .emailVerified(user.isEmailVerified())
                .active(user.isActive())
                .onboardingCompleted(user.isOnboardingCompleted())
                .build();
    }

    private String resolveFullName(User user) {
        if (user.getRole() == Role.JOB_SEEKER) {
            return candidateProfileRepository.findById(user.getId())
                    .map(CandidateProfile::getFullName)
                    .orElse(null);
        }
        if (user.getRole() == Role.RECRUITER) {
            return recruiterProfileRepository.findById(user.getId())
                    .map(RecruiterProfile::getFullName)
                    .orElse(null);
        }
        return null;
    }
}
