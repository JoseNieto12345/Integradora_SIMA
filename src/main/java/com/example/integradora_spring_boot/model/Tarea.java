package com.example.integradora_spring_boot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Tareas")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_tarea;

    @Column(name = "name_tarea", nullable = false, length = 50)
    private String name_tarea;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Column(name = "id_usuario", nullable = false)
    private Long id_usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTarea estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prioridad prioridad;

    @Column(name = "fecha_entrega")
    private LocalDateTime fecha_entrega;

    // Constructor vacío requerido por JPA
    public Tarea() {}

    // --- Getters y Setters ---
    public Long getId_tarea() { return id_tarea; }
    public void setId_tarea(Long id_tarea) { this.id_tarea = id_tarea; }

    public String getName_tarea() { return name_tarea; }
    public void setName_tarea(String name_tarea) { this.name_tarea = name_tarea; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Long getId_usuario() { return id_usuario; }
    public void setId_usuario(Long id_usuario) { this.id_usuario = id_usuario; }

    public EstadoTarea getEstado() { return estado; }
    public void setEstado(EstadoTarea estado) { this.estado = estado; }

    public Prioridad getPrioridad() { return prioridad; }
    public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }

    public LocalDateTime getFecha_entrega() { return fecha_entrega; }
    public void setFecha_entrega(LocalDateTime fecha_entrega) { this.fecha_entrega = fecha_entrega; }
}