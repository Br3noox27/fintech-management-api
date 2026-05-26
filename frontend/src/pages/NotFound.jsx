import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={s.root}>
      <div style={s.code}>404</div>
      <h1 style={s.titulo}>Página não encontrada</h1>
      <p style={s.texto}>O endereço que você acessou não existe ou foi movido.</p>
      <button onClick={() => navigate('/')} style={s.btn}>
        Voltar ao início
      </button>
    </div>
  );
}

const s = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#0d0c1e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
  },
  code: {
    fontSize: '7rem',
    fontWeight: '800',
    color: '#2d2b5a',
    lineHeight: 1,
    marginBottom: '16px',
    letterSpacing: '-4px',
  },
  titulo: {
    color: '#e2e8f0',
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '10px',
  },
  texto: {
    color: '#8b92a9',
    fontSize: '0.95rem',
    marginBottom: '32px',
  },
  btn: {
    padding: '12px 28px',
    backgroundColor: '#7c3aed',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};

export default NotFound;
