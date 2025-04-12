package com.example.MIRA.services;

import com.example.MIRA.models.Sprint;
import com.example.MIRA.repositories.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;

    @Autowired
    public SprintService(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }

    public Sprint startSprint(Sprint sprint) {
        // Если дата старта не передана, устанавливаем на текущий момент
        if (sprint.getStartDate() == null) {
            sprint.setStartDate(LocalDateTime.now());
        }

        // Если endDate не задан, устанавливаем его как startDate + 14 дней
        if (sprint.getEndDate() == null) {
            sprint.setEndDate(sprint.getStartDate().plusDays(14));
        }

        // Обновляем предыдущий спринт (если он есть)
        // Здесь предполагается, что метод findCurrentSprint принимает LocalDateTime
        Sprint previousSprint = findCurrentSprint(sprint.getStartDate().minusSeconds(10));
        if (previousSprint != null) {
            // Устанавливаем endDate предыдущего спринта на 1 секунду меньше startDate нового спринта
            previousSprint.setEndDate(sprint.getStartDate().minusSeconds(10));
            sprintRepository.save(previousSprint);
        }

        // Сохраняем и возвращаем новый спринт
        return sprintRepository.save(sprint);
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
