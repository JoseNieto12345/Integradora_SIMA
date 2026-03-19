package com.example.integradora_spring_boot.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {




    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "name_user")
    @JsonProperty("name_user") // Esto le dice a Jackson: "En el JSON se llama name_user"
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoUsuario tipo;

    @Column(name = "id_equipo")
    private Integer idEquipo;

    // Cambiamos el tipo a EstadoUsuario (la Clase/Enum)
    // y el nombre de la variable a 'estado' (minúscula)
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoUsuario estado = EstadoUsuario.inactivo;


    // --- NUEVO CAMPO PARA RECUPERACIÓN ---
    @Column(name = "codigo_recuperacion")
    private String codigoRecuperacion;

    public Usuario() {
    }

    // --- GETTERS Y SETTERS CORREGIDOS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public TipoUsuario getTipo() { return tipo; }
    public void setTipo(TipoUsuario tipo) { this.tipo = tipo; }

    public Integer getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Integer idEquipo) { this.idEquipo = idEquipo; }

    // El nombre del método debe ser exactamente getEstado y setEstado
    public EstadoUsuario getEstado() {
        return estado;
    }

    public void setEstado(EstadoUsuario estado) {
        this.estado = estado;
    }

    // --- GETTER Y SETTER DEL NUEVO CAMPO ---
    public String getCodigoRecuperacion() {
        return codigoRecuperacion;
    }

    public void setCodigoRecuperacion(String codigoRecuperacion) {
        this.codigoRecuperacion = codigoRecuperacion;
    }
}