import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import usuarioService from '../services/usuarioService';
import { s as t } from '../styles/theme';

function UsuarioForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (editando) carregar();
  }, [id]);

  async function carregar() {
    try {
      const res = await usuarioService.buscarPorId(id);
      setNome(res.data.nome);
      setEmail(res.data.email);
    } catch {
      setErro('Erro ao carregar usuário');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      if (editando) {
        await usuarioService.atualizar(id, { nome, email, senha });
      } else {
        await usuarioService.criar({ nome, email, senha });
      }
      navigate(editando ? '/usuarios' : '/login');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setSalvando(false);
    }
  }

  const form = (
    <div style={s.formWrap}>
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={t.campo}>
          <label style={t.label}>Nome</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={t.input} placeholder="Seu nome completo" />
        </div>
        <div style={t.campo}>
          <label style={t.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={t.input} placeholder="seu@email.com" />
        </div>
        <div style={t.campo}>
          <label style={t.label}>
            Senha {editando && <span style={s.hint}>(deixe em branco para manter)</span>}
          </label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required={!editando} minLength={6} style={t.input} placeholder="••••••" />
        </div>

        {erro && <div style={t.erro}>{erro}</div>}

        <div style={s.botoes}>
          <button type="button" onClick={() => navigate(editando ? '/usuarios' : '/login')} style={t.btnOutline}>
            Cancelar
          </button>
          <button type="submit" disabled={salvando} style={t.btnPrimary}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );

  if (!editando) {
    return (
      <div style={s.standalone}>
        <div style={s.standaloneCard}>
          <div style={s.standaloneHeader}>
            <div style={s.logoBox}><span style={s.logoLetter}>F</span></div>
            <h1 style={s.standaloneTitle}>Criar conta</h1>
            <p style={s.standaloneSub}>Preencha os dados para se cadastrar</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={t.campo}>
              <label style={t.label}>Nome</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={t.input} placeholder="Seu nome completo" />
            </div>
            <div style={t.campo}>
              <label style={t.label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={t.input} placeholder="seu@email.com" />
            </div>
            <div style={t.campo}>
              <label style={t.label}>Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required minLength={6} style={t.input} placeholder="Mínimo 6 caracteres" />
            </div>
            {erro && <div style={t.erro}>{erro}</div>}
            <button type="submit" disabled={salvando} style={{ ...t.btnPrimary, width: '100%' }}>
              {salvando ? 'Criando...' : 'Criar conta'}
            </button>
          </form>
          <p style={s.loginLink}>
            Já tem conta? <a href="/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Entrar</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout titulo="Editar Usuário">
      {form}
    </Layout>
  );
}

const s = {
  formWrap: { maxWidth: '520px' },
  form: {},
  hint: { color: '#4a4a7a', fontWeight: '400', textTransform: 'none', letterSpacing: 0 },
  botoes: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  standalone: {
    minHeight: '100vh',
    backgroundColor: '#0d0c1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  standaloneCard: {
    backgroundColor: '#1a1836',
    border: '1px solid #2d2b5a',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
  },
  standaloneHeader: { marginBottom: '28px' },
  logoBox: {
    width: '44px',
    height: '44px',
    backgroundColor: '#7c3aed',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  logoLetter: { color: '#fff', fontSize: '1.3rem', fontWeight: '800' },
  standaloneTitle: { color: '#e2e8f0', fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' },
  standaloneSub: { color: '#8b92a9', fontSize: '0.88rem' },
  loginLink: { textAlign: 'center', marginTop: '20px', color: '#8b92a9', fontSize: '0.88rem' },
};

export default UsuarioForm;
