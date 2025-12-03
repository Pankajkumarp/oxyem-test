import React, { useState } from 'react';

export default function CheckboxComponent({ labelwithtags, options, value = [], name, onChange, label ,validations }) {
  const [selectedValues, setSelectedValues] = useState(value);

  const handleChange = (event) => {
    const newValue = event.target.value;
    let updatedValues;

    if (selectedValues.includes(newValue)) {
      // If the checkbox is already checked, remove it from the selected values
      updatedValues = selectedValues.filter(val => val !== newValue);
    } else {
      // If the checkbox is not checked, add it to the selected values
      updatedValues = [...selectedValues, newValue];
    }

    setSelectedValues(updatedValues);
    onChange(updatedValues);
  };

  return (
    <>
      <span style={{ padding: '', fontWeight: '600' }}>{label}</span>
      {options.map((option, index) => (
        <div className="form-check form-check-inline mt-3" key={index}>
          <input
            className="form-check-input"
            type="checkbox"
            name={name}
            id={`${name}-${index}`}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={handleChange}
          />
            {/* {option.name} */}
            {labelwithtags == true ?(
          <span className="form-check-label-signup" dangerouslySetInnerHTML={{ __html: option.name }} htmlFor={`${name}-${index}`}  />

            ):
            (
          <span className="form-check-label" htmlFor={`${name}-${index}`} style={{ position: 'relative', top: '0', left: '0' }}>
{option.name}</span>
            )
            
              
            }
        </div>
      ))}
    </>
  );
}
