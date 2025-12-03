import React from 'react'

export default function NumberComponent({placeholder , value}) {
  return (
    <input type="number" className="form-control" value={value} placeholder={placeholder} required />
  )
}
