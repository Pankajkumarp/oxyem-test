import React from 'react'

export default function ButtonPrimary({btntype,label}) {
  return (
    <button type={btntype} className="btn btn-primary mb-2 ms-2" >{label}</button>
  )
}
