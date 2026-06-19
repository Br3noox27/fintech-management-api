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

  if (!editando) {
    return (
      <div style={s.standalone}>
        <div style={s.standaloneLeft}>
          <div style={s.brandIcon}>F</div>
          <h1 style={s.brandName}>Fintech</h1>
          <p style={s.brandSub}>Banco Digital</p>
          <p style={s.brandDesc}>Crie sua conta gratuitamente<br />e comece a gerenciar suas finanças.</p>
          <div style={s.features}>
            {['Conta digital gratuita', 'PIX instantâneo', 'Extrato completo', 'Cartões virtuais'].map(f => (
              <div key={f} style={s.featureItem}>
                <span style={s.featureCheck}>✓</span>
                <span style={s.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.standaloneRight}>
          <div style={s.standaloneCard}>
            <h2 style={s.cardTitle}>Criar conta</h2>
            <p style={s.cardSub}>Preencha os dados para se cadastrar</p>
            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <div style={t.campo}>
                <label style={t.label}>Nome completo</label>
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
              <button type="submit" disabled={salvando} style={{ ...t.btnPrimary, width: '100%', padding: '13px' }}>
                {salvando ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
            <p style={s.loginLink}>
              Já tem conta?{' '}
              <a href="/login" style={{ color: '#6D28D9', fontWeight: '700' }}>Entrar</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout titulo="Editar Usuário">
      <div style={s.pageWrap}>
        <div style={s.left}>
          <div style={s.infoCard}>
            <div style={s.avatarGrande}>{nome?.[0]?.toUpperCase() || '?'}</div>
            <p style={s.avatarNome}>{nome || 'Nome do usuário'}</p>
            <p style={s.avatarEmail}>{email || 'email@exemplo.com'}</p>
            <div style={s.dica}>
              <p style={s.dicaLabel}>Dicas de segurança</p>
              <p style={s.dicaText}>• Use uma senha forte com letras e números.</p>
              <p style={s.dicaText}>• Não compartilhe sua senha com ninguém.</p>
              <p style={s.dicaText}>• Deixe a senha em branco para não alterá-la.</p>
            </div>
          </div>
        </div>

        <div style={s.right}>
          <div style={s.card}>
            <form onSubmit={handleSubmit}>
              <div style={t.campo}>
                <label style={t.label}>Nome completo</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={t.input} placeholder="Seu nome completo" />
              </div>
              <div style={t.campo}>
                <label style={t.label}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={t.input} placeholder="seu@email.com" />
              </div>
              <div style={t.campo}>
                <label style={t.label}>
                  Nova senha <span style={s.hint}>(deixe em branco para manter a atual)</span>
                </label>
                <input type="password" value={senha} onChange={e => setSenha(e.target.value)} minLength={6} style={t.input} placeholder="••••••" />
              </div>

              {erro && <div style={t.erro}>{erro}</div>}

              <div style={s.botoes}>
                <button type="button" onClick={() => navigate('/usuarios')} style={t.btnOutline}>Cancelar</button>
                <button type="submit" disabled={salvando} style={t.btnPrimary}>
                  {salvando ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const s = {
  standalone: { minHeight: '100vh', display: 'flex' },
  standaloneLeft: {
    width: '420px', backgroundColor: '#6D28D9', flexShrink: 0,
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '60px 52px',
  },
  brandIcon: {
    width: '52px', height: '52px', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '900', fontSize: '1.5rem', color: '#fff', marginBottom: '20px',
  },
  brandName: { color: '#fff', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '4px' },
  brandSub: { color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '24px' },
  brandDesc: { color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' },
  features: { display: 'flex', flexDirection: 'column', gap: '10px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  featureCheck: { color: '#A7F3D0', fontWeight: '700', fontSize: '0.9rem' },
  featureText: { color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' },
  standaloneRight: { flex: 1, backgroundColor: '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  standaloneCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '40px 36px', width: '100%', maxWidth: '380px', border: '1px solid #E2E8F0' },
  cardTitle: { color: '#1A1D23', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '4px' },
  cardSub: { color: '#94A3B8', fontSize: '0.88rem' },
  loginLink: { textAlign: 'center', marginTop: '20px', color: '#94A3B8', fontSize: '0.84rem' },
  pageWrap: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  left: { width: '260px', flexShrink: 0 },
  right: { flex: 1, maxWidth: '520px' },
  infoCard: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', textAlign: 'center' },
  avatarGrande: {
    width: '64px', height: '64px', backgroundColor: '#6D28D9', borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: '800', fontSize: '1.5rem', margin: '0 auto 12px',
  },
  avatarNome: { color: '#1A1D23', fontWeight: '700', fontSize: '1rem', marginBottom: '2px' },
  avatarEmail: { color: '#94A3B8', fontSize: '0.82rem', marginBottom: '20px' },
  dica: { textAlign: 'left', borderTop: '1px solid #F1F5F9', paddingTop: '16px' },
  dicaLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
  dicaText: { color: '#64748B', fontSize: '0.78rem', marginBottom: '4px', lineHeight: 1.5 },
  card: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '28px' },
  hint: { color: '#94A3B8', fontWeight: '400', textTransform: 'none', letterSpacing: 0, fontSize: '0.72rem' },
  botoes: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
};

export default UsuarioForm;
