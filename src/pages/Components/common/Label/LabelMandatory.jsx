import React from 'react'

export default function LabelMandatory({labelText ,disabled}) {
  return (
    
    <label className={`form-label ${disabled ? 'label-disabled' : ''}`}>{labelText} <span className="login-danger">*</span></label>
  )
}
