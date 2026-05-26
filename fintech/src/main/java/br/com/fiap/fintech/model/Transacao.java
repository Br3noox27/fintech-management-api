package br.com.fiap.fintech.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_TRANSACAO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_transacao")
    @SequenceGenerator(name = "seq_transacao", sequenceName = "SQ_TRANSACAO", allocationSize = 1)
    @Column(name = "ID_TRANSACAO")
    private Long id;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(name = "DS_TRANSACAO", nullable = false, length = 200)
    private String descricao;

    @NotBlank(message = "Tipo é obrigatório (RECEITA ou DESPESA)")
    @Column(name = "TP_TRANSACAO", nullable = false, length = 20)
    private String tipo;

    @NotBlank(message = "Categoria é obrigatória")
    @Column(name = "DS_CATEGORIA", nullable = false, length = 50)
    private String categoria;

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser maior que zero")
    @Column(name = "VL_TRANSACAO", nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(name = "DT_TRANSACAO", nullable = false)
    private LocalDateTime dataTransacao;

    @NotNull(message = "Conta é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONTA", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Conta conta;

    @PrePersist
    public void prePersist() {
        if (this.dataTransacao == null) {
            this.dataTransacao = LocalDateTime.now();
        }
    }
}
