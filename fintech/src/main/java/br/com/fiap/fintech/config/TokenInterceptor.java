package br.com.fiap.fintech.config;

import br.com.fiap.fintech.exception.UnauthorizedException;
import br.com.fiap.fintech.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class TokenInterceptor implements HandlerInterceptor {

    private final AuthService authService;

    public TokenInterceptor(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Rota pública: cadastro de novo usuário
        if ("POST".equals(request.getMethod()) && "/api/usuarios".equals(request.getRequestURI())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(401);
            response.setContentType("application/json");
            response.getWriter().write("{\"status\":401,\"message\":\"Token não informado\"}");
            return false;
        }

        try {
            authService.validar(authHeader.substring(7));
            return true;
        } catch (UnauthorizedException e) {
            response.setStatus(401);
            response.setContentType("application/json");
            response.getWriter().write("{\"status\":401,\"message\":\"" + e.getMessage() + "\"}");
            return false;
        }
    }
}
