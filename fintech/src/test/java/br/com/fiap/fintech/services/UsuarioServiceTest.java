package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.BusinessException;
import br.com.fiap.fintech.model.Usuario;
import br.com.fiap.fintech.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void deveLancarExcecaoQuandoEmailJaCadastrado() {
        when(usuarioRepository.existsByEmail("teste@fiap.com")).thenReturn(true);

        Usuario usuario = new Usuario();
        usuario.setEmail("teste@fiap.com");

        assertThrows(BusinessException.class, () -> usuarioService.criar(usuario));
    }

    @Test
    void deveCriarUsuarioComSucesso() {
        Usuario usuario = new Usuario();
        usuario.setEmail("novo@fiap.com");

        when(usuarioRepository.existsByEmail("novo@fiap.com")).thenReturn(false);
        when(usuarioRepository.save(usuario)).thenReturn(usuario);

        Usuario resultado = usuarioService.criar(usuario);

        assertNotNull(resultado);
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void deveLancarExcecaoQuandoCredenciaisInvalidas() {
        when(usuarioRepository.findByEmailAndSenha("x@x.com", "errada")).thenReturn(Optional.empty());

        assertThrows(BusinessException.class, () -> usuarioService.autenticar("x@x.com", "errada"));
    }
}
