package com.example.integradora_spring_boot.controller;

import com.example.integradora_spring_boot.model.Equipo;
import com.example.integradora_spring_boot.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // IMPORTANTE: Agregamos esto para usar listas

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "*")
public class EquipoController {

    @Autowired
    private EquipoRepository equipoRepository;

    // 1. Método para OBTENER TODOS los equipos (ESTE ES EL QUE FALTABA)
    @GetMapping
    public ResponseEntity<List<Equipo>> obtenerTodosLosEquipos() {
        // Le pedimos al repositorio que busque todos los equipos en la BD
        List<Equipo> listaEquipos = equipoRepository.findAll();
        // Se los enviamos a React
        return ResponseEntity.ok(listaEquipos);
    }



    // 2. Método para crear un nuevo equipo
    @PostMapping("/crear")
    public ResponseEntity<?> crearEquipo(@RequestBody Equipo nuevoEquipo) {

        System.out.println("---- DATOS RECIBIDOS DESDE REACT ----");
        System.out.println("Nombre recibido: " + nuevoEquipo.getNombre());
        // ...

        try {
            // --- AQUÍ ESTÁ EL GUARDIA DE SEGURIDAD ---
            // Revisamos si el nombre ya existe en la BD
            if (equipoRepository.existsByNombre(nuevoEquipo.getNombre())) {
                // Si existe, detenemos todo y mandamos un Error 400 (Bad Request) con un mensaje
                return ResponseEntity.status(400).body("Ya existe un equipo llamado así. Por favor, elige otro nombre.");
            }

            // Si pasa la validación, lo guarda normal
            Equipo equipoGuardado = equipoRepository.save(nuevoEquipo);
            return ResponseEntity.ok(equipoGuardado);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear el equipo: " + e.getMessage());
        }
    }



    // 3. Método para ELIMINAR un equipo
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEquipo(@PathVariable Integer id) {

        System.out.println("---- PETICIÓN DE ELIMINACIÓN RECIBIDA ----");
        System.out.println("Intentando eliminar el equipo con ID: " + id);

        try {
            // 1. Verificamos si el equipo realmente existe en la BD
            if (!equipoRepository.existsById(id)) {
                System.out.println("Error: No se encontró el equipo.");
                return ResponseEntity.status(404).body("El equipo no existe");
            }

            // 2. Si existe, le decimos al repositorio que lo borre
            equipoRepository.deleteById(id);

            System.out.println("¡Equipo eliminado con éxito!");
            System.out.println("------------------------------------------");

            // Respondemos con un 200 OK para que React sepa que todo salió bien
            return ResponseEntity.ok("Equipo eliminado correctamente");

        } catch (Exception e) {
            System.out.println("Error al eliminar: " + e.getMessage());
            return ResponseEntity.status(500).body("Error al eliminar el equipo: " + e.getMessage());
        }
    }





}