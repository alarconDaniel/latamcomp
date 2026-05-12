import { useEffect, useState } from 'react';
import { paisesApi } from '../../api/paises.api.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

export function CountriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    paisesApi.all()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Portales</p>
          <h1>Paises</h1>
        </div>
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>Codigo</th><th>Slug</th><th>Estado</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>{item.codigo}</td>
                  <td>{item.slug}</td>
                  <td><StatusBadge value={item.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
