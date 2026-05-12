import { useEffect, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { useCountry } from '../../hooks/useCountry.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { navigate } from '../../routes/navigation.js';

export function NewsPage() {
  const { activeCountry } = useCountry();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeCountry?.slug) return;
    setLoading(true);
    setError('');
    noticiasApi.publicByCountry(activeCountry.slug)
      .then((response) => setItems(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCountry?.slug]);

  return (
    <main className="page-shell">
      <div className="page-title">
        <p className="eyebrow">Noticias publicadas</p>
        <h1>{activeCountry?.nombre}</h1>
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState title="No hay noticias publicadas" /> : (
        <div className="news-grid">
          {items.map((item) => (
            <article className="news-card" key={item.id} onClick={() => navigate(`/noticias/${item.slug}`)}>
              <div className="news-image" style={{ backgroundImage: item.imagen_principal_url ? `url(${item.imagen_principal_url})` : undefined }} />
              <div>
                <span>{formatDate(item.fecha_publicacion)}</span>
                <h3>{item.titulo}</h3>
                <p>{item.resumen}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
