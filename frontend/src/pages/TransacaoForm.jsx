import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import transacaoService from '../services/transacaoService';
import contaService from '../services/contaService';
import { s as t } from '../styles/theme';

const categorias = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Moradia', 'Salário', 'Freelance', 'Investimento', 'Outros'];

function TransacaoForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('DESPESA');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [contaId, setContaId] = useState('');
  const [contas, setContas] = useState([]);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarContas();
    if (editando) carregarTransacao();
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

  async function carregarTransacao() {
    try {
      const res = await transacaoService.buscarPorId(id);
      const tr = res.data;
      setDescricao(tr.descricao);
      setTipo(tr.tipo);
      setCategoria(tr.categoria);
      setValor(tr.valor);
    } catch {
      setErro('Erro ao carregar transação');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    const dados = { descricao, tipo, categoria, valor: parseFloat(valor), conta: { id: parseInt(contaId) } };
    try {
      if (editando) {
        await transacaoService.atualizar(id, dados);
      } else {
        await transacaoService.criar(dados);
      }
      navigate('/transacoes');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar transação');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Layout titulo={editando ? 'Editar Transação' : 'Nova Transação'}>
      <div style={s.pageWrap}>
        <div style={s.left}>
          <div style={s.infoCard}>
            <div style={{ ...s.tipoBox, backgroundColor: tipo === 'RECEITA' ? 'rgba(5,150,105,0.08)' : 'rgba(239,68,68,0.08)', borderColor: tipo === 'RECEITA' ? 'rgba(5,150,105,0.2)' : 'rgba(239,68,68,0.2)' }}>
              <span style={{ fontSize: '1.8rem' }}>{tipo === 'RECEITA' ? '↑' : '↓'}</span>
              <div>
                <p style={{ ...s.tipoLabel, color: tipo === 'RECEITA' ? '#059669' : '#EF4444' }}>{tipo}</p>
                <p style={s.tipoDesc}>
                  {tipo === 'RECEITA' ? 'Entrada de dinheiro na conta.' : 'Saída de dinheiro da conta.'}
                </p>
              </div>
            </div>

            {valor && (
              <div style={s.valorPreview}>
                <p style={s.valorPreviewLabel}>Valor da transação</p>
                <p style={{ ...s.valorPreviewNum, color: tipo === 'RECEITA' ? '#059669' : '#EF4444' }}>
                  {tipo === 'RECEITA' ? '+' : '-'} R$ {Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}

            <div style={s.categoriasInfo}>
              <p style={s.infoLabel}>Categorias disponíveis</p>
              <div style={s.categoriasWrap}>
                {categorias.map(c => (
                  <span key={c} style={{ ...s.categoriaPill, ...(categoria === c ? s.categoriaPillAtiva : {}) }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={s.right}>
          <div style={s.card}>
            <form onSubmit={handleSubmit}>
              <div style={t.campo}>
                <label style={t.label}>Descrição</label>
                <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} required style={t.input} placeholder="Ex: Supermercado, Salário..." />
              </div>

              <div style={s.row}>
                <div style={{ ...t.campo, flex: 1 }}>
                  <label style={t.label}>Tipo</label>
                  <div style={s.tipoToggle}>
                    <button type="button" onClick={() => setTipo('RECEITA')} style={{ ...s.tipoBtn, ...(tipo === 'RECEITA' ? s.tipoBtnReceita : {}) }}>
                      ↑ Receita
                    </button>
                    <button type="button" onClick={() => setTipo('DESPESA')} style={{ ...s.tipoBtn, ...(tipo === 'DESPESA' ? s.tipoBtnDespesa : {}) }}>
                      ↓ Despesa
                    </button>
                  </div>
                </div>
                <div style={{ ...t.campo, flex: 1 }}>
                  <label style={t.label}>Categoria</label>
                  <select value={categoria} onChange={e => setCategoria(e.target.value)} style={t.input} required>
                    <option value="">Selecione</option>
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={s.row}>
                <div style={{ ...t.campo, flex: 1 }}>
                  <label style={t.label}>Valor (R$)</label>
                  <input type="number" step="0.01" min="0.01" value={valor} onChange={e => setValor(e.target.value)} required style={t.input} placeholder="0.00" />
                </div>
                <div style={{ ...t.campo, flex: 1 }}>
                  <label style={t.label}>Conta</label>
                  <select value={contaId} onChange={e => setContaId(e.target.value)} style={t.input} required>
                    <option value="">Selecione a conta</option>
                    {contas.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.tipo}</option>)}
                  </select>
                </div>
              </div>

              {erro && <div style={t.erro}>{erro}</div>}

              <div style={s.botoes}>
                <button type="button" onClick={() => navigate('/transacoes')} style={t.btnOutline}>Cancelar</button>
                <button type="submit" disabled={salvando} style={{ ...t.btnPrimary, backgroundColor: tipo === 'DESPESA' ? '#EF4444' : '#6D28D9' }}>
                  {salvando ? 'Salvando...' : `Salvar ${tipo === 'RECEITA' ? 'receita' : 'despesa'}`}
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
  left: { width: '280px', flexShrink: 0 },
  right: { flex: 1 },
  infoCard: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  tipoBox: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', border: '1px solid' },
  tipoLabel: { fontWeight: '700', fontSize: '0.9rem', marginBottom: '2px' },
  tipoDesc: { color: '#64748B', fontSize: '0.78rem' },
  valorPreview: { backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', textAlign: 'center' },
  valorPreviewLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' },
  valorPreviewNum: { fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.03em' },
  categoriasInfo: {},
  infoLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
  categoriasWrap: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  categoriaPill: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' },
  categoriaPillAtiva: { backgroundColor: '#EDE9FE', color: '#6D28D9', border: '1px solid #6D28D9' },
  card: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '28px' },
  row: { display: 'flex', gap: '16px' },
  tipoToggle: { display: 'flex', gap: '8px' },
  tipoBtn: { flex: 1, padding: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' },
  tipoBtnReceita: { backgroundColor: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.3)', color: '#059669' },
  tipoBtnDespesa: { backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' },
  botoes: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
};

export default TransacaoForm;
