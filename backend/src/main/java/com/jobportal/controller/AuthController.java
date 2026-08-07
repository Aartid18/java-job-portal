package com.jobportal.controller;
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
