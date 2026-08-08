package com.jobportal.repository;

import com.jobportal.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByCandidateIdOrderByCreatedAtAsc(Long candidateId);
    void deleteByCandidateId(Long candidateId);
}
