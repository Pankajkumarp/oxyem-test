import React from 'react'

export default function LabelMandatory({labelText}) {
  return (
    <label>{labelText} <span className="login-danger">*</span></label>
  )
}
