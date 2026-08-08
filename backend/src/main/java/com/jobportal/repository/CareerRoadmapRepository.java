package com.jobportal.repository;

import com.jobportal.entity.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, Long> {
    Optional<CareerRoadmap> findByCandidateId(Long candidateId);
    void deleteByCandidateId(Long candidateId);
}
