package com.jobportal.service;

import com.jobportal.dto.ProfileCompletionResponse;
import com.jobportal.entity.CandidateProfile;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jobportal.repository.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OnboardingServiceCompletionTest {

    @Mock UserRepository userRepository;
    @Mock CandidateProfileRepository candidateProfileRepository;
    @Mock EducationRepository educationRepository;
    @Mock ExperienceRepository experienceRepository;
    @Mock CandidateSkillRepository candidateSkillRepository;
    @Mock ProjectRepository projectRepository;
    @Mock RecruiterProfileRepository recruiterProfileRepository;

    @InjectMocks
    OnboardingService onboardingService;

    @Test
    void incompleteProfileCannotFinish() {
        CandidateProfile profile = CandidateProfile.builder()
                .id(1L)
                .fullName("Alex")
                .build();

        when(educationRepository.findByCandidateId(1L)).thenReturn(List.of());
        when(candidateSkillRepository.findByCandidateId(1L)).thenReturn(List.of());
        when(experienceRepository.findByCandidateId(1L)).thenReturn(List.of());
        when(projectRepository.findByCandidateId(1L)).thenReturn(List.of());

        ProfileCompletionResponse completion = onboardingService.calculateCompletion(profile);

        assertTrue(completion.getPercent() < 50);
        assertFalse(completion.isCanFinish());
        assertFalse(completion.getMissing().isEmpty());
    }
}
