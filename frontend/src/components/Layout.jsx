import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/',           label: 'Início',      exact: true },
  { path: '/extrato',    label: 'Extrato'     },
  { path: '/depositar',  label: 'Depositar'   },
  { path: '/transferir', label: 'Transferir'  },
  { path: '/contas',     label: 'Contas'      },
  { path: '/cartoes',    label: 'Cartões'     },
  { path: '/transacoes', label: 'Transações'  },
  { path: '/usuarios',   label: 'Usuários'    },
];

function Layout({ children, titulo, action }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function isActive(item) {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  }

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandIcon}>F</div>
          <div>
            <span style={s.brandName}>Fintech</span>
            <span style={s.brandSub}>Banco Digital</span>
          </div>
        </div>

        <nav style={s.nav}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{ ...s.navLink, ...(isActive(item) ? s.navActive : {}) }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={s.user}>
          <div style={s.avatar}>{usuario?.nome?.[0]?.toUpperCase()}</div>
          <div style={s.userInfo}>
            <span style={s.userName}>{usuario?.nome}</span>
            <span style={s.userSub}>Conta ativa</span>
          </div>
          <button style={s.logoutBtn} title="Sair" onClick={() => { logout(); navigate('/login'); }}>
            Sair
          </button>
        </div>
      </aside>

      <div style={s.main}>
        {(titulo || action) && (
          <div style={s.topbar}>
            {titulo && <h1 style={s.titulo}>{titulo}</h1>}
            {action}
          </div>
        )}
        <div style={s.content}>{children}</div>
      </div>
    </div>
  );
}

const s = {
  root: { display: 'flex', minHeight: '100vh', backgroundColor: '#F2F4F7' },
  sidebar: {
    width: '220px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    padding: '24px 12px',
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 8px 28px',
  },
  brandIcon: {
    width: '34px', height: '34px',
    backgroundColor: '#6D28D9',
    borderRadius: '9px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', fontSize: '1rem', color: '#fff',
    flexShrink: 0,
  },
  brandName: {
    display: 'block',
    color: '#1A1D23',
    fontWeight: '800',
    fontSize: '1rem',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  brandSub: {
    display: 'block',
    color: '#94A3B8',
    fontSize: '0.68rem',
    fontWeight: '500',
  },
  nav: { flex: 1 },
  navLink: {
    display: 'block',
    padding: '9px 12px',
    borderRadius: '8px',
    color: '#64748B',
    fontSize: '0.88rem',
    fontWeight: '500',
    marginBottom: '2px',
  },
  navActive: {
    color: '#6D28D9',
    backgroundColor: '#EDE9FE',
    fontWeight: '700',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '10px 12px',
    borderRadius: '10px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    marginTop: 'auto',
  },
  avatar: {
    width: '30px', height: '30px',
    backgroundColor: '#6D28D9',
    borderRadius: '7px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '0.82rem', color: '#fff',
    flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: {
    display: 'block',
    color: '#1A1D23',
    fontSize: '0.82rem',
    fontWeight: '600',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userSub: { display: 'block', color: '#94A3B8', fontSize: '0.68rem' },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#94A3B8',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontWeight: '500',
    flexShrink: 0,
  },
  main: {
    flex: 1,
    marginLeft: '220px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px 32px 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #E2E8F0',
  },
  titulo: {
    color: '#1A1D23',
    fontSize: '1.3rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
  },
  content: {
    padding: '28px 32px 52px',
    flex: 1,
  },
};

export default Layout;
