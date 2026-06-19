package br.com.fiap.fintech.service;

import br.com.fiap.fintech.exception.BusinessException;
import br.com.fiap.fintech.exception.UnauthorizedException;
import br.com.fiap.fintech.model.TokenSessao;
import br.com.fiap.fintech.model.Usuario;
import br.com.fiap.fintech.repository.TokenSessaoRepository;
import br.com.fiap.fintech.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final TokenSessaoRepository tokenSessaoRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository,
                       TokenSessaoRepository tokenSessaoRepository,
                       PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tokenSessaoRepository = tokenSessaoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TokenSessao login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(senha, u.getSenha()))
                .orElseThrow(() -> new BusinessException("Email ou senha inválidos"));

        tokenSessaoRepository.deleteByExpiraEmBefore(LocalDateTime.now());

        TokenSessao sessao = new TokenSessao();
        sessao.setToken(UUID.randomUUID().toString().replace("-", ""));
        sessao.setUsuario(usuario);
        sessao.setCriadoEm(LocalDateTime.now());
        sessao.setExpiraEm(LocalDateTime.now().plusHours(8));
        return tokenSessaoRepository.save(sessao);
    }

    @Transactional
    public void logout(String token) {
        tokenSessaoRepository.deleteByToken(token);
    }

    public TokenSessao validar(String token) {
        return tokenSessaoRepository.findByToken(token)
                .filter(t -> t.getExpiraEm().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new UnauthorizedException("Token inválido ou expirado"));
    }
}
