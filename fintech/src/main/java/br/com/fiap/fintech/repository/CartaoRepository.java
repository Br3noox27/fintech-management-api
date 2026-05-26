package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Cartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartaoRepository extends JpaRepository<Cartao, Long> {

    List<Cartao> findByContaUsuarioId(Long usuarioId);

}

