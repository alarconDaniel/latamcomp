export const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value));
};
