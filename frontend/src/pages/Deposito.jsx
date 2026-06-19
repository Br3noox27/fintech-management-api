import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import contaService from '../services/contaService';
import { s as t } from '../styles/theme';

function Deposito() {
  const navigate = useNavigate();
  const [conta, setConta] = useState(null);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('RECEITA');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    contaService.listar().then(r => {
      if (r.data.length > 0) setConta(r.data[0]);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const res = await contaService.depositar(conta.id, { valor: parseFloat(valor), descricao, tipo });
      setConta(res.data);
      setSucesso(true);
      setValor('');
      setDescricao('');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao realizar lançamento');
    } finally {
      setEnviando(false);
    }
  }

  if (!conta) return <Layout titulo="Lançamento"><p style={{ color: '#94A3B8' }}>Nenhuma conta encontrada.</p></Layout>;

  return (
    <Layout titulo="Lançamento">
      <div style={s.wrap}>
        {sucesso && <div style={s.sucesso}>Lançamento realizado com sucesso!</div>}

        <div style={s.saldoCard}>
          <p style={s.saldoLabel}>Saldo disponível</p>
          <p style={s.saldoValor}>
            R$ {Number(conta.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div style={s.card}>
          <form onSubmit={handleSubmit}>
            <div style={{ ...t.campo, marginBottom: '20px' }}>
              <label style={t.label}>Tipo de lançamento</label>
              <div style={s.toggleWrap}>
                <button
                  type="button"
                  onClick={() => setTipo('RECEITA')}
                  style={{ ...s.toggleBtn, ...(tipo === 'RECEITA' ? s.toggleReceita : {}) }}
                >
                  ↑ Receita
                </button>
                <button
                  type="button"
                  onClick={() => setTipo('DESPESA')}
                  style={{ ...s.toggleBtn, ...(tipo === 'DESPESA' ? s.toggleDespesa : {}) }}
                >
                  ↓ Despesa
                </button>
              </div>
            </div>

            <div style={t.campo}>
              <label style={t.label}>Valor</label>
              <div style={s.valorWrap}>
                <span style={s.cifrao}>R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={valor}
                  onChange={e => setValor(e.target.value)}
                  required
                  style={s.valorInput}
                  placeholder="0,00"
                  autoFocus
                />
              </div>
            </div>

            <div style={t.campo}>
              <label style={t.label}>Descrição (opcional)</label>
              <input
                type="text"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                style={t.input}
                placeholder={tipo === 'RECEITA' ? 'Ex: salário, freelance...' : 'Ex: aluguel, conta de luz...'}
              />
            </div>

            {erro && <div style={t.erro}>{erro}</div>}

            <button type="submit" disabled={enviando} style={{ ...t.btnPrimary, width: '100%', marginTop: '8px', backgroundColor: tipo === 'DESPESA' ? '#EF4444' : '#6D28D9' }}>
              {enviando ? 'Lançando...' : `Confirmar ${tipo === 'RECEITA' ? 'receita' : 'despesa'}`}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

const s = {
  wrap: { maxWidth: '460px', margin: '0 auto' },
  saldoCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '20px 24px',
    marginBottom: '12px',
  },
  saldoLabel: { color: '#94A3B8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' },
  saldoValor: { color: '#059669', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.03em' },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
  },
  toggleWrap: {
    display: 'flex',
    gap: '8px',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    color: '#64748B',
    fontWeight: '600',
    fontSize: '0.88rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  toggleReceita: {
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid rgba(5,150,105,0.3)',
    color: '#059669',
  },
  toggleDespesa: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#EF4444',
  },
  valorWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '4px 14px',
  },
  cifrao: { color: '#94A3B8', fontSize: '1.1rem', fontWeight: '600', flexShrink: 0 },
  valorInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#1A1D23',
    fontSize: '1.6rem',
    fontWeight: '700',
    padding: '8px 0',
    width: '100%',
    fontFamily: 'inherit',
  },
  sucesso: {
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid rgba(5,150,105,0.25)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#059669',
    fontWeight: '600',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
};

export default Deposito;
