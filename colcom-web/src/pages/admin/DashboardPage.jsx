import { useEffect, useMemo, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { testimoniosApi } from '../../api/testimonios.api.js';
import { solicitudesApi } from '../../api/solicitudes.api.js';
import { paisesApi } from '../../api/paises.api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { canManageRequests } from '../../utils/constants.js';

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ news: [], testimonials: [], requests: [], countries: [] });
  const [countryFilter, setCountryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const filters = countryFilter ? { pais_id: countryFilter } : {};
    Promise.all([
      noticiasApi.getAll(filters),
      testimoniosApi.getAll(filters),
      canManageRequests(user?.rol) ? solicitudesApi.getAll(filters) : Promise.resolve({ data: [] }),
      user?.rol === 'superadmin' ? paisesApi.all() : paisesApi.active(),
    ])
      .then(([news, testimonials, requests, countries]) => {
        setData({
          news: news.data || [],
          testimonials: testimonials.data || [],
          requests: requests.data || [],
          countries: Array.isArray(countries) ? countries : [],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [countryFilter, user?.rol]);

  const cards = useMemo(() => [
    ['Noticias', data.news.length],
    ['Testimonios', data.testimonials.length],
    ['Solicitudes', data.requests.length],
    ['Paises activos', data.countries.length],
  ], [data]);

  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Panel administrativo</p>
          <h1>Dashboard</h1>
        </div>
        {user?.rol === 'superadmin' && (
          <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
            <option value="">Todos los paises</option>
            {data.countries.map((country) => <option key={country.id} value={country.id}>{country.nombre}</option>)}
          </select>
        )}
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState /> : (
        <>
          <div className="dashboard-grid">
            {cards.map(([label, value]) => (
              <article className="dashboard-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
          {cards.every(([, value]) => value === 0) && <EmptyState title="Sin datos administrativos" />}
        </>
      )}
    </main>
  );
}
