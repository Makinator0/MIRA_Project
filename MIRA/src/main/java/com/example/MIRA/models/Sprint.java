package com.example.MIRA.models;

import com.example.MIRA.models.enums.Project;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@Table(name = "sprints")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Имя спринта, например "Sprint 1"
    @Column(nullable = false)
    private String name;

    // Дата и время начала спринта (до секунды)
    @Column(nullable = false)
    private LocalDateTime startDate;

    // Дата и время окончания спринта (до секунды)
    @Column(nullable = false)
    private LocalDateTime endDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "project", nullable = false)
    private Project project;  // Привязка к проекту

    public Sprint() {}
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Sprint sprint = (Sprint) o;
        return Objects.equals(id, sprint.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    public Sprint(String name, LocalDateTime startDate, LocalDateTime endDate, Project project) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.project = project;
    }

    // Getters и setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}
