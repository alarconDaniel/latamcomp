import { useEffect, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { testimoniosApi } from '../../api/testimonios.api.js';
import { useCountry } from '../../hooks/useCountry.js';
import { formatDate } from '../../utils/formatDate.js';
import { navigate } from '../../routes/navigation.js';
import { EmptyState, ErrorState } from '../../components/common/AsyncState.jsx';

export function LandingPage() {
  const { activeCountry } = useCountry();
  const [news, setNews] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeCountry?.slug) return;
    setError('');
    Promise.all([
      noticiasApi.publicByCountry(activeCountry.slug),
      testimoniosApi.publicByCountry(activeCountry.slug),
    ])
      .then(([newsResponse, testimonialResponse]) => {
        setNews(newsResponse.data || []);
        setTestimonials(testimonialResponse.data || []);
      })
      .catch((err) => setError(err.message));
  }, [activeCountry?.slug]);

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Portal {activeCountry?.nombre}</p>
          <h1>Compartimos oportunidades para transformar vidas.</h1>
          <p>
            Unimos empresas, emprendedores y comunidades para impulsar historias
            reales de crecimiento social en Colombia, Chile y Ecuador.
          </p>
          <div className="hero-actions">
            <button className="btn btn-light" onClick={() => navigate('/contacto')}>Quiero participar</button>
            <button className="btn btn-ghost-light" onClick={() => navigate('/testimonios')}>Ver impacto</button>
          </div>
        </div>
        <div className="impact-panel">
          <span>Impacto activo</span>
          <strong>{activeCountry?.nombre}</strong>
          <p>Noticias, testimonios y solicitudes filtradas por portal.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">A quienes apoyamos</p>
          <h2>Emprendedores, familias y organizaciones con proposito.</h2>
        </div>
        <div className="support-grid">
          {['Emprendedores locales', 'Comunidades vulnerables', 'Aliados educativos'].map((item) => (
            <article className="feature-card" key={item}>
              <span className="feature-icon">+</span>
              <h3>{item}</h3>
              <p>Programas y conexiones que convierten acompanamiento en resultados sostenibles.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mission-band">
        <div>
          <p className="eyebrow">Nuestra mision en accion</p>
          <h2>Construimos puentes entre necesidad, conocimiento y oportunidad.</h2>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/contacto')}>Contactar equipo</button>
      </section>

      <section className="section two-columns">
        <div>
          <p className="eyebrow">Nuestra historia</p>
          <h2>Un modelo social que escala por pais sin perder cercania.</h2>
        </div>
        <p>
          Este CMS administra portales con contenido localizado, solicitudes de contacto,
          noticias y testimonios publicados por equipos con permisos definidos.
        </p>
      </section>

      <section className="section impact-grid">
        {['Paises activos', 'Contenido publicado', 'Solicitudes gestionables'].map((label, index) => (
          <div className="metric" key={label}>
            <strong>{index === 0 ? '3' : index === 1 ? news.length : '24/7'}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-heading inline-heading">
          <div>
            <p className="eyebrow">Testimonios</p>
            <h2>Historias de exito</h2>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/testimonios')}>Ver todos</button>
        </div>
        <ErrorState message={error} />
        {testimonials.length === 0 ? <EmptyState title="Sin testimonios publicados" /> : (
          <div className="testimonial-grid">
            {testimonials.slice(0, 3).map((item) => (
              <article className="testimonial-card" key={item.id}>
                {item.foto_url ? <img src={item.foto_url} alt={item.nombre} /> : <div className="avatar-placeholder">{item.nombre?.[0]}</div>}
                <p>{item.contenido}</p>
                <strong>{item.nombre}</strong>
                <span>{[item.cargo, item.empresa].filter(Boolean).join(' - ')}</span>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-heading inline-heading">
          <div>
            <p className="eyebrow">Noticias</p>
            <h2>Actualidad del portal</h2>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/noticias')}>Ver noticias</button>
        </div>
        {news.length === 0 ? <EmptyState title="Sin noticias publicadas" /> : (
          <div className="news-grid">
            {news.slice(0, 3).map((item) => (
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
      </section>

      <section className="entrepreneur-banner">
        <h2>Emprendedores que necesitan una vitrina tambien necesitan una red.</h2>
        <button className="btn btn-light" onClick={() => navigate('/contacto')}>Sumar iniciativa</button>
      </section>
    </main>
  );
}
