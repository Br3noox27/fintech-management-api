package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.Cartao;
import br.com.fiap.fintech.service.CartaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
public class CartaoController {

    @Autowired
    private CartaoService cartaoService;

    @GetMapping
    public ResponseEntity<List<Cartao>> listar() {
        return ResponseEntity.ok(cartaoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cartao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cartaoService.buscarPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Cartao>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(cartaoService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Cartao> criar(@Valid @RequestBody Cartao cartao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartaoService.criar(cartao));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cartao> atualizar(@PathVariable Long id, @Valid @RequestBody Cartao cartao) {
        return ResponseEntity.ok(cartaoService.atualizar(id, cartao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        cartaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
