export function ConfirmButton({ children, message, onConfirm, className = 'btn btn-danger', disabled }) {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={() => {
        if (window.confirm(message)) onConfirm();
      }}
    >
      {children}
    </button>
  );
}
