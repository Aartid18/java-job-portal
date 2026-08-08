package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "career_roadmaps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerRoadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false, unique = true)
    private CandidateProfile candidate;

    private Long targetJobId;

    private String targetRole;

    private Integer currentReadiness;

    @Builder.Default
    private Integer overallProgress = 0;

    @Column(columnDefinition = "TEXT")
    private String roadmapJson;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (overallProgress == null) {
            overallProgress = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
