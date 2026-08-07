package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProfileCompletionResponse {
    private int percent;
    private List<String> missing;
    private boolean canFinish;
    private int onboardingStep;
}
