import { useEffect, useMemo, useState } from 'react';
import { testimoniosApi } from '../../api/testimonios.api.js';
import { paisesApi } from '../../api/paises.api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { CONTENT_STATES } from '../../utils/constants.js';
import { navigate } from '../../routes/navigation.js';
import { ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';

const initial = {
  pais_id: '',
  nombre: '',
  cargo: '',
  empresa: '',
  contenido: '',
  foto_url: '',
  instagram_url: '',
  facebook_url: '',
  estado: 'borrador',
  destacado: false,
};

export function TestimonialFormPage({ id }) {
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
    testimoniosApi.getById(id)
      .then((response) => {
        const item = response.data;
        setForm({
          pais_id: item.paises?.id || '',
          nombre: item.nombre || '',
          cargo: item.cargo || '',
          empresa: item.empresa || '',
          contenido: item.contenido || '',
          foto_url: item.foto_url || '',
          instagram_url: item.instagram_url || '',
          facebook_url: item.facebook_url || '',
          estado: item.estado || 'borrador',
          destacado: Boolean(item.destacado),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, pais_id: Number(form.pais_id || userCountryId) };
      if (editing) await testimoniosApi.update(id, payload);
      else await testimoniosApi.create(payload);
      navigate('/admin/testimonios');
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
        <div><p className="eyebrow">Testimonios</p><h1>{editing ? 'Editar testimonio' : 'Nuevo testimonio'}</h1></div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/testimonios')}>Volver</button>
      </div>
      <ErrorState message={error} />
      <form className="form-panel wide-form" onSubmit={submit}>
        {user?.rol === 'superadmin' && (
          <label>Pais<select value={form.pais_id} onChange={(e) => update('pais_id', e.target.value)} required>
            <option value="">Seleccionar</option>
            {countries.map((country) => <option key={country.id} value={country.id}>{country.nombre}</option>)}
          </select></label>
        )}
        <label>Nombre<input value={form.nombre} onChange={(e) => update('nombre', e.target.value)} required /></label>
        <label>Cargo<input value={form.cargo} onChange={(e) => update('cargo', e.target.value)} /></label>
        <label>Empresa<input value={form.empresa} onChange={(e) => update('empresa', e.target.value)} /></label>
        <label>Contenido<textarea rows="7" value={form.contenido} onChange={(e) => update('contenido', e.target.value)} required /></label>
        <label>Foto URL<input value={form.foto_url} onChange={(e) => update('foto_url', e.target.value)} required /></label>
        <label>Instagram URL<input value={form.instagram_url} onChange={(e) => update('instagram_url', e.target.value)} /></label>
        <label>Facebook URL<input value={form.facebook_url} onChange={(e) => update('facebook_url', e.target.value)} /></label>
        <label>Estado<select value={form.estado} onChange={(e) => update('estado', e.target.value)}>{CONTENT_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
        <label className="check-label"><input type="checkbox" checked={form.destacado} onChange={(e) => update('destacado', e.target.checked)} /> Destacado</label>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
      </form>
    </main>
  );
}
