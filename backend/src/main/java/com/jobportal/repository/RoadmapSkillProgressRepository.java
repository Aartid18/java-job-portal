package com.jobportal.repository;

import com.jobportal.entity.RoadmapSkillProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadmapSkillProgressRepository extends JpaRepository<RoadmapSkillProgress, Long> {
    List<RoadmapSkillProgress> findByCandidateId(Long candidateId);
    Optional<RoadmapSkillProgress> findByCandidateIdAndSkillNameIgnoreCase(Long candidateId, String skillName);
    void deleteByCandidateId(Long candidateId);
}
