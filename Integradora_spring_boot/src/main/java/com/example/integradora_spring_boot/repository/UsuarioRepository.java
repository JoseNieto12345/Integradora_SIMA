package com.example.integradora_spring_boot.repository;

import com.example.integradora_spring_boot.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Esto te permitirá buscar usuarios por email más adelante para el Login
    Usuario findByEmail(String email);
}