package com.jobportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final ObjectMapper objectMapper;

    // Canonical synonym mapping
    private static final Map<String, String> SKILL_ALIASES = new LinkedHashMap<>();
    static {
        // Frontend
        SKILL_ALIASES.put("react.js", "react");
        SKILL_ALIASES.put("reactjs", "react");
        SKILL_ALIASES.put("react", "react");
        SKILL_ALIASES.put("node.js", "node.js");
        SKILL_ALIASES.put("nodejs", "node.js");
        SKILL_ALIASES.put("node", "node.js");
        SKILL_ALIASES.put("vue.js", "vue.js");
        SKILL_ALIASES.put("vuejs", "vue.js");
        SKILL_ALIASES.put("vue", "vue.js");
        SKILL_ALIASES.put("angular.js", "angular");
        SKILL_ALIASES.put("angularjs", "angular");
        SKILL_ALIASES.put("angular", "angular");
        SKILL_ALIASES.put("next.js", "next.js");
        SKILL_ALIASES.put("nextjs", "next.js");
        SKILL_ALIASES.put("next", "next.js");
        SKILL_ALIASES.put("typescript", "typescript");
        SKILL_ALIASES.put("ts", "typescript");
        SKILL_ALIASES.put("javascript", "javascript");
        SKILL_ALIASES.put("js", "javascript");
        SKILL_ALIASES.put("html5", "html");
        SKILL_ALIASES.put("css3", "css");
        SKILL_ALIASES.put("tailwind css", "tailwind");
        SKILL_ALIASES.put("tailwindcss", "tailwind");

        // Backend & Languages
        SKILL_ALIASES.put("spring boot", "spring boot");
        SKILL_ALIASES.put("springboot", "spring boot");
        SKILL_ALIASES.put("spring framework", "spring");
        SKILL_ALIASES.put("java", "java");
        SKILL_ALIASES.put("core java", "java");
        SKILL_ALIASES.put("python", "python");
        SKILL_ALIASES.put("golang", "go");
        SKILL_ALIASES.put("c#", "c#");
        SKILL_ALIASES.put("c sharp", "c#");
        SKILL_ALIASES.put(".net core", ".net");
        SKILL_ALIASES.put("dotnet", ".net");

        // Databases & Storage
        SKILL_ALIASES.put("postgres", "postgresql");
        SKILL_ALIASES.put("postgresql", "postgresql");
        SKILL_ALIASES.put("mysql", "mysql");
        SKILL_ALIASES.put("mongodb", "mongodb");
        SKILL_ALIASES.put("mongo", "mongodb");
        SKILL_ALIASES.put("redis", "redis");
        SKILL_ALIASES.put("sql", "sql");

        // DevOps & Cloud
        SKILL_ALIASES.put("docker", "docker");
        SKILL_ALIASES.put("k8s", "kubernetes");
        SKILL_ALIASES.put("kubernetes", "kubernetes");
        SKILL_ALIASES.put("aws", "aws");
        SKILL_ALIASES.put("amazon web services", "aws");
        SKILL_ALIASES.put("gcp", "gcp");
        SKILL_ALIASES.put("google cloud", "gcp");
        SKILL_ALIASES.put("azure", "azure");
        SKILL_ALIASES.put("microsoft azure", "azure");
        SKILL_ALIASES.put("ci/cd", "ci/cd");
        SKILL_ALIASES.put("cicd", "ci/cd");
        SKILL_ALIASES.put("git", "git");
        SKILL_ALIASES.put("rest api", "rest");
        SKILL_ALIASES.put("restful", "rest");
        SKILL_ALIASES.put("graphql", "graphql");
        SKILL_ALIASES.put("kafka", "kafka");
        SKILL_ALIASES.put("microservices", "microservices");
        SKILL_ALIASES.put("system design", "system design");
    }

    // Related skill pairings for Partial Match detection
    private static final Map<String, List<String>> RELATED_SKILLS = new LinkedHashMap<>();
    static {
        RELATED_SKILLS.put("typescript", List.of("javascript"));
        RELATED_SKILLS.put("javascript", List.of("typescript"));
        RELATED_SKILLS.put("spring boot", List.of("java", "spring"));
        RELATED_SKILLS.put("spring", List.of("java"));
        RELATED_SKILLS.put("postgresql", List.of("sql", "mysql"));
        RELATED_SKILLS.put("mysql", List.of("sql", "postgresql"));
        RELATED_SKILLS.put("kubernetes", List.of("docker", "devops"));
        RELATED_SKILLS.put("aws", List.of("cloud", "gcp", "azure", "docker"));
        RELATED_SKILLS.put("next.js", List.of("react", "javascript", "typescript"));
        RELATED_SKILLS.put("microservices", List.of("spring boot", "rest", "docker"));
        RELATED_SKILLS.put("system design", List.of("microservices", "sql", "redis"));
    }

    public Double calculateCompatibilityScore(String candidateSkillsCsv, String jobRequiredSkills) {
        Set<String> candidate = normalizeSkills(candidateSkillsCsv);
        Set<String> required = normalizeSkills(jobRequiredSkills);
        if (required.isEmpty()) {
            return candidate.isEmpty() ? 50.0 : 70.0;
        }
        if (candidate.isEmpty()) {
            return 0.0;
        }

        Set<String> exactMatches = new HashSet<>(candidate);
        exactMatches.retainAll(required);

        // Calculate partial credit for related skills
        double partialCredit = 0.0;
        for (String req : required) {
            if (!exactMatches.contains(req)) {
                List<String> related = RELATED_SKILLS.getOrDefault(req, List.of());
                for (String rel : related) {
                    if (candidate.contains(rel)) {
                        partialCredit += 0.35; // 35% partial credit for related foundation
                        break;
                    }
                }
            }
        }

        double totalEffectiveMatches = exactMatches.size() + Math.min(partialCredit, (required.size() - exactMatches.size()) * 0.5);
        double coverage = totalEffectiveMatches / required.size();

        Set<String> union = new HashSet<>(candidate);
        union.addAll(required);
        double jaccard = union.isEmpty() ? 0.0 : (double) exactMatches.size() / union.size();

        double score = (jaccard * 0.35 + coverage * 0.65) * 100.0;
        return Math.min(100.0, Math.round(score * 10.0) / 10.0);
    }

    public String generateSkillGapAnalysis(String candidateSkillsCsv, String jobRequiredSkills) {
        SkillBreakdown breakdown = analyzeSkills(candidateSkillsCsv, jobRequiredSkills);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("matched", breakdown.getMatched());
        payload.put("missingCritical", breakdown.getMissing());
        payload.put("missingOptional", breakdown.getPartial());

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            return "{\"matched\":[],\"missingCritical\":[],\"missingOptional\":[]}";
        }
    }

    public SkillBreakdown analyzeSkills(String candidateSkillsCsv, String jobRequiredSkills) {
        Set<String> candidate = normalizeSkills(candidateSkillsCsv);
        Set<String> required = normalizeSkills(jobRequiredSkills);

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> partial = new ArrayList<>();

        for (String req : required) {
            String displayReq = toDisplayCase(req);
            if (candidate.contains(req)) {
                matched.add(displayReq);
            } else {
                List<String> related = RELATED_SKILLS.getOrDefault(req, List.of());
                boolean hasRelated = related.stream().anyMatch(candidate::contains);
                if (hasRelated) {
                    partial.add(displayReq);
                } else {
                    missing.add(displayReq);
                }
            }
        }

        Collections.sort(matched);
        Collections.sort(missing);
        Collections.sort(partial);

        return new SkillBreakdown(matched, missing, partial);
    }

    public Set<String> normalizeSkills(String csv) {
        if (!StringUtils.hasText(csv)) {
            return new LinkedHashSet<>();
        }
        return Arrays.stream(csv.split("[,;|/\n\r]"))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .map(this::normalizeSkillToken)
                .filter(StringUtils::hasText)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    public String normalizeSkillToken(String token) {
        if (!StringUtils.hasText(token)) return "";
        String clean = token.trim().toLowerCase(Locale.ROOT);
        // Direct alias check
        if (SKILL_ALIASES.containsKey(clean)) {
            return SKILL_ALIASES.get(clean);
        }
        // Remove trailing versions (e.g. java 17 -> java, python 3 -> python)
        clean = clean.replaceAll("\\s+v?\\d+(\\.\\d+)*$", "").trim();
        return SKILL_ALIASES.getOrDefault(clean, clean);
    }

    public String toDisplayCase(String normalizedSkill) {
        if (!StringUtils.hasText(normalizedSkill)) return "";
        String s = normalizedSkill.trim();
        return switch (s.toLowerCase(Locale.ROOT)) {
            case "react" -> "React";
            case "node.js" -> "Node.js";
            case "vue.js" -> "Vue.js";
            case "angular" -> "Angular";
            case "next.js" -> "Next.js";
            case "typescript" -> "TypeScript";
            case "javascript" -> "JavaScript";
            case "spring boot" -> "Spring Boot";
            case "spring" -> "Spring Framework";
            case "java" -> "Java";
            case "python" -> "Python";
            case "postgresql" -> "PostgreSQL";
            case "mysql" -> "MySQL";
            case "mongodb" -> "MongoDB";
            case "redis" -> "Redis";
            case "sql" -> "SQL";
            case "docker" -> "Docker";
            case "kubernetes" -> "Kubernetes";
            case "aws" -> "AWS";
            case "gcp" -> "GCP";
            case "azure" -> "Azure";
            case "ci/cd" -> "CI/CD";
            case "git" -> "Git";
            case "rest" -> "REST APIs";
            case "graphql" -> "GraphQL";
            case "kafka" -> "Apache Kafka";
            case "microservices" -> "Microservices";
            case "system design" -> "System Design";
            case "c#" -> "C#";
            case ".net" -> ".NET";
            case "html" -> "HTML5";
            case "css" -> "CSS3";
            case "tailwind" -> "Tailwind CSS";
            default -> Character.toUpperCase(s.charAt(0)) + s.substring(1);
        };
    }

    public int calculatePriorityRank(String skill, String jobDesc, boolean isRequired, String userProficiency) {
        int score = 0;
        if (isRequired) score += 40;
        else score += 15;

        if (StringUtils.hasText(jobDesc)) {
            String lowerDesc = jobDesc.toLowerCase(Locale.ROOT);
            String needle = skill.toLowerCase(Locale.ROOT);
            int count = countOccurrences(lowerDesc, needle);
            score += Math.min(30, count * 10);
        }

        // Higher urgency if completely missing vs Beginner
        if (!StringUtils.hasText(userProficiency) || "None".equalsIgnoreCase(userProficiency)) {
            score += 20;
        } else if ("Beginner".equalsIgnoreCase(userProficiency)) {
            score += 10;
        }

        // Foundational skills prioritized before higher abstraction
        String lower = skill.toLowerCase(Locale.ROOT);
        if (lower.contains("docker") || lower.contains("sql") || lower.contains("git") || lower.contains("javascript")) {
            score += 10;
        }

        return score;
    }

    private int countOccurrences(String text, String needle) {
        if (!StringUtils.hasText(text) || !StringUtils.hasText(needle)) return 0;
        int count = 0;
        int idx = 0;
        while ((idx = text.indexOf(needle, idx)) != -1) {
            count++;
            idx += needle.length();
        }
        return count;
    }

    @lombok.Value
    public static class SkillBreakdown {
        List<String> matched;
        List<String> missing;
        List<String> partial;
    }
}
