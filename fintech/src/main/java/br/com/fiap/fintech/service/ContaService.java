package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.BusinessException;
import br.com.fiap.fintech.exception.ResourceNotFoundException;
import br.com.fiap.fintech.model.Conta;
import br.com.fiap.fintech.model.Transacao;
import br.com.fiap.fintech.model.Usuario;
import br.com.fiap.fintech.repository.ContaRepository;
import br.com.fiap.fintech.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContaService {

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private UsuarioService usuarioService;

    public List<Conta> listarTodas() {
        return contaRepository.findAll();
    }

    public List<Conta> listarPorUsuario(Long usuarioId) {
        return contaRepository.findByUsuarioId(usuarioId);
    }

    public Conta buscarPorId(Long id) {
        return contaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada com id: " + id));
    }

    public Conta criar(Conta conta) {
        Usuario usuario = usuarioService.buscarPorId(conta.getUsuario().getId());
        conta.setUsuario(usuario);
        return contaRepository.save(conta);
    }

    public Conta atualizar(Long id, Conta dados) {
        Conta existente = buscarPorId(id);
        existente.setNome(dados.getNome());
        existente.setTipo(dados.getTipo());
        existente.setSaldo(dados.getSaldo());
        return contaRepository.save(existente);
    }

    public void deletar(Long id) {
        Conta conta = buscarPorId(id);
        contaRepository.delete(conta);
    }

    @Transactional
    public Conta depositar(Long id, BigDecimal valor, String descricao, String tipo) {
        Conta conta = buscarPorId(id);
        String tipoFinal = (tipo != null && tipo.equals("DESPESA")) ? "DESPESA" : "RECEITA";

        if (tipoFinal.equals("RECEITA")) {
            conta.setSaldo(conta.getSaldo().add(valor));
        } else {
            if (conta.getSaldo().compareTo(valor) < 0) throw new BusinessException("Saldo insuficiente");
            conta.setSaldo(conta.getSaldo().subtract(valor));
        }
        contaRepository.save(conta);

        Transacao tx = new Transacao();
        tx.setConta(conta);
        tx.setTipo(tipoFinal);
        tx.setCategoria("DEPOSITO");
        tx.setDescricao(descricao != null && !descricao.isBlank() ? descricao : (tipoFinal.equals("RECEITA") ? "Depósito" : "Despesa"));
        tx.setValor(valor);
        tx.setDataTransacao(LocalDateTime.now());
        transacaoRepository.save(tx);

        return conta;
    }

    @Transactional
    public void transferir(Long origemId, Long destinoId, BigDecimal valor, String descricao) {
        if (origemId.equals(destinoId)) {
            throw new BusinessException("Conta de origem e destino não podem ser iguais");
        }
        Conta origem = buscarPorId(origemId);
        Conta destino = buscarPorId(destinoId);

        if (origem.getSaldo().compareTo(valor) < 0) {
            throw new BusinessException("Saldo insuficiente");
        }

        origem.setSaldo(origem.getSaldo().subtract(valor));
        destino.setSaldo(destino.getSaldo().add(valor));
        contaRepository.save(origem);
        contaRepository.save(destino);

        String desc = descricao != null && !descricao.isBlank() ? descricao : "Transferência";

        Transacao saida = new Transacao();
        saida.setConta(origem);
        saida.setTipo("DESPESA");
        saida.setCategoria("TRANSFERENCIA");
        saida.setDescricao("PIX enviado: " + desc);
        saida.setValor(valor);
        saida.setDataTransacao(LocalDateTime.now());
        transacaoRepository.save(saida);

        Transacao entrada = new Transacao();
        entrada.setConta(destino);
        entrada.setTipo("RECEITA");
        entrada.setCategoria("TRANSFERENCIA");
        entrada.setDescricao("PIX recebido: " + desc);
        entrada.setValor(valor);
        entrada.setDataTransacao(LocalDateTime.now());
        transacaoRepository.save(entrada);
    }
}