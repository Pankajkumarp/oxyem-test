/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type CheckbokwithInputProps = {
  field: any;
  value: Record<string, number>;
  setValue: (name: string, val: any) => void;
  errors?: Record<string, string>;
  isDisable?: boolean;
};

export default function CheckbokwithInput({
  field,
  value = {},
  setValue,
  errors = {},
  isDisable = false
}: Readonly<CheckbokwithInputProps>) {
  const handleCheck = (option: string, checked: boolean) => {
    const newVal = { ...value };
    if (checked) {
      newVal[option] = 1; // default value
    } else {
      delete newVal[option]; // remove option if unchecked
    }
    setValue(field.name, newVal);
  };

  const handleInputChange = (option: string, val: number) => {
  const safeValue = Number.isNaN(val) || val < 1 ? 1 : val;
  setValue(field.name, { ...value, [option]: safeValue });
};


  return (
    <div className="toggle-switch-group">
      {field.options.map((opt: string) => {
        const checked = value?.[opt] !== undefined;
        return (
          <div key={opt} className="form-toggle-switch-item">
            <label className="form-toggle-switch">
            <input
              type="checkbox"
              checked={checked}
              disabled={isDisable}
              onChange={(e) => handleCheck(opt, e.target.checked)}
            />
            <span className="slider"></span>
            </label>
            <span className="form-toggle-lable">{opt}</span>

            {checked && (
  <input
    type="number"
    min={1}
    step={1}
    value={value[opt]}
    disabled={isDisable}
    onChange={(e) =>
      handleInputChange(opt, Number(e.target.value))
    }
    onBlur={(e) => {
      if (Number(e.target.value) < 1) {
        handleInputChange(opt, 1);
      }
    }}
    placeholder="Enter days"
    className="input form-control mb-0 mt-2"
  />
)}


            {errors?.[opt] && (
              <span className="error">{errors[opt]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
