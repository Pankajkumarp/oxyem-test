import React from 'react'

export default function CommanButton({btntype, label, customclass}) {
  return (
    <button type={btntype} className={`btn ${customclass} mb-2 ms-2`}>
      {label}
    </button>
  )
}
