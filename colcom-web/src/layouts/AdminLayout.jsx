import { useAuth } from '../hooks/useAuth.js';
import { canManageCountries, canManageRequests } from '../utils/constants.js';
import { navigate } from '../routes/navigation.js';

export function AdminLayout({ children }) {
  const { user, logout } = useAuth();

  const navItems = [
    ['Dashboard', '/admin/dashboard', true],
    ['Paises', '/admin/paises', canManageCountries(user?.rol)],
    ['Solicitudes', '/admin/solicitudes', canManageRequests(user?.rol)],
    ['Testimonios', '/admin/testimonios', true],
    ['Noticias', '/admin/noticias', true],
  ].filter((item) => item[2]);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button className="brand admin-brand" onClick={() => navigate('/admin/dashboard')}>
          <span className="brand-mark">CC</span>
          <span>CMS</span>
        </button>
        <nav>
          {navItems.map(([label, path]) => (
            <button
              key={path}
              className={window.location.pathname === path ? 'admin-nav active' : 'admin-nav'}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <strong>{user?.nombre} {user?.apellido}</strong>
            <span>{user?.rol} {user?.pais?.nombre ? `- ${user.pais.nombre}` : ''}</span>
          </div>
          <button className="btn btn-secondary" onClick={logout}>Cerrar sesion</button>
        </header>
        {children}
      </div>
    </div>
  );
}
