package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.BusinessException;
import br.com.fiap.fintech.exception.ResourceNotFoundException;
import br.com.fiap.fintech.model.Conta;
import br.com.fiap.fintech.model.Transacao;
import br.com.fiap.fintech.repository.ContaRepository;
import br.com.fiap.fintech.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private ContaService contaService;

    public List<Transacao> listarTodas() {
        return transacaoRepository.findAll();
    }

    public List<Transacao> listarPorConta(Long contaId) {
        return transacaoRepository.findByContaIdOrderByDataTransacaoDesc(contaId);
    }

    public Transacao buscarPorId(Long id) {
        return transacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada com id: " + id));
    }

    @Transactional
    public Transacao criar(Transacao transacao) {
        Conta conta = contaService.buscarPorId(transacao.getConta().getId());
        validarTipo(transacao.getTipo());

        // REGRA DE NEGÓCIO: atualiza saldo da conta
        if ("RECEITA".equalsIgnoreCase(transacao.getTipo())) {
            conta.setSaldo(conta.getSaldo().add(transacao.getValor()));
        } else {
            if (conta.getSaldo().compareTo(transacao.getValor()) < 0) {
                throw new BusinessException("Saldo insuficiente para realizar a despesa");
            }
            conta.setSaldo(conta.getSaldo().subtract(transacao.getValor()));
        }

        contaRepository.save(conta);
        transacao.setConta(conta);
        return transacaoRepository.save(transacao);
    }

    @Transactional
    public Transacao atualizar(Long id, Transacao dados) {
        Transacao existente = buscarPorId(id);
        validarTipo(dados.getTipo());

        // reverte efeito da transação antiga no saldo
        Conta conta = existente.getConta();
        reverterSaldo(conta, existente);

        // aplica os novos dados
        existente.setDescricao(dados.getDescricao());
        existente.setCategoria(dados.getCategoria());
        existente.setTipo(dados.getTipo());
        existente.setValor(dados.getValor());

        // aplica o novo efeito no saldo
        if ("RECEITA".equalsIgnoreCase(existente.getTipo())) {
            conta.setSaldo(conta.getSaldo().add(existente.getValor()));
        } else {
            conta.setSaldo(conta.getSaldo().subtract(existente.getValor()));
        }

        contaRepository.save(conta);
        return transacaoRepository.save(existente);
    }

    @Transactional
    public void deletar(Long id) {
        Transacao transacao = buscarPorId(id);
        // reverte efeito no saldo antes de deletar
        Conta conta = transacao.getConta();
        reverterSaldo(conta, transacao);
        contaRepository.save(conta);
        transacaoRepository.delete(transacao);
    }

    private void reverterSaldo(Conta conta, Transacao transacao) {
        if ("RECEITA".equalsIgnoreCase(transacao.getTipo())) {
            conta.setSaldo(conta.getSaldo().subtract(transacao.getValor()));
        } else {
            conta.setSaldo(conta.getSaldo().add(transacao.getValor()));
        }
    }

    private void validarTipo(String tipo) {
        if (!"RECEITA".equalsIgnoreCase(tipo) && !"DESPESA".equalsIgnoreCase(tipo)) {
            throw new BusinessException("Tipo de transação deve ser RECEITA ou DESPESA");
        }
    }
}