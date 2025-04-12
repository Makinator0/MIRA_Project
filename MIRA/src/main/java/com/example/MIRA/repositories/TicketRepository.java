package com.example.MIRA.repositories;

import com.example.MIRA.models.Ticket;
import com.example.MIRA.models.User;
import com.example.MIRA.models.enums.Project;  // Импортируем перечисление Project
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Измените тип параметра на Project
    List<Ticket> findByProjectAndAssigneeOrProjectAndAuthor(Project project, User assignee, Project project2, User author);
}
