import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import usuarioService from '../services/usuarioService';
import { s as t } from '../styles/theme';

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      setCarregando(true);
      const res = await usuarioService.listar();
      setUsuarios(res.data);
    } catch {
      setErro('Erro ao carregar usuários');
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar(id, nome) {
    if (!window.confirm(`Deletar o usuário "${nome}"?`)) return;
    try {
      await usuarioService.deletar(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch {
      alert('Erro ao deletar usuário');
    }
  }

  const action = (
    <button style={t.btnPrimary} onClick={() => navigate('/usuarios/novo')}>
      + Novo Usuário
    </button>
  );

  return (
    <Layout titulo="Usuários" action={action}>
      {erro && <div style={t.erro}>{erro}</div>}

      <div style={s.resumoGrid}>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Total de usuários</p>
          <p style={s.resumoValor}>{usuarios.length}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Cadastrados hoje</p>
          <p style={{ ...s.resumoValor, color: '#6D28D9' }}>
            {usuarios.filter(u => {
              if (!u.dataCadastro) return false;
              const d = new Date(u.dataCadastro);
              const hoje = new Date();
              return d.toDateString() === hoje.toDateString();
            }).length}
          </p>
        </div>
      </div>

      {carregando && <p style={s.info}>Carregando...</p>}

      {!carregando && usuarios.length === 0 && (
        <div style={s.vazio}>
          <p style={s.vazioDesc}>Nenhum usuário cadastrado.</p>
          <button style={t.btnPrimary} onClick={() => navigate('/usuarios/novo')}>Criar usuário</button>
        </div>
      )}

      {!carregando && usuarios.length > 0 && (
        <div style={s.tableWrap}>
          <table style={t.table}>
            <thead>
              <tr>
                <th style={t.th}>ID</th>
                <th style={t.th}>Avatar</th>
                <th style={t.th}>Nome</th>
                <th style={t.th}>Email</th>
                <th style={t.th}>Cadastro</th>
                <th style={t.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td style={{ ...t.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.85rem' }}>#{u.id}</td>
                  <td style={t.td}>
                    <div style={s.avatar}>{u.nome?.[0]?.toUpperCase()}</div>
                  </td>
                  <td style={{ ...t.td, fontWeight: '600' }}>{u.nome}</td>
                  <td style={{ ...t.td, color: '#64748B' }}>{u.email}</td>
                  <td style={{ ...t.td, color: '#94A3B8' }}>
                    {u.dataCadastro ? new Date(u.dataCadastro).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td style={t.td}>
                    <button style={t.btnEdit} onClick={() => navigate(`/usuarios/editar/${u.id}`)}>Editar</button>
                    <button style={t.btnDanger} onClick={() => handleDeletar(u.id, u.nome)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

const s = {
  resumoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
    maxWidth: '400px',
  },
  resumoCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  resumoLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' },
  resumoValor: { color: '#1A1D23', fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.03em' },
  tableWrap: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' },
  avatar: {
    width: '30px', height: '30px',
    backgroundColor: '#6D28D9',
    borderRadius: '7px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: '700', fontSize: '0.82rem',
  },
  info: { color: '#94A3B8' },
  vazio: { textAlign: 'center', padding: '64px 24px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' },
  vazioDesc: { color: '#94A3B8', marginBottom: '20px', fontSize: '0.95rem' },
};

export default UsuarioList;
