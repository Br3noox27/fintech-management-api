 package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.dto.DepositoDTO;
import br.com.fiap.fintech.dto.TransferenciaDTO;
import br.com.fiap.fintech.model.Conta;
import br.com.fiap.fintech.service.ContaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contas")
public class ContaController {

    @Autowired
    private ContaService contaService;

    @GetMapping
    public ResponseEntity<List<Conta>> listar() {
        return ResponseEntity.ok(contaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conta> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(contaService.buscarPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Conta>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(contaService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Conta> criar(@Valid @RequestBody Conta conta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contaService.criar(conta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conta> atualizar(@PathVariable Long id, @Valid @RequestBody Conta conta) {
        return ResponseEntity.ok(contaService.atualizar(id, conta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        contaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/depositar")
    public ResponseEntity<Conta> depositar(@PathVariable Long id, @RequestBody DepositoDTO dto) {
        return ResponseEntity.ok(contaService.depositar(id, dto.getValor(), dto.getDescricao(), dto.getTipo()));
    }

    @PostMapping("/transferir")
    public ResponseEntity<Void> transferir(@RequestBody TransferenciaDTO dto) {
        contaService.transferir(dto.getContaOrigemId(), dto.getContaDestinoId(), dto.getValor(), dto.getDescricao());
        return ResponseEntity.ok().build();
    }
}