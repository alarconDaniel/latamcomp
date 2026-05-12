import { useEffect, useMemo, useState } from 'react';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleRoute } from './RoleRoute.jsx';
import { navigate } from './navigation.js';
import { useCountry } from '../hooks/useCountry.js';
import { LandingPage } from '../pages/public/LandingPage.jsx';
import { NewsPage } from '../pages/public/NewsPage.jsx';
import { NewsDetailPage } from '../pages/public/NewsDetailPage.jsx';
import { TestimonialsPage } from '../pages/public/TestimonialsPage.jsx';
import { ContactPage } from '../pages/public/ContactPage.jsx';
import { DonationsPage } from '../pages/public/DonationsPage.jsx';
import { LoginPage } from '../pages/admin/LoginPage.jsx';
import { DashboardPage } from '../pages/admin/DashboardPage.jsx';
import { CountriesPage } from '../pages/admin/CountriesPage.jsx';
import { RequestsPage } from '../pages/admin/RequestsPage.jsx';
import { RequestDetailPage } from '../pages/admin/RequestDetailPage.jsx';
import { ContentListPage } from '../pages/admin/ContentListPage.jsx';
import { NewsFormPage } from '../pages/admin/NewsFormPage.jsx';
import { TestimonialFormPage } from '../pages/admin/TestimonialFormPage.jsx';

const getPath = () => window.location.pathname.replace(/\/+$/, '') || '/';

export function AppRouter() {
  const [path, setPath] = useState(getPath());
  const { setCountryBySlug } = useCountry();
  const reservedPaths = new Set(['admin', 'noticias', 'testimonios', 'contacto', 'donaciones']);

  useEffect(() => {
    const sync = () => setPath(getPath());
    window.addEventListener('popstate', sync);
    window.addEventListener('colcom:navigate', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('colcom:navigate', sync);
    };
  }, []);

  useEffect(() => {
    const slug = path.split('/').filter(Boolean)[0];
    if (slug && !reservedPaths.has(slug)) setCountryBySlug(slug);
  }, [path, setCountryBySlug]);

  const page = useMemo(() => {
    const segments = path.split('/').filter(Boolean);

    if (path === '/admin') {
      setTimeout(() => navigate('/admin/dashboard'), 0);
      return null;
    }

    if (path === '/admin/login') return <LoginPage />;

    if (segments[0] === 'admin') {
      const protectedPage = (() => {
        if (path === '/admin/dashboard') return <DashboardPage />;
        if (path === '/admin/paises') return <RoleRoute allowed={['superadmin']}><CountriesPage /></RoleRoute>;
        if (path === '/admin/solicitudes') return <RoleRoute allowed={['superadmin', 'admin_pais']}><RequestsPage /></RoleRoute>;
        if (segments[1] === 'solicitudes' && segments[2]) return <RoleRoute allowed={['superadmin', 'admin_pais']}><RequestDetailPage id={segments[2]} /></RoleRoute>;
        if (path === '/admin/noticias') return <ContentListPage type="noticias" />;
        if (path === '/admin/noticias/nueva') return <NewsFormPage />;
        if (segments[1] === 'noticias' && segments[3] === 'editar') return <NewsFormPage id={segments[2]} />;
        if (path === '/admin/testimonios') return <ContentListPage type="testimonios" />;
        if (path === '/admin/testimonios/nuevo') return <TestimonialFormPage />;
        if (segments[1] === 'testimonios' && segments[3] === 'editar') return <TestimonialFormPage id={segments[2]} />;
        return <DashboardPage />;
      })();

      return (
        <ProtectedRoute>
          <AdminLayout>{protectedPage}</AdminLayout>
        </ProtectedRoute>
      );
    }

    const publicPage = (() => {
      if (path === '/') return <LandingPage />;
      if (segments[0] && !reservedPaths.has(segments[0])) return <LandingPage />;
      if (path === '/noticias') return <NewsPage />;
      if (segments[0] === 'noticias' && segments[1]) return <NewsDetailPage slug={segments[1]} />;
      if (path === '/testimonios') return <TestimonialsPage />;
      if (path === '/contacto') return <ContactPage />;
      if (path === '/donaciones') return <DonationsPage />;
      return <LandingPage />;
    })();

    return <PublicLayout>{publicPage}</PublicLayout>;
  }, [path]);

  return page;
}
