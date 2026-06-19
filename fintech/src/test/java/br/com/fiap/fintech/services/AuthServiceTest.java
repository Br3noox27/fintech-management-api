package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.BusinessException;
import br.com.fiap.fintech.exception.UnauthorizedException;
import br.com.fiap.fintech.model.TokenSessao;
import br.com.fiap.fintech.model.Usuario;
import br.com.fiap.fintech.repository.TokenSessaoRepository;
import br.com.fiap.fintech.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private TokenSessaoRepository tokenSessaoRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void deveLancarExcecaoQuandoCredenciaisInvalidas() {
        when(usuarioRepository.findByEmailAndSenha("a@a.com", "errada")).thenReturn(Optional.empty());

        assertThrows(BusinessException.class, () -> authService.login("a@a.com", "errada"));
    }

    @Test
    void deveLancarExcecaoQuandoTokenExpirado() {
        TokenSessao sessao = new TokenSessao();
        sessao.setToken("abc123");
        sessao.setExpiraEm(LocalDateTime.now().minusHours(1));

        when(tokenSessaoRepository.findByToken("abc123")).thenReturn(Optional.of(sessao));

        assertThrows(UnauthorizedException.class, () -> authService.validar("abc123"));
    }

    @Test
    void deveValidarTokenValido() {
        TokenSessao sessao = new TokenSessao();
        sessao.setToken("abc123");
        sessao.setExpiraEm(LocalDateTime.now().plusHours(7));

        when(tokenSessaoRepository.findByToken("abc123")).thenReturn(Optional.of(sessao));

        TokenSessao resultado = authService.validar("abc123");

        assertNotNull(resultado);
        assertEquals("abc123", resultado.getToken());
    }
}
