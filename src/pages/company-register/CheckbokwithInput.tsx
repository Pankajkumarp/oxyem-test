import React from "react";

type CheckbokwithInputProps = {
  field: any;
  value: Record<string, number>;
  setValue: (name: string, val: any) => void;
  errors?: Record<string, string>;
};

export default function CheckbokwithInput({
  field,
  value = {},
  setValue,
  errors = {},
}: CheckbokwithInputProps) {
  const handleCheck = (option: string, checked: boolean) => {
    const newVal = { ...value };
    if (!checked) {
      delete newVal[option]; // remove option if unchecked
    } else {
      newVal[option] = 0; // default value
    }
    setValue(field.name, newVal);
  };

  const handleInputChange = (option: string, val: number) => {
    const newVal = { ...value, [option]: val };
    setValue(field.name, newVal);
  };

  return (
    <div className="flex flex-col gap-3">
      {field.options.map((opt: string) => {
        const checked = value?.[opt] !== undefined;
        return (
          <div key={opt} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => handleCheck(opt, e.target.checked)}
            />
            <span className="w-32">{opt}</span>

            {checked && (
              <input
                type="number"
                min={1}
                value={value[opt]}
                onChange={(e) =>
                  handleInputChange(opt, Number(e.target.value))
                }
                placeholder="Enter days"
                className="border rounded px-2 py-1 w-24"
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
