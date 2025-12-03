import React from 'react'

export default function ButtonPrimary({btntype, label,onsubmit }) {
  return (
    <div className="sk-login-form-button">
    <button type={btntype} className="btn btn-primary btn-block" onsubmit={onsubmit} >{label}</button>
    </div>
  )
}
