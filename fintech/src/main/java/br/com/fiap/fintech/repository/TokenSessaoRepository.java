package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.TokenSessao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TokenSessaoRepository extends JpaRepository<TokenSessao, Long> {
    Optional<TokenSessao> findByToken(String token);
    void deleteByToken(String token);
    void deleteByExpiraEmBefore(LocalDateTime agora);
}
