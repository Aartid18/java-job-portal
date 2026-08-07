package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    private LocalDateTime scheduledAt;

    @Column(length = 500)
    private String meetingLink;

    @Column(columnDefinition = "TEXT")
    private String notes;

    /** SCHEDULED, COMPLETED, CANCELLED */
    @Builder.Default
    private String status = "SCHEDULED";

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "SCHEDULED";
    }
}
