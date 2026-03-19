package com.example.integradora_spring_boot.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Equipos")
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipo")
    private Integer id;

    // Aquí le decimos que en Java se llama "nombre", pero en la BD es "name_equipo" con máximo 50 caracteres
    @Column(name = "name_equipo", nullable = false, length = 50)
    private String nombre;

    // Se llama igual, pero le especificamos el límite de 1000 caracteres
    @Column(name = "descripcion", length = 1000)
    private String descripcion;

    // Agregamos la columna de miembros con un valor por defecto de 0
    @Column(name = "cantidad_miembros")
    private Integer cantidadMiembros = 0;

    // Constructor vacío
    public Equipo() {
    }

    // --- GETTERS Y SETTERS ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getCantidadMiembros() { return cantidadMiembros; }
    public void setCantidadMiembros(Integer cantidadMiembros) { this.cantidadMiembros = cantidadMiembros; }
}