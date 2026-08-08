package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmap_skill_progresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapSkillProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidate;

    @Column(nullable = false)
    private String skillName;

    /** HIGH | MEDIUM | LOW */
    @Column(nullable = false, length = 20)
    private String priority;

    /** NOT_STARTED | IN_PROGRESS | COMPLETED */
    @Column(nullable = false, length = 30)
    private String status;

    @Builder.Default
    private Integer progressPercent = 0;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "NOT_STARTED";
        }
        if (progressPercent == null) {
            progressPercent = "COMPLETED".equalsIgnoreCase(status) ? 100 : ("IN_PROGRESS".equalsIgnoreCase(status) ? 50 : 0);
        }
    }
}
