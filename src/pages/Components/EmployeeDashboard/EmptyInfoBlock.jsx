export default function EmptyInfoBlock({
  title,
  description,
  buttonText,
  icon,
  onButtonClick,
}) {
  return (
    <div className="text-center py-3">
      {icon && <div className="relative">{icon}</div>}

      {/* Title */}
      {title && <h6 className="fw-semibold mb-2">{title}</h6>}

      {/* Description */}
      {description && (
        <p className="text-muted mb-4">{description}</p>
      )}

      {/* Button */}
      {buttonText && onButtonClick && (
        <button
          className="btn btn-primary btn-sm px-4"
          onClick={onButtonClick}
        >
          + {buttonText}
        </button>
      )}
    </div>
  );
}
