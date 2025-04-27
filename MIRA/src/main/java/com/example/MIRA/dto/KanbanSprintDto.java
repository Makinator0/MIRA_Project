package com.example.MIRA.dto;

import com.example.MIRA.models.Sprint;

import java.time.LocalDateTime;

public class KanbanSprintDto {
    private Long id;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public KanbanSprintDto(Sprint sprint) {
        this.id = sprint.getId();
        this.name = sprint.getName();
        this.startDate = sprint.getStartDate();
        this.endDate = sprint.getEndDate();
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }
}

