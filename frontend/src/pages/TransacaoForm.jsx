import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import transacaoService from '../services/transacaoService';
import contaService from '../services/contaService';
import { s as t } from '../styles/theme';

const categorias = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Moradia', 'Salário', 'Outros'];

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
    const dados = {
      descricao,
      tipo,
      categoria,
      valor: parseFloat(valor),
      conta: { id: parseInt(contaId) },
    };
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
      <div style={s.wrap}>
        <form onSubmit={handleSubmit}>
          <div style={t.campo}>
            <label style={t.label}>Descrição</label>
            <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} required style={t.input} placeholder="Ex: Supermercado" />
          </div>

          <div style={s.row}>
            <div style={{ ...t.campo, flex: 1 }}>
              <label style={t.label}>Tipo</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={t.input} required>
                <option value="DESPESA">Despesa</option>
                <option value="RECEITA">Receita</option>
              </select>
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
  wrap: { maxWidth: '620px' },
  row: { display: 'flex', gap: '16px' },
  botoes: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
};

export default TransacaoForm;
