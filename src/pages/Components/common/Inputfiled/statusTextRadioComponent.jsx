import React, { useState, useEffect } from 'react';
import authenticatedRequest from '../../../Auth/authenticatedRequest.jsx';
export default function StatusTextRadioComponent({ options, value = '', name, onChange, isDisabled, label, placeholder, validations, documentType, pagename }) {
  const [selectedValue, setSelectedValue] = useState(value);
  const [valueOptions, setValueOptions] = useState([]);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await authenticatedRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/getGoalsValues`,
          params: {
            isFor: documentType
          }
        });
        const optionsData = response.data.data.map((item) => ({
          name: item.name,
          value: item.id,
          text: item.text,
        }));
        if (pagename === "performGoalName" && documentType === "Goal_Level_Types") {
          const filteredOptionsData = optionsData.filter((item) => item.value !== "b1e4e384-24da-4cfb-9cf9-7d079ca5b41f");
          setValueOptions(filteredOptionsData);
        } else {
          setValueOptions(optionsData);
        }
      } catch (error) {

        //setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, []);
  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`custom_status_dropdown_t ${pagename === "performGoalName" && documentType === "Goal_Level_Types" ? "new_change_label" : ""}`}>
      <p className='oxyem_radio_btn_label_text'>{label}</p>
      <div className="custom_status_dropdown_text">
        {valueOptions.map((option, index) => {
          const isActive = selectedValue === option.value;
          return (
            <div
              className={`form-dropdown-field ${isActive ? 'active_box' : ''}`}
              key={index}
            >
              <input
                className="form-check-input"
                type="checkbox"
                name={name}
                id={`check-${option.value}`}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={handleChange}
				disabled={isDisabled}
              />
              <label htmlFor={`check-${option.value}`}></label>
              <div className="form-check-label">
                <span
                  className="form-check-text-r"
                  htmlFor={`check-${option.value}`}
                >
                  {option.name}
                </span>
                <p
                  className="form-check-sub-text"
                  htmlFor={`check-${option.value}`}
                >
                  {option.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
