import { useAuth } from '../hooks/useAuth.js';

export function RoleRoute({ allowed, children }) {
  const { user } = useAuth();
  if (!allowed.includes(user?.rol)) {
    return (
      <main className="admin-content">
        <div className="empty-state">
          <h1>Acceso restringido</h1>
          <p>No tienes permisos para entrar a este modulo.</p>
        </div>
      </main>
    );
  }
  return children;
}
