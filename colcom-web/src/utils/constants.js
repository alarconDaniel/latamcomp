export const COUNTRY_SLUGS = ['colombia', 'chile', 'ecuador'];
export const CONTENT_STATES = ['borrador', 'publicado', 'despublicado'];
export const REQUEST_STATES = ['pendiente', 'en_proceso', 'gestionada', 'cerrada'];
export const CONTACT_PURPOSES = ['Servicio', 'Programa EDIFICA', 'Shows y conferencias'];

export const canDeleteContent = (role) => ['superadmin', 'admin_pais'].includes(role);
export const canManageRequests = (role) => ['superadmin', 'admin_pais'].includes(role);
export const canManageCountries = (role) => role === 'superadmin';
