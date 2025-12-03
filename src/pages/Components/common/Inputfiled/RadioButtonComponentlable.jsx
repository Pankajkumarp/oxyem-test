import React from 'react'
import LabelNormal from '../Label/LabelNormal';
import LabelMandatory from '../Label/LabelMandatory';
export default function RadioButtonComponentlable({ label, id, isDisabled, options, value, validations = [], onChange }) {
    const isRequired = validations.some(validation => validation.type === "required");
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue); // Notify parent component about value change
    };
    return (
        <>
            {isRequired ? <LabelMandatory labelText={label}/> : <LabelNormal labelText={label}/> }
            <div className='labe_field_radio_btn'>
                {options.map((option, index) => (
                    <div className="oxyem-form-radio" key={index}>
                        <input
                            type="radio"
                            name={id}
							disabled={isDisabled}
                            value={option.name} // Use option.name to differentiate each radio button
                            checked={option.name === value} // Check against option.name
                            onChange={handleInputChange}
                            className="form-check-input"
                        />
                        <span className="form-check-label">
                            {option.label}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}

