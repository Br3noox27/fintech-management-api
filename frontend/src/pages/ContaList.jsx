import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import contaService from '../services/contaService';
import { s as t } from '../styles/theme';

function ContaList() {
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      setCarregando(true);
      const res = await contaService.listar();
      setContas(res.data);
    } catch {
      setErro('Erro ao carregar contas');
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar(id, nome) {
    if (!window.confirm(`Deletar a conta "${nome}"?`)) return;
    try {
      await contaService.deletar(id);
      setContas(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('Erro ao deletar conta');
    }
  }

  function fmt(val) {
    return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const totalSaldo = contas.reduce((s, c) => s + Number(c.saldo), 0);
  const correntes = contas.filter(c => c.tipo === 'CORRENTE').length;
  const poupancas = contas.filter(c => c.tipo === 'POUPANCA').length;
  const investimentos = contas.filter(c => c.tipo === 'INVESTIMENTO').length;

  const action = (
    <button style={t.btnPrimary} onClick={() => navigate('/contas/nova')}>
      + Nova Conta
    </button>
  );

  const tipoConfig = {
    CORRENTE:     { color: '#0284C7', bg: 'rgba(2,132,199,0.08)' },
    POUPANCA:     { color: '#059669', bg: 'rgba(5,150,105,0.08)' },
    INVESTIMENTO: { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  };

  return (
    <Layout titulo="Contas" action={action}>
      {erro && <div style={t.erro}>{erro}</div>}

      <div style={s.resumoGrid}>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Saldo total</p>
          <p style={{ ...s.resumoValor, color: '#059669' }}>{fmt(totalSaldo)}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Total de contas</p>
          <p style={s.resumoValor}>{contas.length}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Correntes</p>
          <p style={{ ...s.resumoValor, color: '#0284C7' }}>{correntes}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Poupança</p>
          <p style={{ ...s.resumoValor, color: '#059669' }}>{poupancas}</p>
        </div>
        <div style={s.resumoCard}>
          <p style={s.resumoLabel}>Investimento</p>
          <p style={{ ...s.resumoValor, color: '#7C3AED' }}>{investimentos}</p>
        </div>
      </div>

      {carregando && <p style={s.info}>Carregando...</p>}

      {!carregando && contas.length === 0 && (
        <div style={s.vazio}>
          <p style={s.vazioDesc}>Nenhuma conta cadastrada ainda.</p>
          <button style={t.btnPrimary} onClick={() => navigate('/contas/nova')}>Criar primeira conta</button>
        </div>
      )}

      {!carregando && contas.length > 0 && (
        <div style={s.tableWrap}>
          <table style={t.table}>
            <thead>
              <tr>
                <th style={t.th}>ID</th>
                <th style={t.th}>Nome</th>
                <th style={t.th}>Tipo</th>
                <th style={t.th}>Saldo</th>
                <th style={t.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contas.map(conta => {
                const cor = tipoConfig[conta.tipo] || { color: '#64748B', bg: 'rgba(100,116,139,0.08)' };
                return (
                  <tr key={conta.id}>
                    <td style={{ ...t.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.85rem' }}>#{conta.id}</td>
                    <td style={{ ...t.td, fontWeight: '600' }}>{conta.nome}</td>
                    <td style={t.td}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', color: cor.color, backgroundColor: cor.bg }}>
                        {conta.tipo}
                      </span>
                    </td>
                    <td style={{ ...t.td, color: '#059669', fontWeight: '700' }}>{fmt(conta.saldo)}</td>
                    <td style={t.td}>
                      <button style={t.btnEdit} onClick={() => navigate(`/contas/editar/${conta.id}`)}>Editar</button>
                      <button style={t.btnDanger} onClick={() => handleDeletar(conta.id, conta.nome)}>Deletar</button>
                    </td>
                  </tr>
                );
              })}
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
    gridTemplateColumns: 'repeat(5, 1fr)',
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
  info: { color: '#94A3B8' },
  vazio: { textAlign: 'center', padding: '64px 24px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' },
  vazioDesc: { color: '#94A3B8', marginBottom: '20px', fontSize: '0.95rem' },
};

export default ContaList;
