package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.dto.LoginDTO;
import br.com.fiap.fintech.model.TokenSessao;
import br.com.fiap.fintech.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDTO login) {
        TokenSessao sessao = authService.login(login.getEmail(), login.getSenha());

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("token", sessao.getToken());
        resposta.put("expiraEm", sessao.getExpiraEm());
        resposta.put("usuario", Map.of(
            "id", sessao.getUsuario().getId(),
            "nome", sessao.getUsuario().getNome(),
            "email", sessao.getUsuario().getEmail()
        ));
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // remove "Bearer "
        authService.logout(token);
        return ResponseEntity.noContent().build();
    }
}
