import React from 'react'

export default function LabelNormal({labelText ,disabled}) {
  return (
    <label htmlFor="useremail" className={`form-label ${disabled ? 'label-disabled' : ''}`}>
      {labelText}
    </label>

  )
}
