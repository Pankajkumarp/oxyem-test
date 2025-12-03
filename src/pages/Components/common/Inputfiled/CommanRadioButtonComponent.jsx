import React, { useState, useEffect } from 'react';

export default function CommanRadioButtonComponent({ value, placeholder, options,isDisabled, onChange }) {
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
    };
    const [textData, settextData] = useState(value);
    useEffect(() => {
        settextData(value);
    }, [value]);
    return (
        <div className='cust_radi0_bt'>
            <div className='lab_text_main'>{placeholder}</div>
            <div className='option_type_all'>
                {options.map((option) => (
                    <div className="oxyem-form-radio" key={option.id}>
                        <input
                            type="radio"
                            name={option.id}
                            value={option.value}
                            checked={option.value === textData}
                            onChange={handleInputChange}
                            className="form-check-input"
                            disabled={isDisabled}
                        />
                        <span className="form-check-label">
                            {option.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

