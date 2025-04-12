package com.example.MIRA.controllers;

import com.example.MIRA.models.Sprint;
import com.example.MIRA.models.Ticket;
import com.example.MIRA.models.User;
import com.example.MIRA.security.JwtTokenProvider;
import com.example.MIRA.services.SprintService;
import com.example.MIRA.services.TicketService;
import com.example.MIRA.services.UserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
public class KanbanController {

    private final UserService userService;
    private final TicketService ticketService;
    private final JwtTokenProvider jwtTokenProvider;
    private final SprintService sprintService;

    public KanbanController(UserService userService, TicketService ticketService, JwtTokenProvider jwtTokenProvider, SprintService sprintService) {
        this.userService = userService;
        this.ticketService = ticketService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.sprintService = sprintService;
    }


    @MessageMapping("/getAllTickets")
    @SendTo("/topic/kanban")
    public List<Ticket> getAllTickets(@Payload Map<String, Object> message) {
        System.out.println(message.get("ticket"));
        return ticketService.getTicketsForUser(message);
    }
    @MessageMapping("/getSprint")
    @SendTo("/topic/sprints")
    public List<Sprint> getSprint() {
        Sprint currentSprint = sprintService.findCurrentSprint(LocalDateTime.now());
        if (currentSprint != null) {
            return Collections.singletonList(currentSprint);
        }
        return Collections.emptyList();
    }



    @MessageMapping("/getAllUsers")
    @SendTo("/topic/users")
    public List<User> getAllUsers() {
        return userService.list();
    }

//    @MessageMapping("/kanban/createTask")
//    @SendTo("/topic/kanban")
//    public List<Ticket> createTicket(Ticket ticket, HttpServletRequest request) {
//        String token = JwtTokenProvider.extractJwtFromRequest(request);
//        if (token != null && jwtTokenProvider.validateToken(token)) {
//            try {
//                return ticketService.createTicketForUser(ticket, token);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//        return List.of(); //
//    }


}
