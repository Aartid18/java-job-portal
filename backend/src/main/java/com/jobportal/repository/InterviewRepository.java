package com.jobportal.repository;

import com.jobportal.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationJobPostedByIdOrderByScheduledAtDesc(Long recruiterId);

    List<Interview> findByApplicationCandidateIdOrderByScheduledAtDesc(Long candidateId);
}
