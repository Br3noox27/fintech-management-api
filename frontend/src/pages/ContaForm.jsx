import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import contaService from '../services/contaService';
import usuarioService from '../services/usuarioService';
import { s as t } from '../styles/theme';

function ContaForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('CORRENTE');
  const [saldo, setSaldo] = useState('10000');
  const [usuarioId, setUsuarioId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarUsuarios();
    if (editando) carregarConta();
  }, [id]);

  async function carregarUsuarios() {
    try {
      const res = await usuarioService.listar();
      setUsuarios(res.data);
      if (res.data.length > 0) setUsuarioId(String(res.data[0].id));
    } catch {
      setErro('Erro ao carregar usuários');
    }
  }

  async function carregarConta() {
    try {
      const res = await contaService.buscarPorId(id);
      setNome(res.data.nome);
      setTipo(res.data.tipo);
      setSaldo(res.data.saldo);
    } catch {
      setErro('Erro ao carregar conta');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    const dados = { nome, tipo, saldo: parseFloat(saldo), usuario: { id: parseInt(usuarioId) } };
    try {
      if (editando) {
        await contaService.atualizar(id, dados);
      } else {
        await contaService.criar(dados);
      }
      navigate('/contas');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar conta');
    } finally {
      setSalvando(false);
    }
  }

  const tipoDesc = {
    CORRENTE: 'Conta para movimentações do dia a dia.',
    POUPANCA: 'Conta para guardar dinheiro com rendimento.',
    INVESTIMENTO: 'Conta para aplicações financeiras.',
  };

  return (
    <Layout titulo={editando ? 'Editar Conta' : 'Nova Conta'}>
      <div style={s.pageWrap}>
        <div style={s.left}>
          <div style={s.infoCard}>
            <div style={s.infoIcon}>◈</div>
            <h3 style={s.infoTitle}>{editando ? 'Editar conta' : 'Nova conta bancária'}</h3>
            <p style={s.infoText}>
              {editando
                ? 'Atualize as informações da sua conta. O saldo pode ser ajustado manualmente.'
                : 'Crie uma nova conta para organizar seu dinheiro. Você pode ter contas de diferentes tipos.'}
            </p>
            <div style={s.dica}>
              <p style={s.dicaLabel}>Tipos disponíveis</p>
              {Object.entries(tipoDesc).map(([k, v]) => (
                <div key={k} style={s.dicaItem}>
                  <span style={{ ...s.dicaBadge, backgroundColor: k === tipo ? '#EDE9FE' : '#F8FAFC', color: k === tipo ? '#6D28D9' : '#94A3B8' }}>{k}</span>
                  <span style={s.dicaText}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={s.right}>
          <div style={s.card}>
            <form onSubmit={handleSubmit}>
              <div style={t.campo}>
                <label style={t.label}>Nome da Conta</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={t.input} placeholder="Ex: Conta Principal" />
              </div>

              <div style={t.campo}>
                <label style={t.label}>Tipo</label>
                <select value={tipo} onChange={e => setTipo(e.target.value)} style={t.input} required>
                  <option value="CORRENTE">Corrente</option>
                  <option value="POUPANCA">Poupança</option>
                  <option value="INVESTIMENTO">Investimento</option>
                </select>
              </div>

              <div style={t.campo}>
                <label style={t.label}>Saldo Inicial (R$)</label>
                <input type="number" step="0.01" min="0" value={saldo} onChange={e => setSaldo(e.target.value)} required style={t.input} placeholder="0.00" />
              </div>

              {!editando && (
                <div style={t.campo}>
                  <label style={t.label}>Usuário</label>
                  <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} style={t.input} required>
                    <option value="">Selecione um usuário</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              {erro && <div style={t.erro}>{erro}</div>}

              <div style={s.botoes}>
                <button type="button" onClick={() => navigate('/contas')} style={t.btnOutline}>Cancelar</button>
                <button type="submit" disabled={salvando} style={t.btnPrimary}>
                  {salvando ? 'Salvando...' : 'Salvar conta'}
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
  left: { width: '300px', flexShrink: 0 },
  right: { flex: 1, maxWidth: '520px' },
  infoCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
  },
  infoIcon: { fontSize: '1.5rem', color: '#6D28D9', marginBottom: '12px' },
  infoTitle: { color: '#1A1D23', fontSize: '1rem', fontWeight: '700', marginBottom: '8px' },
  infoText: { color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px' },
  dica: { borderTop: '1px solid #F1F5F9', paddingTop: '16px' },
  dicaLabel: { color: '#94A3B8', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' },
  dicaItem: { display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' },
  dicaBadge: { padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', flexShrink: 0, marginTop: '2px' },
  dicaText: { color: '#64748B', fontSize: '0.78rem', lineHeight: 1.5 },
  card: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '28px' },
  botoes: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
};

export default ContaForm;
