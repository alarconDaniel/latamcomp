import { navigate } from '../../routes/navigation.js';

export function DonationsPage() {
  return (
    <main className="page-shell">
      <section className="donation-panel">
        <p className="eyebrow">Donaciones</p>
        <h1>Gracias por querer apoyar.</h1>
        <p>El backend actual no incluye un endpoint de donaciones. Dejamos este flujo como pagina informativa conectada al formulario de contacto.</p>
        <button className="btn btn-primary" onClick={() => navigate('/contacto')}>Contactar para donar</button>
      </section>
    </main>
  );
}
