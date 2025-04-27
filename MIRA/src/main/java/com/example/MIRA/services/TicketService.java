package com.example.MIRA.services;

import com.example.MIRA.dto.KanbanTicketDto;
import com.example.MIRA.models.Sprint;
import com.example.MIRA.models.Ticket;
import com.example.MIRA.models.User;
import com.example.MIRA.models.enums.Project;  // Импортируем перечисление Project
import com.example.MIRA.models.enums.TicketStatus;
import com.example.MIRA.repositories.TicketRepository;
import com.example.MIRA.security.JwtTokenProvider;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    private final SprintService sprintService;


    public TicketService(TicketRepository ticketRepository, SprintService sprintService, JwtTokenProvider jwtTokenProvider,UserService userService, SimpMessagingTemplate messagingTemplate) {
        this.ticketRepository = ticketRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.messagingTemplate = messagingTemplate;
        this.sprintService = sprintService;

    }


    // Обновите метод для использования перечисления Project вместо строки
    public List<Ticket> getTicketsByProjectAndUser(String project, User user) {
        // Преобразуем строку в соответствующий элемент перечисления Project
        Project projectEnum = Project.valueOf(project);  // Преобразуем строку в тип Project
        return ticketRepository.findByProjectAndAssigneeOrProjectAndAuthor(projectEnum, user, projectEnum, user);
    }

    public Ticket createTicket(Ticket ticket) {
        ticket.setAuthor(ticket.getAuthor());
        ticket.setAssignee(ticket.getAssignee());
        ticket.setProject(ticket.getProject());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        // Если у тикета нет статуса, устанавливаем его в "TO_DO" по умолчанию
        if (ticket.getStatus() == null) {
            ticket.setStatus(TicketStatus.TO_DO);
        }
        // Сохраняем тикет в базе данных
        return ticketRepository.save(ticket);
    }
    public List<KanbanTicketDto> getTicketsForUser(Map<String, Object> message) {
        // Извлечение токена из сообщения
        String token = (String) message.get("token");
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("Invalid or missing JWT token");
        }

        String userinfo = jwtTokenProvider.getUsernameFromToken(token);
        if (userinfo == null) {
            throw new RuntimeException("User information missing in token");
        }

        User user = userService.getUserByEmail(userinfo);
        if (user == null) {
            throw new RuntimeException("User not found: " + userinfo);
        }

        String userProject = String.valueOf(user.getProject());

        // Получаем текущий спринт
        Sprint currentSprint = sprintService.findCurrentSprint(LocalDateTime.now());
        List<Ticket> allTickets;

        if (currentSprint == null) {
            // Если нет текущего спринта
            allTickets = getTicketsByProjectAndUser(userProject, user);
        } else {
            allTickets = getTicketsByProjectAndUser(userProject, user);

            // Обновляем тикеты нужных статусов
            Set<TicketStatus> updateStatuses = EnumSet.of(
                    TicketStatus.TO_DO,
                    TicketStatus.IN_PROGRESS,
                    TicketStatus.IN_REVIEW
            );

            for (Ticket ticket : allTickets) {
                if (updateStatuses.contains(ticket.getStatus())) {
                    if (ticket.getSprints() == null) {
                        ticket.setSprints(new ArrayList<>());
                    }
                    boolean sprintAlreadyAdded = ticket.getSprints().stream()
                            .anyMatch(s -> s.getId().equals(currentSprint.getId()));
                    if (!sprintAlreadyAdded) {
                        ticket.getSprints().add(currentSprint);
                        ticketRepository.save(ticket);
                    }
                }
            }

            // Оставляем только тикеты, у которых есть текущий спринт
            allTickets = allTickets.stream()
                    .filter(ticket -> ticket.getSprints() != null && ticket.getSprints().stream()
                            .anyMatch(s -> s.getId().equals(currentSprint.getId())))
                    .collect(Collectors.toList());
        }

        // Преобразуем все тикеты в TicketDto
        return allTickets.stream()
                .map(KanbanTicketDto::new)
                .collect(Collectors.toList());
    }



    public List<Ticket> createTicketForUser(Ticket ticket, String token) throws Exception {
        String username = jwtTokenProvider.getUsernameFromToken(token);
        User user = userService.getUserByEmail(username);
        String userProject = String.valueOf(user.getProject());

        // Проверяем, что пользователь добавляет тикет в свой проект
        if (!userProject.equals(ticket.getProject())) {
            throw new IllegalArgumentException("User cannot add a ticket to a project that doesn't belong to them.");
        }

        // Сохраняем тикет
        ticketRepository.save(ticket);

        // Возвращаем обновленный список тикетов для проекта и пользователя
        return getTicketsByProjectAndUser(userProject, user);
    }
    public KanbanTicketDto createAndBroadcastTicket(@RequestBody Ticket ticket) {
        User author = userService.getUserById(ticket.getAuthor().getId());
        User assignee = null;
        if (ticket.getAssignee() != null) {
            assignee = userService.getUserById(ticket.getAssignee().getId());
        }

        ticket.setAuthor(author);
        ticket.setAssignee(assignee);

        Sprint currentSprint = sprintService.findCurrentSprint(LocalDateTime.now());
        if (currentSprint != null) {
            ticket.getSprints().add(currentSprint);
        }

        Ticket createdTicket = createTicket(ticket);

        KanbanTicketDto kanbanTicketDto = new KanbanTicketDto(createdTicket);

        messagingTemplate.convertAndSend("/topic/kanban", kanbanTicketDto);

        return kanbanTicketDto;
    }



}
