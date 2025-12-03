import React from 'react'

export default function RadioComponent({ id, options, value, onChange }) {
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue); // Notify parent component about value change
    };

    return (
        <>

            {options.map((option, index) => (
                <div className="oxyem-form-radio" key={index}>
                    <input
                        type="radio"
                        name={id}
                        value={option.name} // Use option.name to differentiate each radio button
                        checked={option.name === value} // Check against option.name
                        onChange={handleInputChange}
                        className="form-check-input"
                    />
                    <span  className="form-check-label">
                        {option.label} 
                    </span>
                </div>
            ))}
            
        </>
    );
}

