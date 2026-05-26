package br.com.fiap.fintech.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "TB_CONTA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_conta")
    @SequenceGenerator(name = "seq_conta", sequenceName = "SQ_CONTA", allocationSize = 1)

    @Column(name = "ID_CONTA")
    private Long id;

    @NotBlank(message = "Nome da conta é obrigatório")
    @Column(name = "NM_CONTA", nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "Tipo é obrigatório (CORRENTE, POUPANCA, INVESTIMENTO)")
    @Column(name = "TP_CONTA", nullable = false, length = 20)
    private String tipo;

    @NotNull(message = "Saldo é obrigatório")
    @Column(name = "VL_SALDO", nullable = false, precision = 15, scale = 2)
    private BigDecimal saldo;

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Usuario usuario;
}
