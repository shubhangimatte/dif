interface AlertProps {
  type?: string
  message?: string
  onClose?: () => void
}

export default function Alert({ type = 'success', message, onClose }: AlertProps) {
  if (!message) return null
  return (
    <div className={`alert alert-${type}`}>
      <i className="material-icons">{type === 'success' ? 'check_circle' : 'error_outline'}</i>
      <span><strong>{type === 'success' ? 'Success!' : 'Error!'}</strong> {message}</span>
      {onClose && (
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: .6 }}>×</button>
      )}
    </div>
  )
}
