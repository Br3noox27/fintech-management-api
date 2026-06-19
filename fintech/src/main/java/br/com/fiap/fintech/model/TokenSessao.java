package br.com.fiap.fintech.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "TB_TOKEN_SESSAO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenSessao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_token")
    @SequenceGenerator(name = "seq_token", sequenceName = "SQ_TOKEN_SESSAO", allocationSize = 1)
    @Column(name = "ID_TOKEN")
    private Long id;

    @Column(name = "DS_TOKEN", nullable = false, unique = true, length = 64)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;

    @Column(name = "DT_CRIACAO", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "DT_EXPIRACAO", nullable = false)
    private LocalDateTime expiraEm;
}
