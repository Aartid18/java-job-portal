package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "experiences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidate;

    /** Internship | Full-time | Freelance | Project */
    private String type;

    private String company;
    private String roleTitle;
    private String startDate;
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;
}
