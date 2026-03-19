package com.example.integradora_spring_boot.controller;
import com.example.integradora_spring_boot.model.EstadoUsuario;
import com.example.integradora_spring_boot.model.Usuario;
import com.example.integradora_spring_boot.repository.UsuarioRepository;
import com.example.integradora_spring_boot.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService; // Inyectamos el servicio de correo


// Funcion para que el usuario ingrese

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario datosLogin) {
        return Optional.ofNullable(usuarioRepository.findByEmail(datosLogin.getEmail()))
                .map(usuarioEncontrado -> {

                    // 1. Validar la contraseña usando el passwordEncoder
                    if (!passwordEncoder.matches(datosLogin.getPassword(), usuarioEncontrado.getPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
                    }

                    // 2. Validar si está inactivo
                    if (com.example.integradora_spring_boot.model.EstadoUsuario.inactivo.equals(usuarioEncontrado.getEstado())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Tu cuenta está inactiva. Contacta al administrador.");
                    }

                    // 3. Si pasó ambas validaciones, devolvemos el usuario
                    return ResponseEntity.ok(usuarioEncontrado);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario no existe"));
    }


// Funcion para registrar nuevo usuuario

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // Inyectamos el encriptador

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        // Esto aparecerá en tu consola de IntelliJ. Si sale null, es que el JSON está mal.
        System.out.println("DEBUG: Nombre recibido -> " + nuevoUsuario.getNombre());
        System.out.println("DEBUG: Email recibido -> " + nuevoUsuario.getEmail());

        if (nuevoUsuario.getNombre() == null || nuevoUsuario.getNombre().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: El nombre de usuario no llegó al servidor.");
        }

        nuevoUsuario.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));
        nuevoUsuario.setEstado(EstadoUsuario.inactivo);

        return ResponseEntity.ok(usuarioRepository.save(nuevoUsuario));
    }




// --- RECUPERACIÓN ---

@PostMapping("/recuperar")
public ResponseEntity<?> enviarCodigo(@RequestBody Map<String, String> request) {
    System.out.println("DEBUG: Datos recibidos desde la App: " + request);

    String email = request.get("email");
    System.out.println("DEBUG: Email extraído: [" + email + "]");
    Usuario usuario = usuarioRepository.findByEmail(email);

    if (usuario != null) {
        String codigo = String.valueOf((int) (Math.random() * 900000) + 100000);

        usuario.setCodigoRecuperacion(codigo);
        usuarioRepository.save(usuario);

        try {
            emailService.enviarCodigoRecuperacion(email, codigo);
            return ResponseEntity.ok().body(Map.of("message", "Código enviado con éxito"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al enviar el correo: " + e.getMessage()));
        }
    }

    // Si llega aquí, es que findByEmail devolvió null
    return ResponseEntity.status(404).body(Map.of("message", "El correo no está registrado"));
}

@PostMapping("/restablecer")
public ResponseEntity<?> restablecerPassword(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String codigo = request.get("codigo");
    String newPassword = request.get("newPassword");

    Optional<Usuario> usuarioOpt = usuarioRepository.findAll().stream()
            .filter(u -> u.getEmail().equalsIgnoreCase(email) &&
                    codigo.equals(u.getCodigoRecuperacion()))
            .findFirst();

    if (usuarioOpt.isPresent()) {
        Usuario usuario = usuarioOpt.get();
        usuario.setPassword(newPassword); // Actualizamos la contraseña
        usuario.setCodigoRecuperacion(null);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok().body(Map.of("message", "Contraseña actualizada"));
    }
    return ResponseEntity.status(400).body(Map.of("message", "Código incorrecto o datos inválidos"));
}




    // --- OBTENER USUARIOS ACTIVOS ---
    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> obtenerUsuariosActivos() {
        System.out.println("---- PIDIENDO USUARIOS ACTIVOS ----");

        try {
            // Obtenemos todos los usuarios y usamos un filtro (Stream) para quedarnos solo con los activos
            List<Usuario> usuariosActivos = usuarioRepository.findAll().stream()
                    .filter(u -> com.example.integradora_spring_boot.model.EstadoUsuario.activo.equals(u.getEstado()))
                    .toList();

            return ResponseEntity.ok(usuariosActivos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }



    // --- OBTENER USUARIOS ACTIVOS Y SIN EQUIPO (Para el modal) ---
    @GetMapping("/activos/sin-equipo")
    public ResponseEntity<List<Usuario>> obtenerUsuariosSinEquipo() {
        System.out.println("---- PIDIENDO USUARIOS DISPONIBLES ----");
        try {
            List<Usuario> usuariosDisponibles = usuarioRepository.findAll().stream()
                    // Filtramos que estén activos
                    .filter(u -> com.example.integradora_spring_boot.model.EstadoUsuario.activo.equals(u.getEstado()))
                    // NUEVO FILTRO: Que NO tengan un equipo asignado (que sea null)
                    .filter(u -> u.getIdEquipo() == null)
                    .toList();

            return ResponseEntity.ok(usuariosDisponibles);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    // --- ASIGNAR EQUIPO A UN USUARIO (Con candado de seguridad) ---
    @PutMapping("/{idUsuario}/equipo/{idEquipo}")
    public ResponseEntity<?> asignarEquipo(@PathVariable Long idUsuario, @PathVariable Integer idEquipo) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // CANDADO: Verificamos si ya tiene un equipo
            if (usuario.getIdEquipo() != null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Este usuario ya pertenece a un equipo."));
            }

            usuario.setIdEquipo(idEquipo);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(Map.of("message", "Usuario asignado al equipo con éxito"));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Usuario no encontrado"));
    }


}






