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
      if (c.conta) setContaId(c.conta.id);
    } catch {
      setErro('Erro ao carregar cartão');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    const dados = {
      bandeira,
      numeroFinal,
      tipo,
      limite: parseFloat(limite),
      conta: { id: parseInt(contaId) },
    };
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

  return (
    <Layout titulo={editando ? 'Editar Cartão' : 'Novo Cartão'}>
      <div style={s.wrap}>
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
                required
                maxLength={4}
                pattern="\d{4}"
                style={t.input}
                placeholder="1234"
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
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

const s = {
  wrap: { maxWidth: '560px' },
  row: { display: 'flex', gap: '16px' },
  botoes: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
};

export default CartaoForm;
