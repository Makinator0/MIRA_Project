package com.example.MIRA.repositories;

import com.example.MIRA.models.Ticket;
import com.example.MIRA.models.User;
import com.example.MIRA.models.enums.Project;  // Импортируем перечисление Project
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT MAX(t.projectNumber) FROM Ticket t WHERE t.project = :project")
    Long findMaxProjectNumberByProject(@Param("project") Project project);
    Optional<Ticket> findById(Long id);
    // Измените тип параметра на Project
    List<Ticket> findByProjectAndAssigneeOrProjectAndAuthor(Project project, User assignee, Project project2, User author);
}
