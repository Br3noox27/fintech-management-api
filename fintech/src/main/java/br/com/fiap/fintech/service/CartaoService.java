package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.ResourceNotFoundException;
import br.com.fiap.fintech.model.Cartao;
import br.com.fiap.fintech.model.Conta;
import br.com.fiap.fintech.repository.CartaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartaoService {

    @Autowired
    private CartaoRepository cartaoRepository;

    @Autowired
    private ContaService contaService;

    public List<Cartao> listarTodos() {
        return cartaoRepository.findAll();
    }

    public List<Cartao> listarPorUsuario(Long usuarioId) {
        return cartaoRepository.findByContaUsuarioId(usuarioId);
    }

    public Cartao buscarPorId(Long id) {
        return cartaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cartão não encontrado com id: " + id));
    }

    public Cartao criar(Cartao cartao) {
        Conta conta = contaService.buscarPorId(cartao.getConta().getId());
        cartao.setConta(conta);
        return cartaoRepository.save(cartao);
    }

    public Cartao atualizar(Long id, Cartao dados) {
        Cartao existente = buscarPorId(id);
        existente.setBandeira(dados.getBandeira());
        existente.setNumeroFinal(dados.getNumeroFinal());
        existente.setTipo(dados.getTipo());
        existente.setLimite(dados.getLimite());
        return cartaoRepository.save(existente);
    }

    public void deletar(Long id) {
        Cartao cartao = buscarPorId(id);
        cartaoRepository.delete(cartao);
    }
}
