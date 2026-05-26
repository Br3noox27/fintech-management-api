package br.com.fiap.fintech.dto;

import java.math.BigDecimal;

public class DepositoDTO {
    private BigDecimal valor;
    private String descricao;
    private String tipo; 

    

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}


