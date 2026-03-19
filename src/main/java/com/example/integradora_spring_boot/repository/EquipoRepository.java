package com.example.integradora_spring_boot.repository;

import com.example.integradora_spring_boot.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Integer> {

    // --- ESTA ES LA LÍNEA NUEVA ---
    // Spring Boot entenderá: "Haz un SELECT para ver si existe el nombre X"
    boolean existsByNombre(String nombre);

}