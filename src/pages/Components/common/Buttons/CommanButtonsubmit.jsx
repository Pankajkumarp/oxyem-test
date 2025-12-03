import React from 'react'

export default function CommanButtonsubmit({btntype, label, customclass , handleSubmit}) {
  return (
    <button type={btntype} className={`btn ${customclass} mb-2 ms-2`} onSubmit={handleSubmit}>
      {label}
    </button>
  )
}
