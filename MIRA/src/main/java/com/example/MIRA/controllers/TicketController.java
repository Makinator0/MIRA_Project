package com.example.MIRA.controllers;

import com.example.MIRA.models.Ticket;
import com.example.MIRA.repositories.TicketRepository;
import com.example.MIRA.services.TicketService;
import com.example.MIRA.services.UserService;
import com.example.MIRA.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final UserService userService;
    private final TicketService ticketService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public TicketController(UserService userService, TicketService ticketService, SimpMessagingTemplate messagingTemplate) {
        this.userService = userService;
        this.ticketService = ticketService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        Ticket createdTicket = ticketService.createAndBroadcastTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }




//    @MessageMapping("/updateTicket")
//    @SendTo("/topic/tickets")
//    public Ticket updateTicket(Ticket ticket) {
//        Ticket updatedTicket = ticketService.updateTicket(ticket);
//        return updatedTicket; // Отправляем обновлённый тикет всем подключённым клиентам
//    }

}
