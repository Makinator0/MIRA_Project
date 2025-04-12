package com.example.MIRA.repositories;

import com.example.MIRA.models.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    // В интерфейсе SprintRepository
    Optional<Sprint> findFirstByStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByStartDateDesc(LocalDateTime date1, LocalDateTime date2);

}

