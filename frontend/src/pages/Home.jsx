import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import contaService from '../services/contaService';
import transacaoService from '../services/transacaoService';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

const acoes = [
  { label: 'PIX',        path: '/transferir', icon: '⚡', cor: '#6D28D9' },
  { label: 'Depositar',  path: '/depositar',  icon: '↓',  cor: '#059669' },
  { label: 'Extrato',    path: '/extrato',    icon: '≡',  cor: '#0284C7' },
  { label: 'Cartões',    path: '/cartoes',    icon: '▣',  cor: '#D97706' },
  { label: 'Contas',     path: '/contas',     icon: '◈',  cor: '#7C3AED' },
  { label: 'Transações', path: '/transacoes', icon: '↕',  cor: '#0891B2' },
];

function Home() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [saldoTotal, setSaldoTotal] = useState(null);
  const [mostrarSaldo, setMostrarSaldo] = useState(true);
  const [conta, setConta] = useState(null);
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    contaService.listar().then(r => {
      const lista = r.data;
      if (lista.length > 0) {
        setConta(lista[0]);
        const total = lista.reduce((s, c) => s + Number(c.saldo), 0);
        setSaldoTotal(total);

        transacaoService.listarPorConta(lista[0].id)
          .then(tr => {
            const ordenadas = tr.data.sort((a, b) => new Date(b.dataTransacao) - new Date(a.dataTransacao));
            setTransacoes(ordenadas.slice(0, 8));
          })
          .catch(() => {});
      } else {
        setSaldoTotal(0);
      }
    });
  }, []);

  function formatData(dt) {
    return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  return (
    <Layout>
      {/* Header roxo */}
      <div style={s.header}>
        <div style={s.headerTop}>
          <div>
            <p style={s.greeting}>{getGreeting()}, {usuario?.nome?.split(' ')[0]}</p>
            {conta && <p style={s.agencia}>Conta #{conta.id}</p>}
          </div>
        </div>

        <div style={s.saldoRow}>
          <div>
            <p style={s.saldoLabel}>Saldo disponível</p>
            <p style={s.saldoValor}>
              {mostrarSaldo
                ? saldoTotal === null ? '---' : `R$ ${saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : 'R$ ••••••'}
            </p>
          </div>
          <button style={s.olhoBtn} onClick={() => setMostrarSaldo(v => !v)}>
            {mostrarSaldo ? '👁' : '🙈'}
          </button>
        </div>
      </div>

      {/* Grid de ações */}
      <div style={s.gridSection}>
        <div style={s.grid}>
          {acoes.map(a => (
            <button key={a.path} style={s.acaoCard} onClick={() => navigate(a.path)}>
              <div style={{ ...s.acaoIcone, backgroundColor: a.cor + '18', color: a.cor }}>
                {a.icon}
              </div>
              <span style={s.acaoLabel}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Extrato recente */}
      <div style={s.extratoSection}>
        <div style={s.extratoHeader}>
          <h2 style={s.extratoTitulo}>Últimas transações</h2>
          <button style={s.verTodas} onClick={() => navigate('/extrato')}>Ver todas</button>
        </div>

        {transacoes.length === 0 ? (
          <div style={s.vazio}>
            <p style={s.vazioTexto}>Nenhuma transação ainda.</p>
            <button style={s.vazioBtn} onClick={() => navigate('/depositar')}>Fazer primeiro lançamento</button>
          </div>
        ) : (
          <div style={s.lista}>
            {transacoes.map((tx, i) => (
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
        )}
      </div>
    </Layout>
  );
}

const s = {
  header: {
    backgroundColor: '#6D28D9',
    margin: '-28px -32px 0',
    padding: '32px 32px 28px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', fontWeight: '500', marginBottom: '2px' },
  agencia: { color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' },
  saldoRow: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' },
  saldoLabel: { color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  saldoValor: { color: '#FFFFFF', fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.04em' },
  olhoBtn: { background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem' },
  gridSection: { backgroundColor: '#FFFFFF', margin: '0 -32px', padding: '24px 32px', borderBottom: '1px solid #E2E8F0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' },
  acaoCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.15s' },
  acaoIcone: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700' },
  acaoLabel: { color: '#1A1D23', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center' },
  extratoSection: { margin: '24px 0 0' },
  extratoHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
  extratoTitulo: { color: '#1A1D23', fontSize: '1rem', fontWeight: '700' },
  verTodas: { background: 'none', border: 'none', color: '#6D28D9', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  lista: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' },
  item: { display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px' },
  itemIcon: { width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  itemDesc: { color: '#1A1D23', fontSize: '0.88rem', fontWeight: '500' },
  itemMeta: { color: '#94A3B8', fontSize: '0.75rem' },
  itemValor: { fontSize: '0.9rem', fontWeight: '700', flexShrink: 0 },
  vazio: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '40px', textAlign: 'center' },
  vazioTexto: { color: '#94A3B8', fontSize: '0.9rem', marginBottom: '16px' },
  vazioBtn: { padding: '9px 20px', backgroundColor: '#6D28D9', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' },
};

export default Home;
