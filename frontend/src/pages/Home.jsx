import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import contaService from '../services/contaService';

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

  useEffect(() => {
    contaService.listar().then(r => {
      const lista = r.data;
      if (lista.length > 0) setConta(lista[0]);
      const total = lista.reduce((s, c) => s + Number(c.saldo), 0);
      setSaldoTotal(total);
    });
  }, []);

  return (
    <Layout>
      {/* Header do banco */}
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

      {/* Grid de ações — igual Itaú */}
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
  greeting: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.95rem',
    fontWeight: '500',
    marginBottom: '2px',
  },
  agencia: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.78rem',
  },
  saldoRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  saldoLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.78rem',
    fontWeight: '500',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  saldoValor: {
    color: '#FFFFFF',
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '-0.04em',
  },
  olhoBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  gridSection: {
    backgroundColor: '#FFFFFF',
    margin: '0 -32px',
    padding: '24px 32px',
    borderBottom: '1px solid #E2E8F0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
  },
  acaoCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 8px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  acaoIcone: {
    width: '44px', height: '44px',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  acaoLabel: {
    color: '#1A1D23',
    fontSize: '0.75rem',
    fontWeight: '600',
    textAlign: 'center',
  },
};

export default Home;
