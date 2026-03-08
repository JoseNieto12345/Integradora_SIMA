package com.example.integradora_spring_boot.controller;
import com.example.integradora_spring_boot.model.Usuario;
import com.example.integradora_spring_boot.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario datosLogin) {
        // Buscamos al usuario por el correo que viene de React
        return usuarioRepository.findByEmail(datosLogin.getEmail())
                .map(usuarioEncontrado -> {
                    // Comparamos la contraseña (asegúrate de que coincidan los nombres de los campos)
                    if (usuarioEncontrado.getPassword().equals(datosLogin.getPassword())) {
                        // Si todo es correcto, devolvemos el usuario (esto incluye el name_user que React necesita)
                        return ResponseEntity.ok(usuarioEncontrado);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario no existe"));
    }

}