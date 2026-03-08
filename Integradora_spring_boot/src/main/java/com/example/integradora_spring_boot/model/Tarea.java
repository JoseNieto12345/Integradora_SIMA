package com.example.integradora_spring_boot.model;
import jakarta.persistence.*;

@Entity
@Table(name = "tareas")
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_tarea;
    private String name_tarea;
    @Enumerated(EnumType.STRING)
    private EstadoTarea estado;
    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

}