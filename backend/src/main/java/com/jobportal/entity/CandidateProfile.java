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
    private String skills;
    
    private String preferredJobRole;
    private String expectedSalary;
    private String noticePeriod;
    
    private String portfolioUrl;
    private String githubUrl;
    private String linkedinUrl;
}
