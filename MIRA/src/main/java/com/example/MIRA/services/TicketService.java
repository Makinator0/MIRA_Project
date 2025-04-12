package com.example.MIRA.services;

import com.example.MIRA.models.Sprint;
import com.example.MIRA.models.Ticket;
import com.example.MIRA.models.User;
import com.example.MIRA.models.enums.Project;  // Импортируем перечисление Project
import com.example.MIRA.models.enums.TicketStatus;
import com.example.MIRA.models.enums.TicketType;
import com.example.MIRA.repositories.TicketRepository;
import com.example.MIRA.security.JwtTokenProvider;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
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
    public List<Ticket> getTicketsForUser(Map<String, Object> message) {
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
        if (currentSprint == null) {
            System.out.println("ne nashel");
            // Если текущего спринта нет, возвращаем пустой список
            return getTicketsByProjectAndUser(userProject, user);
        }

        // Получаем все тикеты для проекта и пользователя
        List<Ticket> allTickets = getTicketsByProjectAndUser(userProject, user);
        System.out.println(allTickets);

        // Определяем набор статусов, для которых тикеты должны обновляться
        Set<TicketStatus> updateStatuses = EnumSet.of(
                TicketStatus.TO_DO,
                TicketStatus.IN_PROGRESS,
                TicketStatus.IN_REVIEW
        );

        // Для тикетов с нужными статусами добавляем текущий спринт, не удаляя предыдущие
        for (Ticket ticket : allTickets) {
            if (updateStatuses.contains(ticket.getStatus())) {
                // Инициализируем список спринтов, если он еще не создан
                if (ticket.getSprints() == null) {
                    ticket.setSprints(new ArrayList<>());
                }
                // Если текущего спринта еще нет в списке, добавляем его (сравнивая по id)
                boolean sprintAlreadyAdded = ticket.getSprints().stream()
                        .anyMatch(s -> s.getId().equals(currentSprint.getId()));
                if (!sprintAlreadyAdded) {
                    System.out.println("Before adding: " + ticket.getSprints());
                    ticket.getSprints().add(currentSprint);
                    System.out.println("After adding: " + ticket.getSprints());
                    ticketRepository.save(ticket);
                    System.out.println("Saved ticket: " + ticketRepository.findById(ticket.getId()));
                }
            }
        }

        // Возвращаем только те тикеты, в списке спринтов которых присутствует текущий спринт
        return allTickets.stream()
                .filter(ticket -> ticket.getSprints() != null && ticket.getSprints().stream()
                        .anyMatch(s -> s.getId().equals(currentSprint.getId())))
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
    public Ticket createAndBroadcastTicket(@RequestBody Ticket ticket) {
        // Загрузка полных данных о пользователе (авторе)
        User author = userService.getUserById(ticket.getAuthor().getId());

        // Загрузка данных об исполнителе, проверка на null
        User assignee = null;
        if (ticket.getAssignee() != null) {
            assignee = userService.getUserById(ticket.getAssignee().getId());
        }

        // Устанавливаем полные объекты авторов и исполнителей
        ticket.setAuthor(author);
        ticket.setAssignee(assignee);
        // Определяем текущий спринт
        Sprint currentSprint = sprintService.findCurrentSprint(LocalDateTime.now());
        if (currentSprint != null) {
            // Добавляем текущий спринт в список спринтов тикета
            ticket.getSprints().add(currentSprint);
        }
        // Сохраняем тикет в базе данных
        Ticket createdTicket = createTicket(ticket);

        // Отправка обновленного тикета с полными данными в WebSocket
        messagingTemplate.convertAndSend("/topic/kanban", createdTicket);

        return createdTicket;
    }


}
