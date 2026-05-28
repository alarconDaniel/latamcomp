import { useEffect, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { testimoniosApi } from '../../api/testimonios.api.js';
import { paisesApi } from '../../api/paises.api.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ConfirmButton } from '../../components/common/ConfirmButton.jsx';
import { CONTENT_STATES, canDeleteContent } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';
import { useAuth } from '../../hooks/useAuth.js';
import { navigate } from '../../routes/navigation.js';
import { motion } from 'framer-motion';
import { useCountry } from '../../hooks/useCountry.js';

const apiByType = {
  noticias: noticiasApi,
  testimonios: testimoniosApi,
};

const labels = {
  noticias: { title: 'Noticias', newPath: '/admin/noticias/nueva', editBase: '/admin/noticias' },
  testimonios: { title: 'Testimonios', newPath: '/admin/testimonios/nuevo', editBase: '/admin/testimonios' },
};

export function ContentListPage({ type }) {
  const api = apiByType[type];
  const label = labels[type];
  const { user } = useAuth();
  const { activeCountry } = useCountry();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ estado: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    // Solo enviamos estado si tiene valor - el backend filtra el país por token JWT
    const query = {};
    if (filters.estado) query.estado = filters.estado;
    
    api.getAll(query)
      .then((response) => setItems(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [type, filters.estado, activeCountry?.id]);


  const remove = async (id) => {
    await api.remove(id);
    load();
  };

  const changeState = async (item, estado) => {
    await api.update(item.id, { estado });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-sm font-semibold text-[#7A0A83] tracking-wide uppercase mb-1">Contenido</p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{label.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83] focus:border-transparent outline-none shadow-sm transition-all"
            value={filters.estado} 
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          >
            <option value="">Todos los estados</option>
            {CONTENT_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
          <button 
            className="px-6 py-2.5 bg-[#7A0A83] text-white font-semibold rounded-xl shadow-lg shadow-[#7A0A83]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            onClick={() => navigate(label.newPath)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear
          </button>
        </div>
      </div>
      
      <ErrorState message={error} />
      
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState /> : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-semibold">
                  <th className="py-4 px-6 whitespace-nowrap">{type === 'noticias' ? 'Título' : 'Nombre'}</th>
                  <th className="py-4 px-6 whitespace-nowrap">País</th>
                  <th className="py-4 px-6 whitespace-nowrap">Estado</th>
                  <th className="py-4 px-6 whitespace-nowrap">Fecha</th>
                  <th className="py-4 px-6 whitespace-nowrap text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 group-hover:text-[#7A0A83] transition-colors">{item.titulo || item.nombre}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{item.pais_nombre || item.paises?.nombre || 'General'}</td>
                    <td className="py-4 px-6"><StatusBadge value={item.estado} /></td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{formatDate(item.fecha_publicacion || item.created_at)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button 
                        className="px-3 py-1.5 text-sm font-medium text-[#7A0A83] bg-[#7A0A83]/10 hover:bg-[#7A0A83]/20 rounded-lg transition-colors"
                        onClick={() => navigate(`${label.editBase}/${item.id}/editar`)}
                      >
                        Editar
                      </button>
                      <button 
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        onClick={() => changeState(item, item.estado === 'publicado' ? 'despublicado' : 'publicado')}
                      >
                        {item.estado === 'publicado' ? 'Despublicar' : 'Publicar'}
                      </button>
                      {canDeleteContent(user?.rol) && (
                        <ConfirmButton 
                          message={`¿Eliminar ${label.title.toLowerCase()}?`} 
                          onConfirm={() => remove(item.id)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Eliminar
                        </ConfirmButton>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
