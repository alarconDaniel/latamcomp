import { useEffect, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { useCountry } from '../../hooks/useCountry.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { formatDate } from '../../utils/formatDate.js';

export function NewsDetailPage({ slug }) {
  const { activeCountry } = useCountry();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeCountry?.slug || !slug) return;
    setLoading(true);
    setError('');
    noticiasApi.publicBySlug(activeCountry.slug, slug)
      .then((response) => setItem(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCountry?.slug, slug]);

  if (loading) return <main className="page-shell"><LoadingState /></main>;

  return (
    <main className="article-shell">
      <ErrorState message={error} />
      {!item ? <EmptyState title="Noticia no encontrada" /> : (
        <article>
          <p className="eyebrow">{activeCountry?.nombre} - {formatDate(item.fecha_publicacion)}</p>
          <h1>{item.titulo}</h1>
          <p className="article-summary">{item.resumen}</p>
          {item.imagen_principal_url && <img className="article-image" src={item.imagen_principal_url} alt={item.titulo} />}
          <div className="article-content">
            {(item.contenido || '').split('\n').map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>
      )}
    </main>
  );
}
