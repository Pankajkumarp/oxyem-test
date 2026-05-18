import Image from "next/image";

export default function EmptyInfoBlock({
  title,
  description,
  buttonText,
  icon,
  onButtonClick,
}) {
  return (
    <div className="text-center py-3">
      {/* Image */}
      {/* {imageSrc && (
        <div className="d-flex justify-content-center mb-3">
          <Image
            src={imageSrc}
            // alt={title}
            width={80}
            height={80}
          />
        </div>
      )} */}
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
