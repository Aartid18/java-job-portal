package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminOverviewResponse {
    private long users;
    private long candidates;
    private long recruiters;
    private long openJobs;
    private long applications;
}
