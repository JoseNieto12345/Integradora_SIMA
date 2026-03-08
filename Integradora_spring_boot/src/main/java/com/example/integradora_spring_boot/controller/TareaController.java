package com.example.integradora_spring_boot.controller;
import com.example.integradora_spring_boot.model.Tarea;
import com.example.integradora_spring_boot.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {
    @Autowired
    private TareaRepository tareaRepository;

}