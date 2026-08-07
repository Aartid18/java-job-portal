package com.jobportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final ObjectMapper objectMapper;

    public Double calculateCompatibilityScore(String candidateSkillsCsv, String jobRequiredSkills) {
        Set<String> candidate = normalizeSkills(candidateSkillsCsv);
        Set<String> required = normalizeSkills(jobRequiredSkills);
        if (required.isEmpty()) {
            return candidate.isEmpty() ? 50.0 : 70.0;
        }
        if (candidate.isEmpty()) {
            return 0.0;
        }
        Set<String> intersection = new HashSet<>(candidate);
        intersection.retainAll(required);
        Set<String> union = new HashSet<>(candidate);
        union.addAll(required);
        if (union.isEmpty()) {
            return 0.0;
        }
        double jaccard = (double) intersection.size() / union.size();
        double coverage = (double) intersection.size() / required.size();
        double score = (jaccard * 0.4 + coverage * 0.6) * 100.0;
        return Math.round(score * 10.0) / 10.0;
    }

    public String generateSkillGapAnalysis(String candidateSkillsCsv, String jobRequiredSkills) {
        Set<String> candidate = normalizeSkills(candidateSkillsCsv);
        Set<String> required = normalizeSkills(jobRequiredSkills);

        List<String> matched = required.stream()
                .filter(candidate::contains)
                .sorted()
                .toList();

        List<String> missing = required.stream()
                .filter(s -> !candidate.contains(s))
                .sorted()
                .toList();

        // Without optional markers on job skills, treat all unmet required skills as critical.
        List<String> missingCritical = missing;
        List<String> missingOptional = List.of();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("matched", matched);
        payload.put("missingCritical", missingCritical);
        payload.put("missingOptional", missingOptional);

        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            return "{\"matched\":[],\"missingCritical\":[],\"missingOptional\":[]}";
        }
    }

    public Set<String> normalizeSkills(String csv) {
        if (!StringUtils.hasText(csv)) {
            return new LinkedHashSet<>();
        }
        return Arrays.stream(csv.split("[,;|/]"))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .map(s -> s.toLowerCase(Locale.ROOT))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
