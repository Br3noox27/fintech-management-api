import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import transacaoService from '../services/transacaoService';
import { s as t } from '../styles/theme';

function TransacaoList() {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      setCarregando(true);
      const res = await transacaoService.listar();
      setTransacoes(res.data);
    } catch {
      setErro('Erro ao carregar transações');
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar(id, desc) {
    if (!window.confirm(`Deletar "${desc}"?`)) return;
    try {
      await transacaoService.deletar(id);
      setTransacoes(prev => prev.filter(t => t.id !== id));
    } catch {
      alert('Erro ao deletar transação');
    }
  }

  function fmtVal(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function fmtData(d) {
    return d ? new Date(d).toLocaleDateString('pt-BR') : '—';
  }

  const action = (
    <button style={t.btnPrimary} onClick={() => navigate('/transacoes/nova')}>
      + Nova Transação
    </button>
  );

  return (
    <Layout titulo="Transações" action={action}>
      {carregando && <p style={s.info}>Carregando...</p>}
      {erro && <div style={t.erro}>{erro}</div>}

      {!carregando && transacoes.length === 0 && (
        <p style={s.vazio}>Nenhuma transação encontrada.</p>
      )}

      {!carregando && transacoes.length > 0 && (
        <div style={s.tableWrap}>
          <table style={t.table}>
            <thead>
              <tr>
                <th style={t.th}>ID</th>
                <th style={t.th}>Descrição</th>
                <th style={t.th}>Tipo</th>
                <th style={t.th}>Categoria</th>
                <th style={t.th}>Valor</th>
                <th style={t.th}>Data</th>
                <th style={t.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map(tr => (
                <tr key={tr.id}>
                  <td style={{ ...t.td, ...s.idCell }}>#{tr.id}</td>
                  <td style={t.td}>{tr.descricao}</td>
                  <td style={t.td}>
                    <span style={tr.tipo === 'RECEITA' ? s.receita : s.despesa}>
                      {tr.tipo === 'RECEITA' ? '↑' : '↓'} {tr.tipo}
                    </span>
                  </td>
                  <td style={{ ...t.td, color: '#8b92a9' }}>{tr.categoria}</td>
                  <td style={{ ...t.td, fontWeight: '600', color: tr.tipo === 'RECEITA' ? '#10b981' : '#ef4444' }}>
                    {fmtVal(tr.valor)}
                  </td>
                  <td style={{ ...t.td, color: '#8b92a9' }}>{fmtData(tr.dataTransacao)}</td>
                  <td style={t.td}>
                    <button style={t.btnEdit} onClick={() => navigate(`/transacoes/editar/${tr.id}`)}>Editar</button>
                    <button style={t.btnDanger} onClick={() => handleDeletar(tr.id, tr.descricao)}>Deletar</button>
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
  receita: {
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600',
    color: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)',
  },
  despesa: {
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600',
    color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.12)',
  },
  info: { color: '#8b92a9' },
  vazio: { color: '#8b92a9', textAlign: 'center', padding: '48px' },
};

export default TransacaoList;
