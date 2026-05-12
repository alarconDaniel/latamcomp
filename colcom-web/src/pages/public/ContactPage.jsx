import { useEffect, useState } from 'react';
import { solicitudesApi } from '../../api/solicitudes.api.js';
import { useCountry } from '../../hooks/useCountry.js';
import { CONTACT_PURPOSES } from '../../utils/constants.js';

const initialForm = {
  pais_id: '',
  nombre: '',
  correo: '',
  telefono: '',
  finalidad: '',
  mensaje: '',
};

export function ContactPage() {
  const { countries, activeCountry } = useCountry();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeCountry?.id) {
      setForm((current) => ({ ...current, pais_id: current.pais_id || activeCountry.id }));
    }
  }, [activeCountry?.id]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) nextErrors.correo = 'Ingresa un correo valido.';
    if (!form.telefono.trim()) nextErrors.telefono = 'El telefono es obligatorio.';
    if (!form.finalidad) nextErrors.finalidad = 'Selecciona una finalidad.';
    if (!form.pais_id) nextErrors.pais_id = 'Selecciona un pais.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await solicitudesApi.createPublic({ ...form, pais_id: Number(form.pais_id) });
      setStatus('Solicitud enviada correctamente.');
      setForm({ ...initialForm, pais_id: activeCountry?.id || '' });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell contact-layout">
      <div className="page-title">
        <p className="eyebrow">Contacto</p>
        <h1>Conversemos sobre tu solicitud</h1>
        <p>El equipo del pais seleccionado recibira la informacion para gestionarla.</p>
      </div>
      <form className="form-panel" onSubmit={submit}>
        <label>Nombre<input value={form.nombre} onChange={(e) => update('nombre', e.target.value)} /></label>
        {errors.nombre && <small>{errors.nombre}</small>}
        <label>Correo<input value={form.correo} onChange={(e) => update('correo', e.target.value)} /></label>
        {errors.correo && <small>{errors.correo}</small>}
        <label>Telefono<input value={form.telefono} onChange={(e) => update('telefono', e.target.value)} /></label>
        {errors.telefono && <small>{errors.telefono}</small>}
        <label>Finalidad
          <select value={form.finalidad} onChange={(e) => update('finalidad', e.target.value)}>
            <option value="">Seleccionar</option>
            {CONTACT_PURPOSES.map((purpose) => <option key={purpose} value={purpose}>{purpose}</option>)}
          </select>
        </label>
        {errors.finalidad && <small>{errors.finalidad}</small>}
        <label>Pais
          <select value={form.pais_id} onChange={(e) => update('pais_id', e.target.value)}>
            <option value="">Seleccionar</option>
            {countries.map((country) => <option key={country.id} value={country.id}>{country.nombre}</option>)}
          </select>
        </label>
        {errors.pais_id && <small>{errors.pais_id}</small>}
        <label>Mensaje<textarea value={form.mensaje} onChange={(e) => update('mensaje', e.target.value)} rows="5" /></label>
        {status && <div className={status.includes('correctamente') ? 'alert alert-success' : 'alert alert-error'}>{status}</div>}
        <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar solicitud'}</button>
      </form>
    </main>
  );
}
