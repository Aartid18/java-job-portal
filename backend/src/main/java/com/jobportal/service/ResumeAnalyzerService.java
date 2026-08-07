package com.jobportal.service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeAnalyzerService {
    public String analyzeResume(MultipartFile file) {
        // Extract text using PDFBox
        // Identify skills, compare with profile
        // Generate completeness score
        return "{\"score\": 85, \"skillsFound\": [\"Java\", \"Spring Boot\"]}";
    }
}
