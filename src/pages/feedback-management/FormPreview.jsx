import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Select from 'react-select';

export default function FormPreview({ data }) {
  const { title, fields } = data;

  const selectStyles = {
    control: (base, { isDisabled }) => ({
      ...base,
      backgroundColor: isDisabled ? '#e9ecef' : 'white',
      cursor: isDisabled ? 'not-allowed' : 'default',
    }),
    placeholder: base => ({ ...base, color: '#6c757d' }),
  };

   const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  

  return (
    <div className="">
      <h3 className="mb-4">{title}</h3>
      <form>
        {fields.map((f, i) => (
          <div key={i} className="mb-4">
            <label className="form-label">
              {f.label}{f.required && <span className="text-danger"> *</span>}
            </label>

            {['text', 'number'].includes(f.type) && (
              <input type={f.type} className="form-control" readOnly />
            )}

            {f.type === 'date' && (
              <input type="date" className="form-control" disabled />
            )}

            {f.type === 'textarea' && (
               <textarea 
          placeholder={''}
          value = {''}
          className="form-control feedback-textarea"
        />
            )}

            {f.type === 'rating' && (
              <div>
                {[...Array(f.max || 5)].map((_, j) => (
                  <FaStar key={j} color="gold" className="me-1" size={20}/>
                ))}
              </div>
            )}

            {f.type === 'select' && (
              <Select
                options={f.options.map(o => ({ label: o, value: o }))}
                
                placeholder={`Select ${f.label}`}
                styles={selectStyles}
                isSearchable={false}
                value={null}
              />
            )}

            {f.type === 'singleCheckbox' && (
              <div>
                {f.options.map((opt, j) => (
                  <div className="form-check form-check-inline" key={j}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${i}-${j}`}
                      disabled
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`checkbox-${i}-${j}`}
                    >
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
}
