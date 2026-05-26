import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.message || 'Email ou senha inválidos');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={s.root}>
      <div style={s.left}>
        <div style={s.brandIcon}>F</div>
        <h1 style={s.brandName}>Fintech</h1>
        <p style={s.brandSub}>Banco Digital</p>
        <p style={s.brandDesc}>Sua conta digital completa,<br />simples e segura.</p>
      </div>

      <div style={s.right}>
        <div style={s.box}>
          <h2 style={s.titulo}>Entrar</h2>
          <p style={s.subtitulo}>Acesse sua conta</p>

          <form onSubmit={handleSubmit} style={{ marginTop: '28px' }}>
            <div style={s.campo}>
              <label style={s.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={s.input}
                placeholder="seu@email.com"
              />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                style={s.input}
                placeholder="••••••••"
              />
            </div>

            {erro && <div style={s.erro}>{erro}</div>}

            <button type="submit" disabled={carregando} style={s.btn}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p style={s.cadastro}>
            Não tem conta?{' '}
            <a href="/usuarios/novo" style={s.link}>Criar conta</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: '100vh',
    display: 'flex',
  },
  left: {
    width: '420px',
    backgroundColor: '#6D28D9',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 52px',
    flexShrink: 0,
  },
  brandIcon: {
    width: '52px', height: '52px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '14px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '900', fontSize: '1.5rem', color: '#fff',
    marginBottom: '20px',
  },
  brandName: {
    color: '#fff',
    fontSize: '2.2rem',
    fontWeight: '900',
    letterSpacing: '-0.04em',
    marginBottom: '4px',
  },
  brandSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '32px',
  },
  brandDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '1.1rem',
    lineHeight: 1.6,
    fontWeight: '400',
  },
  right: {
    flex: 1,
    backgroundColor: '#F2F4F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '380px',
    border: '1px solid #E2E8F0',
  },
  titulo: {
    color: '#1A1D23',
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    marginBottom: '4px',
  },
  subtitulo: {
    color: '#94A3B8',
    fontSize: '0.88rem',
  },
  campo: { marginBottom: '14px' },
  label: {
    display: 'block',
    color: '#64748B',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    color: '#1A1D23',
    fontSize: '0.93rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  erro: {
    color: '#EF4444',
    backgroundColor: 'rgba(239,68,68,0.07)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: '8px',
    padding: '9px 12px',
    fontSize: '0.84rem',
    marginBottom: '12px',
  },
  btn: {
    width: '100%',
    padding: '13px',
    backgroundColor: '#6D28D9',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.93rem',
    marginTop: '6px',
  },
  cadastro: {
    color: '#94A3B8',
    fontSize: '0.84rem',
    marginTop: '20px',
    textAlign: 'center',
  },
  link: {
    color: '#6D28D9',
    fontWeight: '700',
  },
};

export default Login;
