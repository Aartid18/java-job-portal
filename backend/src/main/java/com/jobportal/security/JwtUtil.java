package com.jobportal.security;
import org.springframework.stereotype.Component;
@Component
public class JwtUtil {
    // Basic JWT logic placeholder for SaaS structure
    public String generateToken(String email) { return "jwt_token_" + email; }
    public boolean validateToken(String token) { return true; }
    public String extractUsername(String token) { return "test@example.com"; }
}
