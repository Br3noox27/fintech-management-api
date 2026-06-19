import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import transacaoService from '../services/transacaoService';
import { s as t } from '../styles/theme';

function TransacaoList() {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('TODOS');
  const navigate = useNavigate();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      setCarregando(true);
      const res = await transacaoService.listar();
      setTransacoes(res.data.sort((a, b) => new Date(b.dataTransacao) - new Date(a.dataTransacao)));
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

  const totalReceitas = transacoes.filter(t => t.tipo === 'RECEITA').reduce((s, t) => s + Number(t.valor), 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'DESPESA').reduce((s, t) => s + Number(t.valor), 0);
  const saldo = totalReceitas - totalDespesas;

  const visiveis = filtro === 'TODOS' ? transacoes : transacoes.filter(t => t.tipo === filtro);

  const action = (
    <button style={t.btnPrimary} onClick={() => navigate('/transacoes/nova')}>
      + Nova Transação
    </button>
  );

  return (
    <Layout titulo="Transações" action={action}>
      {erro && <div style={t.erro}>{erro}</div>}

      <div style={s.resumoGrid}>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Total de transações</p>
          <p style={s.resumoValor}>{transacoes.length}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Total receitas</p>
          <p style={{ ...s.resumoValor, color: '#059669' }}>+ {fmtVal(totalReceitas)}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Total despesas</p>
          <p style={{ ...s.resumoValor, color: '#EF4444' }}>- {fmtVal(totalDespesas)}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Saldo líquido</p>
          <p style={{ ...s.resumoValor, color: saldo >= 0 ? '#059669' : '#EF4444' }}>{fmtVal(saldo)}</p>
        </div>
      </div>

      <div style={s.filtroWrap}>
        {['TODOS', 'RECEITA', 'DESPESA'].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              ...s.filtroBtn,
              ...(filtro === f
                ? f === 'RECEITA' ? s.filtroBtnReceita
                : f === 'DESPESA' ? s.filtroBtnDespesa
                : s.filtroBtnAtivo
                : {})
            }}
          >
            {f === 'TODOS' ? 'Todos' : f === 'RECEITA' ? '↑ Receitas' : '↓ Despesas'}
          </button>
        ))}
      </div>

      {carregando && <p style={s.info}>Carregando...</p>}

      {!carregando && visiveis.length === 0 && (
        <div style={s.vazio}>
          <p style={s.vazioDesc}>Nenhuma transação encontrada.</p>
          <button style={t.btnPrimary} onClick={() => navigate('/transacoes/nova')}>Criar transação</button>
        </div>
      )}

      {!carregando && visiveis.length > 0 && (
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
              {visiveis.map(tr => (
                <tr key={tr.id}>
                  <td style={{ ...t.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.85rem' }}>#{tr.id}</td>
                  <td style={{ ...t.td, fontWeight: '500' }}>{tr.descricao}</td>
                  <td style={t.td}>
                    <span style={tr.tipo === 'RECEITA' ? s.receita : s.despesa}>
                      {tr.tipo === 'RECEITA' ? '↑' : '↓'} {tr.tipo}
                    </span>
                  </td>
                  <td style={{ ...t.td, color: '#64748B' }}>{tr.categoria}</td>
                  <td style={{ ...t.td, fontWeight: '700', color: tr.tipo === 'RECEITA' ? '#059669' : '#EF4444' }}>
                    {tr.tipo === 'RECEITA' ? '+' : '-'} {fmtVal(tr.valor)}
                  </td>
                  <td style={{ ...t.td, color: '#94A3B8' }}>{fmtData(tr.dataTransacao)}</td>
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
  resumoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  resumoCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  resumoLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' },
  resumoValor: { color: '#1A1D23', fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em' },
  filtroWrap: { display: 'flex', gap: '8px', marginBottom: '16px' },
  filtroBtn: { padding: '7px 16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  filtroBtnAtivo:   { backgroundColor: '#EDE9FE', border: '1px solid #6D28D9', color: '#6D28D9' },
  filtroBtnReceita: { backgroundColor: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.3)', color: '#059669' },
  filtroBtnDespesa: { backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' },
  tableWrap: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' },
  receita: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', color: '#059669', backgroundColor: 'rgba(5,150,105,0.08)' },
  despesa: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)' },
  info: { color: '#94A3B8' },
  vazio: { textAlign: 'center', padding: '64px 24px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' },
  vazioDesc: { color: '#94A3B8', marginBottom: '20px', fontSize: '0.95rem' },
};

export default TransacaoList;
