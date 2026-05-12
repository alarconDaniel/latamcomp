export function StatusBadge({ value }) {
  const label = value || 'sin_estado';
  return <span className={`status-badge status-${label}`}>{label.replace('_', ' ')}</span>;
}
