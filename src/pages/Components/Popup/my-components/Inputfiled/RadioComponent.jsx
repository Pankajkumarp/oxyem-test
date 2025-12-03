import React from 'react'

export default function RadioComponent({ id, options, value, onChange }) {
  return (
    <>
    {options.map((option, index) => (
        <div className="form-check" key={index}>
            <input
                type="radio"
                id={`${id}_${index}`}
                name={id}
                value={option.value}
                checked={option.value === value}
                onChange={() => onChange(option.value)}
                className="form-check-input"
            />
            <label htmlFor={`${id}_${index}`} className="form-check-label">
                {option.label}
            </label>
        </div>
    ))}
</>
  )
}
