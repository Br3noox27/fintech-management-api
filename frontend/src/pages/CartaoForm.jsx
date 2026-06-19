import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import cartaoService from '../services/cartaoService';
import contaService from '../services/contaService';
import { s as t } from '../styles/theme';

function CartaoForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [bandeira, setBandeira] = useState('VISA');
  const [numeroFinal, setNumeroFinal] = useState('');
  const [tipo, setTipo] = useState('CREDITO');
  const [limite, setLimite] = useState('10000');
  const [contaId, setContaId] = useState('');
  const [contas, setContas] = useState([]);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarContas();
    if (editando) carregarCartao();
  }, [id]);

  async function carregarContas() {
    try {
      const res = await contaService.listar();
      setContas(res.data);
      if (res.data.length > 0) setContaId(String(res.data[0].id));
    } catch {
      setErro('Erro ao carregar contas');
    }
  }

  async function carregarCartao() {
    try {
      const res = await cartaoService.buscarPorId(id);
      const c = res.data;
      setBandeira(c.bandeira);
      setNumeroFinal(c.numeroFinal);
      setTipo(c.tipo);
      setLimite(c.limite);
      if (c.conta) setContaId(String(c.conta.id));
    } catch {
      setErro('Erro ao carregar cartão');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    const dados = { bandeira, numeroFinal, tipo, limite: parseFloat(limite), conta: { id: parseInt(contaId) } };
    try {
      if (editando) {
        await cartaoService.atualizar(id, dados);
      } else {
        await cartaoService.criar(dados);
      }
      navigate('/cartoes');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar cartão');
    } finally {
      setSalvando(false);
    }
  }

  const bandeiraConfig = { VISA: '#1A1F71', MASTERCARD: '#EB001B', ELO: '#00A650', AMEX: '#007BC1', HIPERCARD: '#CC0000' };

  return (
    <Layout titulo={editando ? 'Editar Cartão' : 'Novo Cartão'}>
      <div style={s.pageWrap}>
        <div style={s.left}>
          <div style={s.preview}>
            <p style={s.previewLabel}>Prévia do cartão</p>
            <div style={{ ...s.cartaoVisual, background: tipo === 'CREDITO' ? 'linear-gradient(135deg, #6D28D9, #4C1D95)' : 'linear-gradient(135deg, #D97706, #92400E)' }}>
              <div style={s.cartaoBandeira}>
                <span style={{ color: '#fff', fontWeight: '800', fontSize: '1rem', letterSpacing: '0.05em' }}>{bandeira || 'BANDEIRA'}</span>
              </div>
              <div style={s.cartaoNumero}>•••• •••• •••• {numeroFinal || '0000'}</div>
              <div style={s.cartaoRodape}>
                <span style={s.cartaoTipo}>{tipo}</span>
                <span style={s.cartaoLimite}>Limite: R$ {Number(limite || 0).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          <div style={s.infoCard}>
            <p style={s.infoLabel}>Sobre os tipos</p>
            <div style={s.infoItem}>
              <span style={{ ...s.infoBadge, color: '#6D28D9', backgroundColor: '#EDE9FE' }}>CRÉDITO</span>
              <span style={s.infoText}>Pagamento posterior com limite.</span>
            </div>
            <div style={s.infoItem}>
              <span style={{ ...s.infoBadge, color: '#D97706', backgroundColor: 'rgba(217,119,6,0.08)' }}>DÉBITO</span>
              <span style={s.infoText}>Desconto direto no saldo da conta.</span>
            </div>
          </div>
        </div>

        <div style={s.right}>
          <div style={s.card}>
            <form onSubmit={handleSubmit}>
              <div style={s.row}>
                <div style={{ ...t.campo, flex: 1 }}>
                  <label style={t.label}>Bandeira</label>
                  <select value={bandeira} onChange={e => setBandeira(e.target.value)} style={t.input} required>
                    <option value="VISA">Visa</option>
                    <option value="MASTERCARD">Mastercard</option>
                    <option value="ELO">Elo</option>
                    <option value="AMEX">American Express</option>
                    <option value="HIPERCARD">Hipercard</option>
                  </select>
                </div>
                <div style={{ ...t.campo, flex: 1 }}>
                  <label style={t.label}>Tipo</label>
                  <select value={tipo} onChange={e => setTipo(e.target.value)} style={t.input} required>
                    <option value="CREDITO">Crédito</option>
                    <option value="DEBITO">Débito</option>
                  </select>
                </div>
              </div>

              <div style={s.row}>
                <div style={{ ...t.campo, flex: 1 }}>
                  <label style={t.label}>Últimos 4 dígitos</label>
                  <input
                    type="text"
                    value={numeroFinal}
                    onChange={e => setNumeroFinal(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    required maxLength={4} pattern="\d{4}"
                    style={t.input} placeholder="1234"
                  />
                </div>
                <div style={{ ...t.campo, flex: 1 }}>
                  <label style={t.label}>Limite (R$)</label>
                  <input type="number" step="0.01" min="0.01" value={limite} onChange={e => setLimite(e.target.value)} required style={t.input} placeholder="0.00" />
                </div>
              </div>

              <div style={t.campo}>
                <label style={t.label}>Conta vinculada</label>
                <select value={contaId} onChange={e => setContaId(e.target.value)} style={t.input} required>
                  <option value="">Selecione a conta</option>
                  {contas.map(c => (
                    <option key={c.id} value={c.id}>{c.nome} — {c.tipo}</option>
                  ))}
                </select>
              </div>

              {erro && <div style={t.erro}>{erro}</div>}

              <div style={s.botoes}>
                <button type="button" onClick={() => navigate('/cartoes')} style={t.btnOutline}>Cancelar</button>
                <button type="submit" disabled={salvando} style={t.btnPrimary}>
                  {salvando ? 'Salvando...' : 'Salvar cartão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const s = {
  pageWrap: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  left: { width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' },
  right: { flex: 1 },
  preview: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' },
  previewLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' },
  cartaoVisual: { borderRadius: '12px', padding: '20px', aspectRatio: '1.6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cartaoBandeira: {},
  cartaoNumero: { color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace', fontSize: '0.95rem', letterSpacing: '0.15em' },
  cartaoRodape: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  cartaoTipo: { color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' },
  cartaoLimite: { color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: '600' },
  infoCard: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px' },
  infoLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  infoBadge: { padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', flexShrink: 0 },
  infoText: { color: '#64748B', fontSize: '0.78rem' },
  card: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '28px' },
  row: { display: 'flex', gap: '16px' },
  botoes: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
};

export default CartaoForm;
