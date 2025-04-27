package com.example.MIRA.repositories;

import com.example.MIRA.models.Sprint;
import com.example.MIRA.models.enums.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    // В интерфейсе SprintRepository
    Optional<Sprint> findFirstByStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByStartDateDesc(LocalDateTime date1, LocalDateTime date2);
    @Query("SELECT s FROM Sprint s WHERE s.project = :project AND s.startDate <= CURRENT_TIMESTAMP AND s.endDate >= CURRENT_TIMESTAMP ORDER BY s.startDate DESC LIMIT 1")
    Sprint findCurrentSprintByProject(@Param("project") Project project);

}

