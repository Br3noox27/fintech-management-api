import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import cartaoService from '../services/cartaoService';
import { s as t } from '../styles/theme';

function CartaoList() {
  const [cartoes, setCartoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      setCarregando(true);
      const res = await cartaoService.listar();
      setCartoes(res.data);
    } catch {
      setErro('Erro ao carregar cartões');
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar(id, num) {
    if (!window.confirm(`Deletar o cartão final ${num}?`)) return;
    try {
      await cartaoService.deletar(id);
      setCartoes(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('Erro ao deletar cartão');
    }
  }

  function fmtLimite(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const action = (
    <button style={t.btnPrimary} onClick={() => navigate('/cartoes/novo')}>
      + Novo Cartão
    </button>
  );

  return (
    <Layout titulo="Cartões" action={action}>
      {carregando && <p style={s.info}>Carregando...</p>}
      {erro && <div style={t.erro}>{erro}</div>}

      {!carregando && cartoes.length === 0 && (
        <p style={s.vazio}>Nenhum cartão cadastrado.</p>
      )}

      {!carregando && cartoes.length > 0 && (
        <div style={s.tableWrap}>
          <table style={t.table}>
            <thead>
              <tr>
                <th style={t.th}>ID</th>
                <th style={t.th}>Bandeira</th>
                <th style={t.th}>Número</th>
                <th style={t.th}>Tipo</th>
                <th style={t.th}>Limite</th>
                <th style={t.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cartoes.map(c => (
                <tr key={c.id}>
                  <td style={{ ...t.td, ...s.idCell }}>#{c.id}</td>
                  <td style={{ ...t.td, fontWeight: '600' }}>{c.bandeira}</td>
                  <td style={{ ...t.td, fontFamily: 'monospace', letterSpacing: '0.1em', color: '#8b92a9' }}>
                    •••• •••• •••• {c.numeroFinal}
                  </td>
                  <td style={t.td}>
                    <span style={c.tipo === 'CREDITO' ? s.credito : s.debito}>
                      {c.tipo}
                    </span>
                  </td>
                  <td style={{ ...t.td, color: '#a78bfa', fontWeight: '600' }}>
                    {fmtLimite(c.limite)}
                  </td>
                  <td style={t.td}>
                    <button style={t.btnEdit} onClick={() => navigate(`/cartoes/editar/${c.id}`)}>Editar</button>
                    <button style={t.btnDanger} onClick={() => handleDeletar(c.id, c.numeroFinal)}>Deletar</button>
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
  tableWrap: { backgroundColor: '#1a1836', border: '1px solid #2d2b5a', borderRadius: '12px', overflow: 'hidden' },
  idCell: { color: '#8b92a9', fontFamily: 'monospace', fontSize: '0.85rem' },
  credito: {
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600',
    color: '#a78bfa', backgroundColor: 'rgba(124,58,237,0.15)',
  },
  debito: {
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600',
    color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)',
  },
  info: { color: '#8b92a9' },
  vazio: { color: '#8b92a9', textAlign: 'center', padding: '48px' },
};

export default CartaoList;
