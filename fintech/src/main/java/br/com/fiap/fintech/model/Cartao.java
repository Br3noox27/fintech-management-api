package br.com.fiap.fintech.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TB_CARTAO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_cartao")
    @SequenceGenerator(name = "seq_cartao", sequenceName = "SQ_CARTAO", allocationSize = 1)
    @Column(name = "ID_CARTAO")
    private Long id;

    @NotBlank(message = "A bandeira é obrigatória")
    @Column(name = "DS_BANDEIRA", nullable = false, length = 50)
    private String bandeira;

    @NotBlank(message = "Os últimos 4 dígitos são obrigatórios")
    @Column(name = "NR_FINAL", nullable = false, length = 4)
    private String numeroFinal;

    @NotBlank(message = "O tipo é obrigatório")
    @Column(name = "TP_CARTAO", nullable = false, length = 20)
    private String tipo; // "CREDITO" ou "DEBITO"

    @NotNull(message = "O limite é obrigatório")
    @Positive(message = "O limite deve ser positivo")
    @Column(name = "VL_LIMITE", nullable = false)
    private Double limite;

    @ManyToOne
    @JoinColumn(name = "ID_CONTA", nullable = false)
    private Conta conta;
}
