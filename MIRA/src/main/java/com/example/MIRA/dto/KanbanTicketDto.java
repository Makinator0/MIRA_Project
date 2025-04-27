package com.example.MIRA.dto;

import com.example.MIRA.models.Ticket;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class KanbanTicketDto {
    private Long id;
    private String title;
    private String description;
    private Enum status;
    private Enum priority;
    private UserShortInfoDto author;
    private UserShortInfoDto assignee;
    private Set<String> tags;
    private Enum type;
    private Enum project;
    private List<KanbanSprintDto> sprints;
    private String createdAt;
    private String updatedAt;
    public KanbanTicketDto(Ticket ticket) {
        this.id = ticket.getId();
        this.title = ticket.getTitle();
        this.description = ticket.getDescription();
        this.status = ticket.getStatus();
        this.priority = ticket.getPriority();
        this.author = ticket.getAuthor() != null ? new UserShortInfoDto(ticket.getAuthor()) : null;
        this.assignee = ticket.getAssignee() != null ? new UserShortInfoDto(ticket.getAssignee()) : null;
        this.tags = (Set<String>) ticket.getTags();
        this.type = ticket.getType();
        this.createdAt = ticket.getCreatedAt() != null ? ticket.getCreatedAt().toString() : null;
        this.updatedAt = ticket.getUpdatedAt() != null ? ticket.getUpdatedAt().toString() : null;
        this.project = ticket.getProject();
        this.sprints = ticket.getSprints() != null ? ticket.getSprints().stream()
                .map(KanbanSprintDto::new)
                .collect(Collectors.toList()) : null;
    }

}