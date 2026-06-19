package br.com.fiap.fintech.dto;

import br.com.fiap.fintech.model.Usuario;

public record UsuarioResponseDTO(Long id, String nome, String email) {
    public static UsuarioResponseDTO de(Usuario u) {
        return new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail());
    }
}
