package com.example.MIRA.services;

import com.example.MIRA.models.Sprint;
import com.example.MIRA.models.User;
import com.example.MIRA.models.enums.Project;
import com.example.MIRA.repositories.SprintRepository;
import com.example.MIRA.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Autowired
    public SprintService(SprintRepository sprintRepository, JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.sprintRepository = sprintRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    public Sprint startSprint(Sprint sprint) {
        Sprint currentSprint = sprintRepository.findCurrentSprintByProject(sprint.getProject());

        if (currentSprint != null) {
            // Если текущий спринт существует, обновляем его
            currentSprint.setEndDate(LocalDateTime.now().minusSeconds(1));
            sprintRepository.save(currentSprint);
        }

        // Устанавливаем дату старта, если она не передана
        if (sprint.getStartDate() == null) {
            sprint.setStartDate(LocalDateTime.now());
        }

        // Устанавливаем дату завершения, если она не передана (по умолчанию +14 дней)
        if (sprint.getEndDate() == null) {
            sprint.setEndDate(sprint.getStartDate().plusDays(14));
        }

        // Устанавливаем проект для спринта
        sprint.setProject(sprint.getProject());

        // Сохраняем новый спринт
        return sprintRepository.save(sprint);
    }
    public List<Sprint> getAllCurrentSprints(Map<String, Object> message) {
        // Извлечение токена из сообщения
        String token = (String) message.get("token");
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("Invalid or missing JWT token");
        }

        String userinfo = jwtTokenProvider.getUsernameFromToken(token);
        if (userinfo == null) {
            throw new RuntimeException("User information missing in token");
        }
        List<Project> allProjects = Arrays.asList(Project.values());
        List<Sprint> currentSprints = new ArrayList<>();

        for (Project project : allProjects) {
            Sprint currentSprint = sprintRepository.findCurrentSprintByProject(project);
            if (currentSprint != null) {
                currentSprints.add(currentSprint);
            }
        }

        return currentSprints;
    }




    // Добавляем метод findById
    public Optional<Sprint> findById(Long id) {
        return sprintRepository.findById(id);
    }
    // Метод для поиска текущего спринта, где текущая дата находится между startDate и endDate
    public Sprint findCurrentSprint(LocalDateTime date) {
        return sprintRepository
                .findFirstByStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByStartDateDesc(date, date)
                .orElse(null);
    }

}
