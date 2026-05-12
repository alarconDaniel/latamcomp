import { useEffect, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { testimoniosApi } from '../../api/testimonios.api.js';
import { paisesApi } from '../../api/paises.api.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ConfirmButton } from '../../components/common/ConfirmButton.jsx';
import { CONTENT_STATES, canDeleteContent } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';
import { useAuth } from '../../hooks/useAuth.js';
import { navigate } from '../../routes/navigation.js';

const apiByType = {
  noticias: noticiasApi,
  testimonios: testimoniosApi,
};

const labels = {
  noticias: { title: 'Noticias', newPath: '/admin/noticias/nueva', editBase: '/admin/noticias' },
  testimonios: { title: 'Testimonios', newPath: '/admin/testimonios/nuevo', editBase: '/admin/testimonios' },
};

export function ContentListPage({ type }) {
  const api = apiByType[type];
  const label = labels[type];
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filters, setFilters] = useState({ estado: '', pais_id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.getAll(filters)
      .then((response) => setItems(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [type, filters.estado, filters.pais_id]);

  useEffect(() => {
    if (user?.rol === 'superadmin') {
      paisesApi.all().then((data) => setCountries(Array.isArray(data) ? data : [])).catch(() => setCountries([]));
    }
  }, [user?.rol]);

  const remove = async (id) => {
    await api.remove(id);
    load();
  };

  const changeState = async (item, estado) => {
    await api.update(item.id, { estado });
    load();
  };

  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div><p className="eyebrow">Contenido</p><h1>{label.title}</h1></div>
        <div className="filter-row">
          {user?.rol === 'superadmin' && (
            <select value={filters.pais_id} onChange={(e) => setFilters({ ...filters, pais_id: e.target.value })}>
              <option value="">Todos los paises</option>
              {countries.map((country) => <option key={country.id} value={country.id}>{country.nombre}</option>)}
            </select>
          )}
          <select value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })}>
            <option value="">Todos los estados</option>
            {CONTENT_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => navigate(label.newPath)}>Crear</button>
        </div>
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{type === 'noticias' ? 'Titulo' : 'Nombre'}</th>
                <th>Pais</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.titulo || item.nombre}</td>
                  <td>{item.paises?.nombre}</td>
                  <td><StatusBadge value={item.estado} /></td>
                  <td>{formatDate(item.fecha_publicacion || item.created_at)}</td>
                  <td className="actions-cell">
                    <button className="btn btn-small" onClick={() => navigate(`${label.editBase}/${item.id}/editar`)}>Editar</button>
                    <button className="btn btn-small" onClick={() => changeState(item, item.estado === 'publicado' ? 'despublicado' : 'publicado')}>
                      {item.estado === 'publicado' ? 'Despublicar' : 'Publicar'}
                    </button>
                    {canDeleteContent(user?.rol) && (
                      <ConfirmButton message={`Eliminar ${label.title.toLowerCase()}?`} onConfirm={() => remove(item.id)}>Eliminar</ConfirmButton>
                    )}
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
