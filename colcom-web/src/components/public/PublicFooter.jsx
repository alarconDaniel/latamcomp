import { navigate } from '../../routes/navigation.js';

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div>
        <strong>Colombia Comparte</strong>
        <p>CMS multipais para iniciativas sociales, emprendedores y comunidades.</p>
      </div>
      <div className="footer-links">
        <button onClick={() => navigate('/contacto')}>Contacto</button>
        <button onClick={() => navigate('/admin/login')}>Administracion</button>
      </div>
    </footer>
  );
}
