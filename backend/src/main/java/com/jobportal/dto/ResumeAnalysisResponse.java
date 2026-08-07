package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResumeAnalysisResponse {
    private int score;
    private int contentScore;
    private int skillsScore;
    private int structureScore;
    private int atsScore;
    private int impactScore;
    private List<String> skillsFound;
    private List<String> suggestions;
}
