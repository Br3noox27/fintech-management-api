import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import contaService from '../services/contaService';
import transacaoService from '../services/transacaoService';

function Extrato() {
  const [contas, setContas] = useState([]);
  const [contaId, setContaId] = useState('');
  const [transacoes, setTransacoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    contaService.listar().then(r => {
      setContas(r.data);
      if (r.data.length > 0) setContaId(String(r.data[0].id));
    });
  }, []);

  useEffect(() => {
    if (!contaId) return;
    setCarregando(true);
    transacaoService.listarPorConta(contaId)
      .then(r => setTransacoes(r.data.sort((a, b) => new Date(b.dataTransacao) - new Date(a.dataTransacao))))
      .catch(() => setTransacoes([]))
      .finally(() => setCarregando(false));
  }, [contaId]);

  const conta = contas.find(c => c.id === parseInt(contaId));
  const totalReceitas = transacoes.filter(t => t.tipo === 'RECEITA').reduce((s, t) => s + Number(t.valor), 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'DESPESA').reduce((s, t) => s + Number(t.valor), 0);

  const transacoesFiltradas = filtroTipo === 'TODOS'
    ? transacoes
    : transacoes.filter(t => t.tipo === filtroTipo);

  function formatData(dt) {
    return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Layout titulo="Extrato">
      <div style={s.wrap}>

        {contas.length > 1 && (
          <div style={s.filtroRow}>
            <label style={s.filtroLabel}>Conta</label>
            <select value={contaId} onChange={e => setContaId(e.target.value)} style={s.select}>
              {contas.map(c => (
                <option key={c.id} value={c.id}>{c.nome} — {c.tipo}</option>
              ))}
            </select>
          </div>
        )}

        {conta && (
          <div style={s.resumo}>
            <div style={s.resumoItem}>
              <span style={s.resumoLabel}>Saldo atual</span>
              <span style={{ ...s.resumoValor, color: Number(conta.saldo) >= 0 ? '#059669' : '#EF4444' }}>
                R$ {Number(conta.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div style={s.resumoDivider} />
            <div style={s.resumoItem}>
              <span style={s.resumoLabel}>Entradas</span>
              <span style={{ ...s.resumoValor, color: '#059669' }}>
                + R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div style={s.resumoDivider} />
            <div style={s.resumoItem}>
              <span style={s.resumoLabel}>Saídas</span>
              <span style={{ ...s.resumoValor, color: '#EF4444' }}>
                - R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        <div style={s.filtroTipoWrap}>
          {['TODOS', 'RECEITA', 'DESPESA'].map(f => (
            <button
              key={f}
              onClick={() => setFiltroTipo(f)}
              style={{
                ...s.filtroBtn,
                ...(filtroTipo === f
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

        <div style={s.lista}>
          {carregando && <p style={s.vazio}>Carregando...</p>}
          {!carregando && transacoesFiltradas.length === 0 && (
            <p style={s.vazio}>Nenhuma transação encontrada.</p>
          )}
          {transacoesFiltradas.map((tx, i) => (
            <div key={tx.id} style={{ ...s.item, borderTop: i === 0 ? 'none' : '1px solid #F1F5F9' }}>
              <div style={{ ...s.itemIcon, backgroundColor: tx.tipo === 'RECEITA' ? 'rgba(5,150,105,0.1)' : 'rgba(239,68,68,0.08)' }}>
                <span style={{ color: tx.tipo === 'RECEITA' ? '#059669' : '#EF4444', fontSize: '0.9rem', fontWeight: '700' }}>
                  {tx.tipo === 'RECEITA' ? '↑' : '↓'}
                </span>
              </div>
              <div style={s.itemInfo}>
                <span style={s.itemDesc}>{tx.descricao}</span>
                <span style={s.itemMeta}>{tx.categoria} · {formatData(tx.dataTransacao)}</span>
              </div>
              <span style={{ ...s.itemValor, color: tx.tipo === 'RECEITA' ? '#059669' : '#EF4444' }}>
                {tx.tipo === 'RECEITA' ? '+' : '-'} R$ {Number(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const s = {
  wrap: { maxWidth: '680px', margin: '0 auto' },
  filtroRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  filtroLabel: { color: '#64748B', fontSize: '0.82rem', fontWeight: '600', whiteSpace: 'nowrap' },
  select: {
    flex: 1,
    padding: '9px 12px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    color: '#1A1D23',
    fontSize: '0.88rem',
    outline: 'none',
  },
  resumo: {
    display: 'flex',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '16px',
  },
  resumoItem: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' },
  resumoDivider: { width: '1px', backgroundColor: '#E2E8F0', margin: '0 8px' },
  resumoLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' },
  resumoValor: { fontSize: '1.05rem', fontWeight: '700' },
  filtroTipoWrap: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  filtroBtn: {
    padding: '8px 16px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    color: '#64748B',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  filtroBtnAtivo: {
    backgroundColor: '#EDE9FE',
    border: '1px solid #6D28D9',
    color: '#6D28D9',
  },
  filtroBtnReceita: {
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid rgba(5,150,105,0.3)',
    color: '#059669',
  },
  filtroBtnDespesa: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#EF4444',
  },
  lista: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
  },
  itemIcon: {
    width: '34px', height: '34px',
    borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  itemDesc: { color: '#1A1D23', fontSize: '0.88rem', fontWeight: '500' },
  itemMeta: { color: '#94A3B8', fontSize: '0.75rem' },
  itemValor: { fontSize: '0.9rem', fontWeight: '700', flexShrink: 0 },
  vazio: { color: '#94A3B8', fontSize: '0.88rem', padding: '24px', textAlign: 'center' },
};

export default Extrato;
