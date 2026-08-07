package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidate;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Comma-separated technologies */
    @Column(columnDefinition = "TEXT")
    private String technologies;

    private String githubUrl;
    private String liveUrl;
}
