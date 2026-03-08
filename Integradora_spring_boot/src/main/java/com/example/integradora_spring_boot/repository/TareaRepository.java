package com.example.integradora_spring_boot.repository;

import com.example.integradora_spring_boot.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    // Aquí podrías agregar métodos como:
    // List<Tarea> findByEstado(EstadoTarea estado);


}