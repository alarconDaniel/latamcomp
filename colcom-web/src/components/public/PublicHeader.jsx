import { useState } from 'react';
import { useCountry } from '../../hooks/useCountry.js';
import { navigate } from '../../routes/navigation.js';

export function PublicHeader() {
  const { countries, activeSlug, setCountryBySlug } = useCountry();
  const [open, setOpen] = useState(false);

  const goCountry = (slug) => {
    setCountryBySlug(slug);
    setOpen(false);
    navigate(`/${slug}`);
  };

  return (
    <header className="public-header">
      <button className="brand" onClick={() => navigate(`/${activeSlug || 'colombia'}`)}>
        <span className="brand-mark">CC</span>
        <span>Colombia Comparte</span>
      </button>
      <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
        <span />
        <span />
        <span />
      </button>
      <nav className={open ? 'public-nav is-open' : 'public-nav'}>
        {(countries.length ? countries : [{ slug: 'colombia', nombre: 'Colombia' }, { slug: 'chile', nombre: 'Chile' }, { slug: 'ecuador', nombre: 'Ecuador' }]).map((country) => (
          <button
            key={country.slug}
            className={country.slug === activeSlug ? 'nav-link active' : 'nav-link'}
            onClick={() => goCountry(country.slug)}
          >
            {country.nombre}
          </button>
        ))}
        <button className="nav-link" onClick={() => { setOpen(false); navigate('/noticias'); }}>Noticias</button>
        <button className="nav-link" onClick={() => { setOpen(false); navigate('/testimonios'); }}>Testimonios</button>
        <button className="nav-link" onClick={() => { setOpen(false); navigate('/contacto'); }}>Contacto</button>
        <button className="btn btn-primary" onClick={() => { setOpen(false); navigate('/donaciones'); }}>Donar</button>
      </nav>
    </header>
  );
}
