package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.ResumeVersion;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.ResumeVersionRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private static final List<String> SKILL_KEYWORDS = List.of(
            "Java", "Spring Boot", "Spring", "Hibernate", "JPA", "React", "Angular", "Vue",
            "TypeScript", "JavaScript", "Node.js", "Python", "SQL", "MySQL", "PostgreSQL",
            "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git",
            "REST", "GraphQL", "Microservices", "Kafka", "RabbitMQ", "HTML", "CSS",
            "Tailwind", "Next.js", "C#", ".NET", "C++", "Go", "Kotlin", "Swift",
            "Jenkins", "CI/CD", "Linux", "Agile", "Scrum", "JUnit", "Mockito", "Maven", "Gradle"
    );

    private static final List<String> ACTION_VERBS = List.of(
            "led", "built", "designed", "implemented", "developed", "delivered", "optimized",
            "automated", "architected", "improved", "reduced", "increased", "created", "launched",
            "managed", "coordinated", "engineered", "refactored", "migrated", "integrated"
    );

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final ResumeVersionRepository resumeVersionRepository;

    @Transactional(readOnly = true)
    public List<ResumeVersionResponse> list(String email) {
        CandidateProfile profile = requireCandidate(email);
        return resumeVersionRepository.findByCandidateIdOrderByUpdatedAtDesc(profile.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResumeVersionResponse get(String email, Long id) {
        CandidateProfile profile = requireCandidate(email);
        ResumeVersion version = resumeVersionRepository.findByIdAndCandidateId(id, profile.getId())
                .orElseThrow(() -> new ApiException("Resume version not found", 404));
        return toResponse(version);
    }

    @Transactional
    public ResumeVersionResponse create(String email, ResumeVersionRequest request) {
        CandidateProfile profile = requireCandidate(email);
        ResumeVersion version = ResumeVersion.builder()
                .candidate(profile)
                .title(request.getTitle().trim())
                .templateName(blankToNull(request.getTemplateName()))
                .contentJson(request.getContentJson())
                .build();
        return toResponse(resumeVersionRepository.save(version));
    }

    @Transactional
    public ResumeVersionResponse update(String email, Long id, ResumeVersionRequest request) {
        CandidateProfile profile = requireCandidate(email);
        ResumeVersion version = resumeVersionRepository.findByIdAndCandidateId(id, profile.getId())
                .orElseThrow(() -> new ApiException("Resume version not found", 404));
        version.setTitle(request.getTitle().trim());
        version.setTemplateName(blankToNull(request.getTemplateName()));
        version.setContentJson(request.getContentJson());
        return toResponse(resumeVersionRepository.save(version));
    }

    @Transactional
    public void delete(String email, Long id) {
        CandidateProfile profile = requireCandidate(email);
        ResumeVersion version = resumeVersionRepository.findByIdAndCandidateId(id, profile.getId())
                .orElseThrow(() -> new ApiException("Resume version not found", 404));
        resumeVersionRepository.delete(version);
    }

    @Transactional(readOnly = true)
    public ResumeAnalysisResponse analyzeUploadedResume(String email, MultipartFile file) {
        CandidateProfile profile = requireCandidate(email);
        String text;
        if (file != null && !file.isEmpty()) {
            text = extractTextFromMultipart(file);
        } else if (StringUtils.hasText(profile.getResumeStoragePath())) {
            text = extractTextFromPath(profile.getResumeStoragePath());
        } else {
            throw new ApiException("No resume uploaded. Provide a PDF file or upload a resume first.", 400);
        }
        return analyzeText(text);
    }

    public EnhanceBulletResponse enhanceBullet(String originalText) {
        if (!StringUtils.hasText(originalText)) {
            throw new ApiException("Bullet text is required", 400);
        }
        String original = originalText.trim();
        String enhanced = applyBulletRewriteRules(original);
        return EnhanceBulletResponse.builder()
                .original(original)
                .enhanced(enhanced)
                .build();
    }

    ResumeAnalysisResponse analyzeText(String text) {
        String normalized = text == null ? "" : text.replace("\r", "").trim();
        String lower = normalized.toLowerCase(Locale.ROOT);

        List<String> skillsFound = new ArrayList<>();
        for (String skill : SKILL_KEYWORDS) {
            if (containsSkill(lower, skill)) {
                skillsFound.add(skill);
            }
        }

        int contentScore = scoreContent(normalized);
        int skillsScore = Math.min(100, skillsFound.size() * 8);
        int structureScore = scoreStructure(lower);
        int atsScore = scoreAts(normalized, lower, skillsFound.size());
        int impactScore = scoreImpact(lower);
        int score = (contentScore + skillsScore + structureScore + atsScore + impactScore) / 5;

        List<String> suggestions = new ArrayList<>();
        if (contentScore < 50) {
            suggestions.add("Expand resume content with clearer role summaries (based on text length only — no experience invented).");
        }
        if (skillsFound.isEmpty()) {
            suggestions.add("Add recognizable technical skills that appear in your resume text (e.g. Java, Spring Boot, React).");
        } else if (skillsScore < 60) {
            suggestions.add("Surface more of your existing skills explicitly in a dedicated Skills section.");
        }
        if (structureScore < 60) {
            suggestions.add("Use clear section headings such as Experience, Education, and Skills for better structure.");
        }
        if (atsScore < 60) {
            suggestions.add("Prefer plain text-friendly formatting and include skill keywords that match target roles.");
        }
        if (impactScore < 50) {
            suggestions.add("Start bullets with stronger action verbs already reflected in your work (Led, Built, Implemented).");
        }
        if (suggestions.isEmpty()) {
            suggestions.add("Resume text looks reasonably complete for keyword-based analysis.");
        }

        return ResumeAnalysisResponse.builder()
                .score(score)
                .contentScore(contentScore)
                .skillsScore(skillsScore)
                .structureScore(structureScore)
                .atsScore(atsScore)
                .impactScore(impactScore)
                .skillsFound(skillsFound)
                .suggestions(suggestions)
                .build();
    }

    private String applyBulletRewriteRules(String original) {
        String text = original.trim();
        // Strip leading bullets
        text = text.replaceFirst("^[\\u2022\\-\\*\\u2013\\u2014]+\\s*", "");

        String lower = text.toLowerCase(Locale.ROOT);
        LinkedHashMap<String, String> replacements = new LinkedHashMap<>();
        replacements.put("responsible for ", "Owned ");
        replacements.put("was responsible for ", "Owned ");
        replacements.put("helped with ", "Supported ");
        replacements.put("helped ", "Supported ");
        replacements.put("assisted with ", "Supported ");
        replacements.put("worked on ", "Developed ");
        replacements.put("worked with ", "Collaborated on ");
        replacements.put("did ", "Delivered ");
        replacements.put("made ", "Created ");
        replacements.put("handled ", "Managed ");
        replacements.put("tasked with ", "Led ");
        replacements.put("participated in ", "Contributed to ");
        replacements.put("involved in ", "Contributed to ");

        boolean replaced = false;
        for (Map.Entry<String, String> entry : replacements.entrySet()) {
            if (lower.startsWith(entry.getKey())) {
                text = entry.getValue() + text.substring(entry.getKey().length());
                replaced = true;
                break;
            }
        }

        if (!replaced) {
            // Capitalize first letter if weak start without inventing content
            text = capitalizeFirst(text);
        } else {
            text = capitalizeFirst(text);
        }

        // Soften filler phrases without adding metrics/companies
        text = text.replaceAll("(?i)\\bin order to\\b", "to");
        text = text.replaceAll("(?i)\\bvarious\\b", "multiple");
        text = text.replaceAll("\\s{2,}", " ").trim();

        return text;
    }

    private String capitalizeFirst(String text) {
        if (!StringUtils.hasText(text)) {
            return text;
        }
        return Character.toUpperCase(text.charAt(0)) + text.substring(1);
    }

    private int scoreContent(String text) {
        int len = text.length();
        if (len < 200) return 20;
        if (len < 600) return 45;
        if (len < 1500) return 70;
        if (len < 4000) return 90;
        return 95;
    }

    private int scoreStructure(String lower) {
        int score = 20;
        if (lower.contains("experience") || lower.contains("work history") || lower.contains("employment")) score += 20;
        if (lower.contains("education") || lower.contains("academic")) score += 20;
        if (lower.contains("skill")) score += 20;
        if (lower.contains("project") || lower.contains("summary") || lower.contains("objective")) score += 20;
        return Math.min(100, score);
    }

    private int scoreAts(String text, String lower, int skillsFound) {
        int score = 30;
        score += Math.min(40, skillsFound * 5);
        // Prefer text-extractable content (already extracted); penalize very sparse lines
        long lines = text.lines().filter(l -> l.trim().length() > 2).count();
        if (lines >= 8) score += 15;
        if (lines >= 15) score += 10;
        if (lower.contains("email") || lower.contains("@")) score += 5;
        return Math.min(100, score);
    }

    private int scoreImpact(String lower) {
        int hits = 0;
        for (String verb : ACTION_VERBS) {
            if (Pattern.compile("\\b" + Pattern.quote(verb) + "\\b").matcher(lower).find()) {
                hits++;
            }
        }
        return Math.min(100, 15 + hits * 12);
    }

    private boolean containsSkill(String lowerText, String skill) {
        String needle = skill.toLowerCase(Locale.ROOT);
        if (needle.contains(".") || needle.contains("#") || needle.contains("/")) {
            return lowerText.contains(needle);
        }
        return Pattern.compile("\\b" + Pattern.quote(needle) + "\\b").matcher(lowerText).find();
    }

    private String extractTextFromPath(String path) {
        Path file = Path.of(path);
        if (!Files.exists(file)) {
            throw new ApiException("Stored resume file not found", 404);
        }
        try (PDDocument document = PDDocument.load(file.toFile())) {
            return new PDFTextStripper().getText(document);
        } catch (IOException e) {
            throw new ApiException("Failed to parse resume PDF", 400);
        }
    }

    private String extractTextFromMultipart(MultipartFile file) {
        String name = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase(Locale.ROOT) : "";
        if (!name.endsWith(".pdf") && !"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new ApiException("Only PDF resumes are supported for analysis", 400);
        }
        try (InputStream in = file.getInputStream(); PDDocument document = PDDocument.load(in)) {
            return new PDFTextStripper().getText(document);
        } catch (IOException e) {
            throw new ApiException("Failed to parse resume PDF", 400);
        }
    }

    private CandidateProfile requireCandidate(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
        if (user.getRole() != Role.JOB_SEEKER && user.getRole() != Role.ADMIN) {
            throw new ApiException("Only job seekers can manage resumes", 403);
        }
        return candidateProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Candidate profile not found", 404));
    }

    private ResumeVersionResponse toResponse(ResumeVersion version) {
        return ResumeVersionResponse.builder()
                .id(version.getId())
                .title(version.getTitle())
                .templateName(version.getTemplateName())
                .contentJson(version.getContentJson())
                .updatedAt(version.getUpdatedAt())
                .build();
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
