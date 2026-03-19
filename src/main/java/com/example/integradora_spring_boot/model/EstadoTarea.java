package com.example.integradora_spring_boot.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoTarea {
    POR_HACER("Por Hacer"),
    EN_PROGRESO("En Progreso"),
    COMPLETADO("Completado");

    private final String valor;

    EstadoTarea(String valor) {
        this.valor = valor;
    }

    @JsonValue // Esto hace que Spring Boot reciba y envíe el texto exacto a React
    public String getValor() {
        return valor;
    }
}