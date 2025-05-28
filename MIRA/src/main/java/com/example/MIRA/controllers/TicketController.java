package com.example.MIRA.controllers;

import com.example.MIRA.dto.KanbanTicketDto;
import com.example.MIRA.models.Ticket;
import com.example.MIRA.services.TicketService;
import com.example.MIRA.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@Slf4j
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
    public ResponseEntity<KanbanTicketDto> createTicket(@RequestBody Ticket ticket) {
        log.info("Received ticket creation request: {}", ticket);
        KanbanTicketDto createdTicket = ticketService.createAndBroadcastTicket(ticket);
        log.info("Created ticket: {}", createdTicket);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }
    // Получение информации о тикете по displayId
    @GetMapping("/{ticketId}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long ticketId) {
        log.info("Received request for ticket with ID: {}", ticketId);
        Optional<Ticket> ticket = ticketService.getTicketById(ticketId);

        if (ticket.isPresent()) {
            log.info("Ticket found: {}", ticket.get());
            return ResponseEntity.ok(ticket.get());
        } else {
            log.warn("Ticket with ID {} not found", ticketId);
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{ticketId}")
    public ResponseEntity<KanbanTicketDto> updateTicket(
            @PathVariable Long ticketId,
            @RequestBody Ticket ticketUpdates) {
        log.info("Received update request for ticket ID {}: {}", ticketId, ticketUpdates);

        try {
            KanbanTicketDto updatedTicket = ticketService.updateAndBroadcastTicket(ticketId, ticketUpdates);
            return ResponseEntity.ok(updatedTicket);
        } catch (RuntimeException e) {
            log.error("Ticket not found with ID {}: {}", ticketId, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating ticket ID {}: {}", ticketId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




//    @MessageMapping("/updateTicket")
//    @SendTo("/topic/tickets")
//    public Ticket updateTicket(Ticket ticket) {
//        Ticket updatedTicket = ticketService.updateTicket(ticket);
//        return updatedTicket; // Отправляем обновлённый тикет всем подключённым клиентам
//    }

}
