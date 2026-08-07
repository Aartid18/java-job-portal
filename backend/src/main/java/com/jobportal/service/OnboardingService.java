package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.*;
import com.jobportal.exception.ApiException;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OnboardingService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final ProjectRepository projectRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public OnboardingStateResponse getState(String email) {
        User user = requireUser(email);
        if (user.getRole() == Role.RECRUITER) {
            return recruiterState(user);
        }
        CandidateProfile profile = requireCandidate(user);
        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse saveBasic(String email, BasicInfoRequest request) {
        User user = requireUser(email);
        if (user.getRole() == Role.RECRUITER) {
            RecruiterProfile profile = recruiterProfileRepository.findById(user.getId())
                    .orElseThrow(() -> new ApiException("Recruiter profile not found", 404));
            profile.setFullName(request.getFullName().trim());
            profile.setPhone(blankToNull(request.getPhone()));
            recruiterProfileRepository.save(profile);
            return recruiterState(user);
        }

        CandidateProfile profile = requireCandidate(user);
        profile.setFullName(request.getFullName().trim());
        profile.setPhone(blankToNull(request.getPhone()));
        profile.setLocation(blankToNull(request.getLocation()));
        profile.setBio(blankToNull(request.getBio()));
        if (StringUtils.hasText(request.getPhotoUrl())) {
            profile.setPhotoUrl(request.getPhotoUrl().trim());
        }
        profile.setOnboardingStep(Math.max(profile.getOnboardingStep(), 1));
        candidateProfileRepository.save(profile);
        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse saveEducations(String email, List<OnboardingStateResponse.EducationDto> items) {
        User user = requireSeeker(email);
        CandidateProfile profile = requireCandidate(user);
        educationRepository.deleteByCandidateId(profile.getId());
        if (items != null) {
            for (OnboardingStateResponse.EducationDto dto : items) {
                if (!StringUtils.hasText(dto.getDegree()) && !StringUtils.hasText(dto.getCollege())) {
                    continue;
                }
                educationRepository.save(Education.builder()
                        .candidate(profile)
                        .degree(blankToNull(dto.getDegree()))
                        .college(blankToNull(dto.getCollege()))
                        .fieldOfStudy(blankToNull(dto.getFieldOfStudy()))
                        .startYear(dto.getStartYear())
                        .graduationYear(dto.getGraduationYear())
                        .cgpa(blankToNull(dto.getCgpa()))
                        .build());
            }
        }
        profile.setOnboardingStep(Math.max(profile.getOnboardingStep(), 2));
        candidateProfileRepository.save(profile);
        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse saveSkills(String email, List<OnboardingStateResponse.SkillDto> items) {
        User user = requireSeeker(email);
        CandidateProfile profile = requireCandidate(user);
        candidateSkillRepository.deleteByCandidateId(profile.getId());
        List<String> names = new ArrayList<>();
        if (items != null) {
            for (OnboardingStateResponse.SkillDto dto : items) {
                if (!StringUtils.hasText(dto.getName())) continue;
                String level = normalizeLevel(dto.getLevel());
                candidateSkillRepository.save(CandidateSkill.builder()
                        .candidate(profile)
                        .name(dto.getName().trim())
                        .level(level)
                        .build());
                names.add(dto.getName().trim());
            }
        }
        profile.setSkills(String.join(", ", names));
        profile.setOnboardingStep(Math.max(profile.getOnboardingStep(), 3));
        candidateProfileRepository.save(profile);
        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse saveExperiences(String email, List<OnboardingStateResponse.ExperienceDto> items) {
        User user = requireSeeker(email);
        CandidateProfile profile = requireCandidate(user);
        experienceRepository.deleteByCandidateId(profile.getId());
        if (items != null) {
            for (OnboardingStateResponse.ExperienceDto dto : items) {
                if (!StringUtils.hasText(dto.getCompany()) && !StringUtils.hasText(dto.getRoleTitle())) {
                    continue;
                }
                experienceRepository.save(Experience.builder()
                        .candidate(profile)
                        .type(blankToNull(dto.getType()))
                        .company(blankToNull(dto.getCompany()))
                        .roleTitle(blankToNull(dto.getRoleTitle()))
                        .startDate(blankToNull(dto.getStartDate()))
                        .endDate(blankToNull(dto.getEndDate()))
                        .description(blankToNull(dto.getDescription()))
                        .build());
            }
        }
        profile.setOnboardingStep(Math.max(profile.getOnboardingStep(), 4));
        candidateProfileRepository.save(profile);
        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse saveProjects(String email, List<OnboardingStateResponse.ProjectDto> items) {
        User user = requireSeeker(email);
        CandidateProfile profile = requireCandidate(user);
        projectRepository.deleteByCandidateId(profile.getId());
        if (items != null) {
            for (OnboardingStateResponse.ProjectDto dto : items) {
                if (!StringUtils.hasText(dto.getName())) continue;
                projectRepository.save(Project.builder()
                        .candidate(profile)
                        .name(dto.getName().trim())
                        .description(blankToNull(dto.getDescription()))
                        .technologies(blankToNull(dto.getTechnologies()))
                        .githubUrl(blankToNull(dto.getGithubUrl()))
                        .liveUrl(blankToNull(dto.getLiveUrl()))
                        .build());
            }
        }
        profile.setOnboardingStep(Math.max(profile.getOnboardingStep(), 5));
        candidateProfileRepository.save(profile);
        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse savePreferences(String email, OnboardingStateResponse.PreferencesDto prefs) {
        User user = requireSeeker(email);
        CandidateProfile profile = requireCandidate(user);
        if (prefs != null) {
            profile.setPreferredJobRole(blankToNull(prefs.getPreferredJobRole()));
            profile.setPreferredLocations(blankToNull(prefs.getPreferredLocations()));
            profile.setRemotePreference(blankToNull(prefs.getRemotePreference()));
            profile.setExpectedSalary(blankToNull(prefs.getExpectedSalary()));
            profile.setExperienceLevel(blankToNull(prefs.getExperienceLevel()));
            profile.setJobTypes(blankToNull(prefs.getJobTypes()));
        }
        profile.setOnboardingStep(Math.max(profile.getOnboardingStep(), 6));
        candidateProfileRepository.save(profile);
        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse uploadResume(String email, MultipartFile file) {
        User user = requireSeeker(email);
        CandidateProfile profile = requireCandidate(user);
        if (file == null || file.isEmpty()) {
            throw new ApiException("Resume file is required", 400);
        }
        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        String lower = original.toLowerCase(Locale.ROOT);
        if (!lower.endsWith(".pdf")) {
            throw new ApiException("Only PDF resumes are supported", 400);
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ApiException("Resume must be 5MB or smaller", 400);
        }

        try {
            Path dir = Paths.get(uploadDir, "resumes", String.valueOf(profile.getId()));
            Files.createDirectories(dir);
            Path target = dir.resolve("resume.pdf");
            file.transferTo(target);
            profile.setResumeFileName(original);
            profile.setResumeStoragePath(target.toAbsolutePath().toString());
            profile.setOnboardingStep(Math.max(profile.getOnboardingStep(), 7));
            candidateProfileRepository.save(profile);
        } catch (IOException e) {
            throw new ApiException("Failed to store resume", 500);
        }

        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse skipResume(String email) {
        User user = requireSeeker(email);
        CandidateProfile profile = requireCandidate(user);
        profile.setOnboardingStep(Math.max(profile.getOnboardingStep(), 7));
        candidateProfileRepository.save(profile);
        return buildCandidateState(user, profile);
    }

    @Transactional
    public OnboardingStateResponse finish(String email) {
        User user = requireUser(email);
        if (user.getRole() == Role.RECRUITER) {
            RecruiterProfile profile = recruiterProfileRepository.findById(user.getId())
                    .orElseThrow(() -> new ApiException("Recruiter profile not found", 404));
            if (!StringUtils.hasText(profile.getFullName())) {
                throw new ApiException("Add your name before finishing onboarding", 400);
            }
            user.setOnboardingCompleted(true);
            userRepository.save(user);
            return recruiterState(user);
        }

        CandidateProfile profile = requireCandidate(user);
        ProfileCompletionResponse completion = calculateCompletion(profile);
        if (!completion.isCanFinish()) {
            throw new ApiException("Complete the required profile sections first: " + String.join(", ", completion.getMissing()), 400);
        }
        profile.setOnboardingStep(8);
        candidateProfileRepository.save(profile);
        user.setOnboardingCompleted(true);
        userRepository.save(user);
        return buildCandidateState(user, profile);
    }

    public ProfileCompletionResponse calculateCompletion(CandidateProfile profile) {
        List<String> missing = new ArrayList<>();
        int percent = 0;

        boolean basicOk = StringUtils.hasText(profile.getFullName())
                && StringUtils.hasText(profile.getLocation())
                && StringUtils.hasText(profile.getPhone());
        if (basicOk) {
            percent += 20;
        } else {
            missing.add("Add basic information (name, phone, location)");
        }
        if (StringUtils.hasText(profile.getBio())) {
            percent += 0; // included in basic quality, not extra points — keep 20 for basic block
        }

        long eduCount = educationRepository.findByCandidateId(profile.getId()).size();
        if (eduCount >= 1) percent += 15;
        else missing.add("Add at least one education record");

        long skillCount = candidateSkillRepository.findByCandidateId(profile.getId()).size();
        if (skillCount >= 3) percent += 15;
        else if (skillCount >= 1) {
            percent += 8;
            missing.add("Add at least 3 skills");
        } else {
            missing.add("Add at least 3 skills");
        }

        long expCount = experienceRepository.findByCandidateId(profile.getId()).size();
        if (expCount >= 1) percent += 15;
        else missing.add("Add experience or an internship");

        long projectCount = projectRepository.findByCandidateId(profile.getId()).size();
        if (projectCount >= 1) percent += 10;
        else missing.add("Add at least one project");

        boolean prefsOk = StringUtils.hasText(profile.getPreferredJobRole())
                && StringUtils.hasText(profile.getRemotePreference());
        if (prefsOk) percent += 15;
        else missing.add("Set career preferences (role + work mode)");

        if (StringUtils.hasText(profile.getResumeStoragePath())) percent += 10;
        else missing.add("Upload a resume (or skip for now and add later)");

        // Allow finish without resume if other core sections are solid (≥70 without resume weight)
        boolean canFinish = basicOk && eduCount >= 1 && skillCount >= 3 && prefsOk
                && (expCount >= 1 || projectCount >= 1);

        return ProfileCompletionResponse.builder()
                .percent(Math.min(percent, 100))
                .missing(missing)
                .canFinish(canFinish)
                .onboardingStep(profile.getOnboardingStep())
                .build();
    }

    private OnboardingStateResponse buildCandidateState(User user, CandidateProfile profile) {
        // Reload user if lazy
        User owned = userRepository.findById(profile.getId()).orElse(user);
        List<OnboardingStateResponse.EducationDto> educations = educationRepository.findByCandidateId(profile.getId())
                .stream().map(e -> OnboardingStateResponse.EducationDto.builder()
                        .id(e.getId())
                        .degree(e.getDegree())
                        .college(e.getCollege())
                        .fieldOfStudy(e.getFieldOfStudy())
                        .startYear(e.getStartYear())
                        .graduationYear(e.getGraduationYear())
                        .cgpa(e.getCgpa())
                        .build()).collect(Collectors.toList());

        List<OnboardingStateResponse.SkillDto> skills = candidateSkillRepository.findByCandidateId(profile.getId())
                .stream().map(s -> OnboardingStateResponse.SkillDto.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .level(s.getLevel())
                        .build()).collect(Collectors.toList());

        List<OnboardingStateResponse.ExperienceDto> experiences = experienceRepository.findByCandidateId(profile.getId())
                .stream().map(x -> OnboardingStateResponse.ExperienceDto.builder()
                        .id(x.getId())
                        .type(x.getType())
                        .company(x.getCompany())
                        .roleTitle(x.getRoleTitle())
                        .startDate(x.getStartDate())
                        .endDate(x.getEndDate())
                        .description(x.getDescription())
                        .build()).collect(Collectors.toList());

        List<OnboardingStateResponse.ProjectDto> projects = projectRepository.findByCandidateId(profile.getId())
                .stream().map(p -> OnboardingStateResponse.ProjectDto.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .description(p.getDescription())
                        .technologies(p.getTechnologies())
                        .githubUrl(p.getGithubUrl())
                        .liveUrl(p.getLiveUrl())
                        .build()).collect(Collectors.toList());

        return OnboardingStateResponse.builder()
                .basic(OnboardingStateResponse.BasicInfoDto.builder()
                        .fullName(profile.getFullName())
                        .phone(profile.getPhone())
                        .location(profile.getLocation())
                        .bio(profile.getBio())
                        .photoUrl(profile.getPhotoUrl())
                        .build())
                .educations(educations)
                .skills(skills)
                .experiences(experiences)
                .projects(projects)
                .preferences(OnboardingStateResponse.PreferencesDto.builder()
                        .preferredJobRole(profile.getPreferredJobRole())
                        .preferredLocations(profile.getPreferredLocations())
                        .remotePreference(profile.getRemotePreference())
                        .expectedSalary(profile.getExpectedSalary())
                        .experienceLevel(profile.getExperienceLevel())
                        .jobTypes(profile.getJobTypes())
                        .build())
                .resume(OnboardingStateResponse.ResumeInfoDto.builder()
                        .uploaded(StringUtils.hasText(profile.getResumeStoragePath()))
                        .fileName(profile.getResumeFileName())
                        .build())
                .completion(calculateCompletion(profile))
                .onboardingCompleted(owned.isOnboardingCompleted())
                .build();
    }

    private OnboardingStateResponse recruiterState(User user) {
        RecruiterProfile profile = recruiterProfileRepository.findById(user.getId()).orElse(null);
        List<String> missing = new ArrayList<>();
        int percent = 0;
        if (profile != null && StringUtils.hasText(profile.getFullName())) percent += 60;
        else missing.add("Add your full name");
        if (profile != null && StringUtils.hasText(profile.getPhone())) percent += 20;
        else missing.add("Add phone");
        if (profile != null && StringUtils.hasText(profile.getPosition())) percent += 20;
        else missing.add("Add your position");

        return OnboardingStateResponse.builder()
                .basic(OnboardingStateResponse.BasicInfoDto.builder()
                        .fullName(profile != null ? profile.getFullName() : null)
                        .phone(profile != null ? profile.getPhone() : null)
                        .build())
                .educations(List.of())
                .skills(List.of())
                .experiences(List.of())
                .projects(List.of())
                .preferences(OnboardingStateResponse.PreferencesDto.builder().build())
                .resume(OnboardingStateResponse.ResumeInfoDto.builder().uploaded(false).build())
                .completion(ProfileCompletionResponse.builder()
                        .percent(percent)
                        .missing(missing)
                        .canFinish(profile != null && StringUtils.hasText(profile.getFullName()))
                        .onboardingStep(percent >= 60 ? 1 : 0)
                        .build())
                .onboardingCompleted(user.isOnboardingCompleted())
                .build();
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
    }

    private User requireSeeker(String email) {
        User user = requireUser(email);
        if (user.getRole() != Role.JOB_SEEKER && user.getRole() != Role.ADMIN) {
            throw new ApiException("This onboarding step is for job seekers", 403);
        }
        return user;
    }

    private CandidateProfile requireCandidate(User user) {
        return candidateProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException("Candidate profile not found", 404));
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private String normalizeLevel(String level) {
        if (!StringUtils.hasText(level)) return "Intermediate";
        return switch (level.trim().toLowerCase(Locale.ROOT)) {
            case "beginner" -> "Beginner";
            case "advanced" -> "Advanced";
            case "expert" -> "Expert";
            default -> "Intermediate";
        };
    }
}
