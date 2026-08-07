package com.jobportal.config;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed:false}")
    private boolean seedEnabled;

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) return;
        if (userRepository.count() > 0) {
            log.info("Seed skipped — users already exist");
            return;
        }

        String hash = passwordEncoder.encode("SeedPass1!");

        User admin = userRepository.save(User.builder()
                .email("admin@aijobportal.local")
                .password(hash)
                .role(Role.ADMIN)
                .isEmailVerified(true)
                .isActive(true)
                .onboardingCompleted(true)
                .build());

        User seeker = userRepository.save(User.builder()
                .email("seeker@aijobportal.local")
                .password(hash)
                .role(Role.JOB_SEEKER)
                .isEmailVerified(true)
                .isActive(true)
                .onboardingCompleted(true)
                .build());

        User recruiter = userRepository.save(User.builder()
                .email("recruiter@aijobportal.local")
                .password(hash)
                .role(Role.RECRUITER)
                .isEmailVerified(true)
                .isActive(true)
                .onboardingCompleted(true)
                .build());

        CandidateProfile candidate = candidateProfileRepository.save(CandidateProfile.builder()
                .user(seeker)
                .fullName("Demo Seeker")
                .location("Remote")
                .bio("Java + React developer")
                .preferredJobRole("Backend Engineer")
                .experienceLevel("Mid")
                .onboardingStep(8)
                .build());

        candidateSkillRepository.save(CandidateSkill.builder().candidate(candidate).name("Java").level("Advanced").build());
        candidateSkillRepository.save(CandidateSkill.builder().candidate(candidate).name("Spring").level("Advanced").build());
        candidateSkillRepository.save(CandidateSkill.builder().candidate(candidate).name("React").level("Intermediate").build());

        Company company = companyRepository.save(Company.builder()
                .name("Northwind Labs")
                .website("https://example.com")
                .description("Product engineering studio")
                .location("Bengaluru")
                .isVerified(true)
                .build());

        RecruiterProfile recruiterProfile = recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(recruiter)
                .fullName("Demo Recruiter")
                .position("Talent Lead")
                .company(company)
                .build());

        jobRepository.save(Job.builder()
                .title("Java Backend Engineer")
                .description("Build APIs with Spring Boot. Collaborate with product and frontend.")
                .location("Remote")
                .salaryRange("12-18 LPA")
                .requiredSkills("Java, Spring, SQL, Docker")
                .requiredExperienceYears(2)
                .status("OPEN")
                .postedBy(recruiterProfile)
                .build());

        jobRepository.save(Job.builder()
                .title("Full-Stack Developer")
                .description("Ship features across React and Spring Boot services.")
                .location("Hybrid - Bengaluru")
                .salaryRange("10-16 LPA")
                .requiredSkills("React, TypeScript, Java, REST")
                .requiredExperienceYears(1)
                .status("OPEN")
                .postedBy(recruiterProfile)
                .build());

        log.info("Seeded demo users: admin/seeker/recruiter @aijobportal.local (password SeedPass1!) — admin id={}", admin.getId());
    }
}
