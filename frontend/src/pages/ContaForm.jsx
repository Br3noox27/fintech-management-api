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
    const dados = {
      nome,
      tipo,
      saldo: parseFloat(saldo),
      usuario: { id: parseInt(usuarioId) },
    };
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

  return (
    <Layout titulo={editando ? 'Editar Conta' : 'Nova Conta'}>
      <div style={s.wrap}>
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
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

const s = {
  wrap: { maxWidth: '520px' },
  botoes: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
};

export default ContaForm;
