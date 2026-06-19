package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.BusinessException;
import br.com.fiap.fintech.model.Usuario;
import br.com.fiap.fintech.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void deveLancarExcecaoQuandoEmailJaCadastrado() {
        when(usuarioRepository.existsByEmail("teste@fiap.com")).thenReturn(true);

        Usuario usuario = new Usuario();
        usuario.setEmail("teste@fiap.com");
        usuario.setSenha("123456");

        assertThrows(BusinessException.class, () -> usuarioService.criar(usuario));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void deveCriarUsuarioComSenhaHasheada() {
        Usuario usuario = new Usuario();
        usuario.setEmail("novo@fiap.com");
        usuario.setSenha("123456");

        when(usuarioRepository.existsByEmail("novo@fiap.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("$2a$hash");
        when(usuarioRepository.save(usuario)).thenReturn(usuario);

        usuarioService.criar(usuario);

        verify(passwordEncoder).encode("123456");
        verify(usuarioRepository).save(usuario);
    }
}
