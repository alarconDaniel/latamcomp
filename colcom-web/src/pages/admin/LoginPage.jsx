import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { navigate } from '../../routes/navigation.js';

export function LoginPage() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(credentials);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <span className="brand-mark">CC</span>
        <h1>Administracion</h1>
        <label>Usuario<input value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} /></label>
        <label>Contrasena<input type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} /></label>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Entrando...' : 'Iniciar sesion'}</button>
      </form>
    </main>
  );
}
