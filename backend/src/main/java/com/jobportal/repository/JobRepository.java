package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    long countByStatus(String status);

    Page<Job> findByStatus(String status, Pageable pageable);

    List<Job> findByPostedByIdOrderByCreatedAtDesc(Long recruiterId);

    Optional<Job> findByIdAndPostedById(Long id, Long recruiterId);
}
