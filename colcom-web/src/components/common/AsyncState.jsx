export function LoadingState({ label = 'Cargando datos...' }) {
  return <div className="async-state">{label}</div>;
}

export function ErrorState({ message }) {
  if (!message) return null;
  return <div className="alert alert-error">{message}</div>;
}

export function EmptyState({ title = 'Sin resultados', description = 'No hay datos para mostrar.' }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
