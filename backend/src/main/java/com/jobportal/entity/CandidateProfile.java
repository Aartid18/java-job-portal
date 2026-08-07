package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {
    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String fullName;
    private String phone;
    private String location;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String photoUrl;

    /** Legacy comma-separated skills — kept for compatibility; structured skills use CandidateSkill. */
    @Column(columnDefinition = "TEXT")
    private String skills;

    private String preferredJobRole;
    private String expectedSalary;
    private String noticePeriod;

    /** Remote | Hybrid | On-site | Any */
    private String remotePreference;

    /** Comma-separated preferred locations */
    @Column(columnDefinition = "TEXT")
    private String preferredLocations;

    /** Entry | Mid | Senior | Lead */
    private String experienceLevel;

    /** Comma-separated: Full-time, Internship, Part-time, Contract */
    private String jobTypes;

    private String portfolioUrl;
    private String githubUrl;
    private String linkedinUrl;

    private String resumeFileName;
    private String resumeStoragePath;

    /** Last completed onboarding step 0–8 */
    @Builder.Default
    private int onboardingStep = 0;
}
