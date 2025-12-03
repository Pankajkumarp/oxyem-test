import React from 'react';
export default function RadioButtonComponentLabel({
    label = '',
    id = '',
    isDisabled = false,
    options = [],
    value = '',
    validations = [],
    onChange = () => {},
}) {
    
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue); 
    };

    return (
        <>
            <div className="labe_field_radio_btn">
            <span style={{ padding: '7px', fontWeight: '600' }}>{label}</span>
                {options.map((option, index) => (
                    <div className="oxyem-form-radio" key={`${id}-${index}`}>
                        <input
                            type="checkbox"
                            name={id}
                            disabled={isDisabled}
                            value={option.value} 
                            checked={option.value === value}
                            onChange={handleInputChange}
                            className="form-check-input"
                        />
                        <span className="form-check-label">{option.name}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
