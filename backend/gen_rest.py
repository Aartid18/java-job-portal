import os

base_pkg = "src/main/java/com/jobportal"

files = {
    "security/JwtUtil.java": """package com.jobportal.security;
import org.springframework.stereotype.Component;
@Component
public class JwtUtil {
    // Basic JWT logic placeholder for SaaS structure
    public String generateToken(String email) { return "jwt_token_" + email; }
    public boolean validateToken(String token) { return true; }
    public String extractUsername(String token) { return "test@example.com"; }
}
""",
    "security/SecurityConfig.java": """package com.jobportal.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
""",
    "dto/AuthRequest.java": """package com.jobportal.dto;
import lombok.Data;
@Data
public class AuthRequest {
    private String email;
    private String password;
}
""",
    "controller/AuthController.java": """package com.jobportal.controller;
import com.jobportal.dto.AuthRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        return "JWT_TOKEN";
    }

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        return "User Registered Successfully";
    }
}
""",
    "service/AiMatchingService.java": """package com.jobportal.service;
import org.springframework.stereotype.Service;

@Service
public class AiMatchingService {
    public Double calculateCompatibilityScore(String candidateSkills, String jobRequiredSkills) {
        // AI logic placeholder: Match skills, experience, location
        // Explainable Ranking
        return 87.5;
    }
    
    public String generateSkillGapAnalysis(String candidateSkills, String jobRequiredSkills) {
        // Generates the "WHAT YOU ARE MISSING" map
        return "{\\"missingCritical\\": [\\"Docker\\"], \\"missingOptional\\": [\\"Kubernetes\\"]}";
    }
}
""",
    "service/ResumeAnalyzerService.java": """package com.jobportal.service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeAnalyzerService {
    public String analyzeResume(MultipartFile file) {
        // Extract text using PDFBox
        // Identify skills, compare with profile
        // Generate completeness score
        return "{\\"score\\": 85, \\"skillsFound\\": [\\"Java\\", \\"Spring Boot\\"]}";
    }
}
"""
}

for name, content in files.items():
    with open(f"{base_pkg}/{name}", "w") as f:
        f.write(content)

print("Security, Controllers and Services generated.")
