package com.example.MIRA.controllers;

import com.example.MIRA.models.Sprint;
import com.example.MIRA.services.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {

    private final SprintService sprintService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public SprintController(SprintService sprintService, SimpMessagingTemplate messagingTemplate) {
        this.sprintService = sprintService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/start")
    public ResponseEntity<Sprint> startSprint(@RequestBody Sprint sprint) {
        Sprint createdSprint = sprintService.startSprint(sprint);
        messagingTemplate.convertAndSend("/topic/sprints", createdSprint);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSprint);
    }
}

