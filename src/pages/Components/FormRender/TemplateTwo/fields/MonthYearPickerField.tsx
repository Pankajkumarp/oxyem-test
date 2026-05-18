"use client";

import React, { useRef , useEffect} from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FaRegCalendarAlt } from "react-icons/fa";
import { getDateValidationRules } from "./getDateValidationRules";

export default function MonthYearPickerField({
  field,
  control,
  errors,
  setValue
}: any) {
  useEffect(() => {
  if (field.value) {
    setValue(field.name, field.value);
  }
}, [field.value]);
  const datePickerRef = useRef<any>(null);

  const handleIconClick = () => {
    if (field.readonly) return;
    datePickerRef.current.setFocus();
  };

  return (
    <div className={`single-field col-md-${field.col}`}>
      <label className="text-sm font-medium">
        {field.label}
        {field.validations?.length && (
          <span className="error-label-icon">*</span>
        )}
      </label>

      <div className="custom-calender-oxyem">
        <Controller
          name={field.name}
          control={control}
          rules={getDateValidationRules(field)}
          render={({ field: controllerField }) => (
            <DatePicker
              ref={datePickerRef}
              selected={
                controllerField.value
                  ? new Date(controllerField.value)
                  : null
              }

              onChange={(date: Date | null) => {
                if (!date) {
                  controllerField.onChange(null);
                } else {
                  // ⭐ store only month-year
                  controllerField.onChange(
                    format(date, "yyyy-MM")
                  );
                }
              }}

              showMonthYearPicker
              dateFormat="MM-yyyy"
              placeholderText={field.placeholder}
              portalId="datepicker-portal"
              className={`w-full border rounded px-3 py-2
                ${errors[field.name] ? "border-red-500" : ""}`}
            />
          )}
        />

        <span
          className="oxyem-date-icon"
          onClick={handleIconClick}
        >
          <FaRegCalendarAlt />
        </span>
      </div>

      {errors[field.name] && (
        <p className="template-one-form-error-maessage">
          {errors[field.name].message}
        </p>
      )}
    </div>
  );
}
