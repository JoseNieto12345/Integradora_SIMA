package com.example.integradora_spring_boot.controller;

import com.example.integradora_spring_boot.model.Tarea;
import com.example.integradora_spring_boot.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*") // Permite peticiones desde tu frontend en React
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @GetMapping
    public List<Tarea> obtenerTareas() {
        return tareaRepository.findAll();
    }

    @PostMapping("/crear")
    public ResponseEntity<Tarea> crearTarea(@RequestBody Tarea nuevaTarea) {
        try {
            Tarea tareaGuardada = tareaRepository.save(nuevaTarea);
            return ResponseEntity.ok(tareaGuardada);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}