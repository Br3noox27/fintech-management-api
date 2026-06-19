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

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const totalLimite = cartoes.reduce((s, c) => s + Number(c.limite), 0);
  const creditos = cartoes.filter(c => c.tipo === 'CREDITO').length;
  const debitos = cartoes.filter(c => c.tipo === 'DEBITO').length;

  const action = (
    <button style={t.btnPrimary} onClick={() => navigate('/cartoes/novo')}>
      + Novo Cartão
    </button>
  );

  return (
    <Layout titulo="Cartões" action={action}>
      {erro && <div style={t.erro}>{erro}</div>}

      <div style={s.resumoGrid}>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Total de cartões</p>
          <p style={s.resumoValor}>{cartoes.length}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Limite total</p>
          <p style={{ ...s.resumoValor, color: '#7C3AED' }}>{fmt(totalLimite)}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Crédito</p>
          <p style={{ ...s.resumoValor, color: '#6D28D9' }}>{creditos}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Débito</p>
          <p style={{ ...s.resumoValor, color: '#D97706' }}>{debitos}</p>
        </div>
      </div>

      {carregando && <p style={s.info}>Carregando...</p>}

      {!carregando && cartoes.length === 0 && (
        <div style={s.vazio}>
          <p style={s.vazioDesc}>Nenhum cartão cadastrado ainda.</p>
          <button style={t.btnPrimary} onClick={() => navigate('/cartoes/novo')}>Adicionar cartão</button>
        </div>
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
                  <td style={{ ...t.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.85rem' }}>#{c.id}</td>
                  <td style={{ ...t.td, fontWeight: '700' }}>{c.bandeira}</td>
                  <td style={{ ...t.td, fontFamily: 'monospace', letterSpacing: '0.08em', color: '#64748B' }}>
                    •••• •••• •••• {c.numeroFinal}
                  </td>
                  <td style={t.td}>
                    <span style={c.tipo === 'CREDITO' ? s.credito : s.debito}>{c.tipo}</span>
                  </td>
                  <td style={{ ...t.td, color: '#7C3AED', fontWeight: '700' }}>{fmt(c.limite)}</td>
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
  resumoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '24px',
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
  credito: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', color: '#6D28D9', backgroundColor: 'rgba(109,40,217,0.08)' },
  debito:  { padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', color: '#D97706', backgroundColor: 'rgba(217,119,6,0.08)' },
  info: { color: '#94A3B8' },
  vazio: { textAlign: 'center', padding: '64px 24px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' },
  vazioDesc: { color: '#94A3B8', marginBottom: '20px', fontSize: '0.95rem' },
};

export default CartaoList;
