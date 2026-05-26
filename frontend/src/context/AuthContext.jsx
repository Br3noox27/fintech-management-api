import { createContext, useContext, useState, useEffect } from 'react';
import usuarioService from '../services/usuarioService';

// Cria o Context
const AuthContext = createContext();

// Provider — componente que envolve a aplicação e disponibiliza os dados
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao iniciar a aplicação, tenta recuperar usuário do localStorage
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  // Faz login chamando a API e salvando o usuário
  async function login(email, senha) {
    const resposta = await usuarioService.login(email, senha);
    const dadosUsuario = resposta.data;
    setUsuario(dadosUsuario);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    return dadosUsuario;
  }

  // Faz logout limpando estado e storage
  function logout() {
    setUsuario(null);
    localStorage.removeItem('usuario');
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado pra usar o context fácil em qualquer componente
export function useAuth() {
  return useContext(AuthContext);
}