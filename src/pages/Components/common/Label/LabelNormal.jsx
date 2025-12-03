import React from 'react'

export default function LabelNormal({labelText ,disabled}) {
  return (
    <label for="useremail" className={`form-label ${disabled ? 'label-disabled' : ''}`}>
      {labelText}
    </label>

  )
}
