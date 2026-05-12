import { useEffect, useState } from 'react';
import { testimoniosApi } from '../../api/testimonios.api.js';
import { useCountry } from '../../hooks/useCountry.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';

export function TestimonialsPage() {
  const { activeCountry } = useCountry();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeCountry?.slug) return;
    setLoading(true);
    setError('');
    testimoniosApi.publicByCountry(activeCountry.slug)
      .then((response) => setItems(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCountry?.slug]);

  return (
    <main className="page-shell">
      <div className="page-title">
        <p className="eyebrow">Testimonios publicados</p>
        <h1>Historias de {activeCountry?.nombre}</h1>
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState title="No hay testimonios publicados" /> : (
        <div className="testimonial-grid">
          {items.map((item) => (
            <article className="testimonial-card" key={item.id}>
              {item.foto_url ? <img src={item.foto_url} alt={item.nombre} /> : <div className="avatar-placeholder">{item.nombre?.[0]}</div>}
              <p>{item.contenido}</p>
              <strong>{item.nombre}</strong>
              <span>{[item.cargo, item.empresa].filter(Boolean).join(' - ')}</span>
              <div className="social-row">
                {item.instagram_url && <a href={item.instagram_url} target="_blank" rel="noreferrer">Instagram</a>}
                {item.facebook_url && <a href={item.facebook_url} target="_blank" rel="noreferrer">Facebook</a>}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
