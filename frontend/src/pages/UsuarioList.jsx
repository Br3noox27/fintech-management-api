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
      {carregando && <p style={s.info}>Carregando...</p>}
      {erro && <div style={t.erro}>{erro}</div>}

      {!carregando && usuarios.length === 0 && (
        <p style={s.vazio}>Nenhum usuário cadastrado.</p>
      )}

      {!carregando && usuarios.length > 0 && (
        <div style={s.tableWrap}>
          <table style={t.table}>
            <thead>
              <tr>
                <th style={t.th}>ID</th>
                <th style={t.th}>Nome</th>
                <th style={t.th}>Email</th>
                <th style={t.th}>Cadastro</th>
                <th style={t.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id} style={s.tr}>
                  <td style={{ ...t.td, ...s.idCell }}>#{u.id}</td>
                  <td style={t.td}>{u.nome}</td>
                  <td style={{ ...t.td, color: '#8b92a9' }}>{u.email}</td>
                  <td style={{ ...t.td, color: '#8b92a9' }}>
                    {u.dataCadastro ? new Date(u.dataCadastro).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td style={t.td}>
                    <button style={t.btnEdit} onClick={() => navigate(`/usuarios/editar/${u.id}`)}>
                      Editar
                    </button>
                    <button style={t.btnDanger} onClick={() => handleDeletar(u.id, u.nome)}>
                      Deletar
                    </button>
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
  tableWrap: {
    backgroundColor: '#1a1836',
    border: '1px solid #2d2b5a',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tr: {},
  idCell: { color: '#8b92a9', fontFamily: 'monospace', fontSize: '0.85rem' },
  info: { color: '#8b92a9' },
  vazio: { color: '#8b92a9', textAlign: 'center', padding: '48px' },
};

export default UsuarioList;
