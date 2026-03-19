package com.example.integradora_spring_boot.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Prioridad {
    BAJA("Baja"),
    MEDIA("Media"),
    ALTA("Alta");

    private final String valor;

    Prioridad(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }
}