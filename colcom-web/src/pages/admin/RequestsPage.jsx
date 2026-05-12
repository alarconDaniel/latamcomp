import { useEffect, useState } from 'react';
import { solicitudesApi } from '../../api/solicitudes.api.js';
import { paisesApi } from '../../api/paises.api.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ConfirmButton } from '../../components/common/ConfirmButton.jsx';
import { REQUEST_STATES } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';
import { useAuth } from '../../hooks/useAuth.js';
import { navigate } from '../../routes/navigation.js';

export function RequestsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filters, setFilters] = useState({ estado: '', pais_id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    solicitudesApi.getAll(filters)
      .then((response) => setItems(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters.estado, filters.pais_id]);

  useEffect(() => {
    if (user?.rol === 'superadmin') {
      paisesApi.all().then((data) => setCountries(Array.isArray(data) ? data : [])).catch(() => setCountries([]));
    }
  }, [user?.rol]);

  const remove = async (id) => {
    await solicitudesApi.remove(id);
    load();
  };

  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div><p className="eyebrow">Contacto</p><h1>Solicitudes</h1></div>
        <div className="filter-row">
          {user?.rol === 'superadmin' && (
            <select value={filters.pais_id} onChange={(e) => setFilters({ ...filters, pais_id: e.target.value })}>
              <option value="">Todos</option>
              {countries.map((country) => <option key={country.id} value={country.id}>{country.nombre}</option>)}
            </select>
          )}
          <select value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })}>
            <option value="">Todos los estados</option>
            {REQUEST_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>Correo</th><th>Finalidad</th><th>Pais</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>{item.correo}</td>
                  <td>{item.finalidad}</td>
                  <td>{item.paises?.nombre}</td>
                  <td><StatusBadge value={item.estado} /></td>
                  <td>{formatDate(item.created_at)}</td>
                  <td className="actions-cell">
                    <button className="btn btn-small" onClick={() => navigate(`/admin/solicitudes/${item.id}`)}>Ver</button>
                    <ConfirmButton message="Eliminar solicitud?" onConfirm={() => remove(item.id)}>Eliminar</ConfirmButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
