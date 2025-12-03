import React from 'react'

export default function CheckboxComponent({lableText}) {
  return (
    <div className="row pt-2">
        <div className="col">
          <label>{lableText}</label>

          <div className="form-check form-check-inline" style={{ marginLeft: "12px" }}>
            <input className="form-check-input" type="checkbox" />
            <label className="form-check-label" > Yes </label>
          </div>

          <div className="form-check form-check-inline" style={{ marginLeft: "5px" }}>
            <input
              className="form-check-input"
              type="checkbox"
            />
            <label className="form-check-label" > No </label>
          </div>
        </div>
      </div>
  )
}
