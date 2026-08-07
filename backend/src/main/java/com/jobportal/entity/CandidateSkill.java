package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidate;

    @Column(nullable = false)
    private String name;

    /** Beginner | Intermediate | Advanced | Expert */
    @Column(nullable = false)
    private String level;
}
