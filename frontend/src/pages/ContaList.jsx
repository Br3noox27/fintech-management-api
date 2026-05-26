import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import contaService from '../services/contaService';
import { s as t, c } from '../styles/theme';

const tipoColor = {
  CORRENTE:     { color: c.blue,   bg: c.blueBg },
  POUPANCA:     { color: c.green,  bg: c.greenBg },
  INVESTIMENTO: { color: c.yellow, bg: c.yellowBg },
};

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

  const action = (
    <button style={t.btnPrimary} onClick={() => navigate('/contas/nova')}>
      + Nova Conta
    </button>
  );

  return (
    <Layout titulo="Contas" action={action}>
      {carregando && <p style={s.info}>Carregando...</p>}
      {erro && <div style={t.erro}>{erro}</div>}

      {!carregando && contas.length === 0 && (
        <p style={s.vazio}>Nenhuma conta cadastrada.</p>
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
                const cor = tipoColor[conta.tipo] || { color: '#8b92a9', bg: 'rgba(139,146,169,0.1)' };
                return (
                  <tr key={conta.id}>
                    <td style={{ ...t.td, ...s.idCell }}>#{conta.id}</td>
                    <td style={t.td}>{conta.nome}</td>
                    <td style={t.td}>
                      <span style={{ ...s.badge, color: cor.color, backgroundColor: cor.bg }}>
                        {conta.tipo}
                      </span>
                    </td>
                    <td style={{ ...t.td, color: '#10b981', fontWeight: '600' }}>
                      {fmt(conta.saldo)}
                    </td>
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
  tableWrap: { backgroundColor: '#1a1836', border: '1px solid #2d2b5a', borderRadius: '12px', overflow: 'hidden' },
  idCell: { color: '#8b92a9', fontFamily: 'monospace', fontSize: '0.85rem' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  info: { color: '#8b92a9' },
  vazio: { color: '#8b92a9', textAlign: 'center', padding: '48px' },
};

export default ContaList;
