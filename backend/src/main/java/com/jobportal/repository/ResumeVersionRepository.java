package com.jobportal.repository;

import com.jobportal.entity.ResumeVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeVersionRepository extends JpaRepository<ResumeVersion, Long> {
    List<ResumeVersion> findByCandidateIdOrderByUpdatedAtDesc(Long candidateId);

    Optional<ResumeVersion> findByIdAndCandidateId(Long id, Long candidateId);
}
