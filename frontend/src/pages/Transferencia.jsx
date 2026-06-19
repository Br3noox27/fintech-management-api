import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import contaService from '../services/contaService';
import { s as t } from '../styles/theme';

function Transferencia() {
  const navigate = useNavigate();
  const [contaOrigem, setContaOrigem] = useState(null);
  const [chave, setChave] = useState('');
  const [contaDestino, setContaDestino] = useState(null);
  const [erroChave, setErroChave] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    contaService.listar().then(r => {
      if (r.data.length > 0) setContaOrigem(r.data[0]);
    });
  }, []);

  async function buscarDestino() {
    if (!chave.trim()) return;
    setBuscando(true);
    setErroChave('');
    setContaDestino(null);
    try {
      const res = await contaService.buscarPorId(chave.trim());
      if (contaOrigem && res.data.id === contaOrigem.id) {
        setErroChave('Esta é a sua própria conta.');
      } else {
        setContaDestino(res.data);
      }
    } catch {
      setErroChave('Conta não encontrada. Verifique a chave.');
    } finally {
      setBuscando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contaDestino || !contaOrigem) return;
    setErro('');
    setEnviando(true);
    try {
      await contaService.transferir({
        contaOrigemId: contaOrigem.id,
        contaDestinoId: contaDestino.id,
        valor: parseFloat(valor),
        descricao,
      });
      setSucesso(true);
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao transferir');
    } finally {
      setEnviando(false);
    }
  }

  if (!contaOrigem) return <Layout titulo="Transferência"><p style={{ color: '#8B8FA8' }}>Nenhuma conta encontrada.</p></Layout>;

  return (
    <Layout titulo="Transferência / PIX">
      <div style={s.wrap}>
        {sucesso && <div style={s.sucesso}>Transferência realizada com sucesso!</div>}

        <div style={s.saldoCard}>
          <p style={s.saldoLabel}>Saldo disponível</p>
          <p style={s.saldoValor}>
            R$ {Number(contaOrigem.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div style={s.card}>
          {/* Chave PIX */}
          {!contaDestino && (
            <>
              <p style={s.step}>Para quem você quer transferir?</p>
              <div style={t.campo}>
                <label style={t.label}>Chave PIX</label>
                <div style={s.chaveRow}>
                  <input
                    type="text"
                    value={chave}
                    onChange={e => { setChave(e.target.value); setErroChave(''); }}
                    onKeyDown={e => e.key === 'Enter' && buscarDestino()}
                    style={{ ...t.input, flex: 1 }}
                    placeholder="ID da conta"
                    autoFocus
                  />
                  <button type="button" onClick={buscarDestino} style={s.buscarBtn} disabled={buscando || !chave.trim()}>
                    {buscando ? '...' : 'Buscar'}
                  </button>
                </div>
              </div>
              {erroChave && <div style={t.erro}>{erroChave}</div>}
            </>
          )}

          {/* Destino encontrado */}
          {contaDestino && (
            <>
              <div style={s.destinoBox}>
                <div style={s.destinoAvatar}>{contaDestino.nome?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <span style={s.destinoNome}>{contaDestino.nome}</span>
                  <span style={s.destinoId}>Conta #{contaDestino.id}</span>
                </div>
                <button
                  type="button"
                  style={s.trocarBtn}
                  onClick={() => { setContaDestino(null); setChave(''); setValor(''); setErro(''); }}
                >
                  Trocar
                </button>
              </div>

              <form onSubmit={handleSubmit}>
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
                    placeholder="Ex: aluguel, empréstimo..."
                  />
                </div>

                {erro && <div style={t.erro}>{erro}</div>}

                <button type="submit" disabled={enviando} style={{ ...t.btnPrimary, width: '100%', marginTop: '8px' }}>
                  {enviando ? 'Enviando...' : 'Confirmar transferência'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

const s = {
  wrap: { maxWidth: '480px', margin: '0 auto' },
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
  step: { color: '#1A1D23', fontWeight: '600', fontSize: '0.95rem', marginBottom: '16px' },
  chaveRow: { display: 'flex', gap: '8px' },
  buscarBtn: {
    padding: '0 18px',
    backgroundColor: '#6D28D9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.88rem',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  destinoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '12px 14px',
    marginBottom: '20px',
  },
  destinoAvatar: {
    width: '36px', height: '36px',
    backgroundColor: '#6D28D9',
    borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: '700', fontSize: '0.9rem',
    flexShrink: 0,
  },
  destinoNome: { display: 'block', color: '#1A1D23', fontWeight: '600', fontSize: '0.9rem' },
  destinoId: { display: 'block', color: '#94A3B8', fontSize: '0.75rem', marginTop: '2px' },
  trocarBtn: {
    background: 'none',
    border: 'none',
    color: '#6D28D9',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0,
    fontFamily: 'inherit',
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

export default Transferencia;
