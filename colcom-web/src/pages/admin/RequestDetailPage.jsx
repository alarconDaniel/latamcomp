import { useEffect, useState } from 'react';
import { solicitudesApi } from '../../api/solicitudes.api.js';
import { ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { REQUEST_STATES } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';
import { navigate } from '../../routes/navigation.js';

export function RequestDetailPage({ id }) {
  const [item, setItem] = useState(null);
  const [form, setForm] = useState({ estado: '', observaciones_admin: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    solicitudesApi.getById(id)
      .then((response) => {
        setItem(response.data);
        setForm({ estado: response.data.estado, observaciones_admin: response.data.observaciones_admin || '' });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async (event) => {
    event.preventDefault();
    setStatus('');
    try {
      const response = await solicitudesApi.updateStatus(id, form);
      setItem(response.data);
      setStatus('Solicitud actualizada.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  if (loading) return <main className="admin-content"><LoadingState /></main>;

  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div><p className="eyebrow">Solicitud</p><h1>{item?.nombre}</h1></div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/solicitudes')}>Volver</button>
      </div>
      <ErrorState message={error} />
      {item && (
        <div className="detail-grid">
          <section className="detail-panel">
            <p><strong>Correo:</strong> {item.correo}</p>
            <p><strong>Telefono:</strong> {item.telefono}</p>
            <p><strong>Finalidad:</strong> {item.finalidad}</p>
            <p><strong>Pais:</strong> {item.paises?.nombre}</p>
            <p><strong>Fecha:</strong> {formatDate(item.created_at)}</p>
            <p><strong>Estado:</strong> <StatusBadge value={item.estado} /></p>
            <p><strong>Mensaje:</strong> {item.mensaje || 'Sin mensaje'}</p>
          </section>
          <form className="form-panel" onSubmit={save}>
            <label>Estado
              <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                {REQUEST_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </label>
            <label>Observaciones
              <textarea rows="6" value={form.observaciones_admin} onChange={(e) => setForm({ ...form, observaciones_admin: e.target.value })} />
            </label>
            {status && <div className={status.includes('actualizada') ? 'alert alert-success' : 'alert alert-error'}>{status}</div>}
            <button className="btn btn-primary">Guardar cambios</button>
          </form>
        </div>
      )}
    </main>
  );
}
