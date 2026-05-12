import { useEffect, useMemo, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { paisesApi } from '../../api/paises.api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { CONTENT_STATES } from '../../utils/constants.js';
import { slugify } from '../../utils/slugify.js';
import { navigate } from '../../routes/navigation.js';
import { ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';

const initial = {
  pais_id: '',
  titulo: '',
  slug: '',
  resumen: '',
  contenido: '',
  imagen_principal_url: '',
  estado: 'borrador',
};

export function NewsFormPage({ id }) {
  const editing = Boolean(id);
  const { user } = useAuth();
  const [form, setForm] = useState(initial);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const userCountryId = useMemo(() => user?.pais_id || user?.pais?.id || '', [user]);

  useEffect(() => {
    if (user?.rol === 'superadmin') {
      paisesApi.all().then((data) => setCountries(Array.isArray(data) ? data : [])).catch(() => setCountries([]));
    } else if (userCountryId) {
      setForm((current) => ({ ...current, pais_id: userCountryId }));
    }
  }, [user?.rol, userCountryId]);

  useEffect(() => {
    if (!editing) return;
    noticiasApi.getById(id)
      .then((response) => {
        const item = response.data;
        setForm({
          pais_id: item.paises?.id || '',
          titulo: item.titulo || '',
          slug: item.slug || '',
          resumen: item.resumen || '',
          contenido: item.contenido || '',
          imagen_principal_url: item.imagen_principal_url || '',
          estado: item.estado || 'borrador',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'titulo' && !editing && !current.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      pais_id: Number(form.pais_id || userCountryId),
      slug: form.slug || slugify(form.titulo),
    };
    try {
      if (editing) await noticiasApi.update(id, payload);
      else await noticiasApi.create(payload);
      navigate('/admin/noticias');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="admin-content"><LoadingState /></main>;

  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div><p className="eyebrow">Noticias</p><h1>{editing ? 'Editar noticia' : 'Nueva noticia'}</h1></div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/noticias')}>Volver</button>
      </div>
      <ErrorState message={error} />
      <form className="form-panel wide-form" onSubmit={submit}>
        {user?.rol === 'superadmin' ? (
          <label>Pais<select value={form.pais_id} onChange={(e) => update('pais_id', e.target.value)} required>
            <option value="">Seleccionar</option>
            {countries.map((country) => <option key={country.id} value={country.id}>{country.nombre}</option>)}
          </select></label>
        ) : <input type="hidden" value={form.pais_id} />}
        <label>Titulo<input value={form.titulo} onChange={(e) => update('titulo', e.target.value)} required /></label>
        <label>Slug<input value={form.slug} onChange={(e) => update('slug', e.target.value)} /></label>
        <label>Resumen<textarea rows="3" value={form.resumen} onChange={(e) => update('resumen', e.target.value)} required /></label>
        <label>Contenido<textarea rows="10" value={form.contenido} onChange={(e) => update('contenido', e.target.value)} required /></label>
        <label>Imagen principal URL<input value={form.imagen_principal_url} onChange={(e) => update('imagen_principal_url', e.target.value)} /></label>
        <label>Estado<select value={form.estado} onChange={(e) => update('estado', e.target.value)}>{CONTENT_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
      </form>
    </main>
  );
}
