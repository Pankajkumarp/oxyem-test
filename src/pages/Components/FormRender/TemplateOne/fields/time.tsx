/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  forwardRef,
  useEffect,
  useState,
} from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Controller } from "react-hook-form";

import { FiClock } from "react-icons/fi";

import { getValidationRules } from "./validation";
import { axiosJWT } from "../../../../Auth/AddAuthorization";

interface Props {
  field: any;
  control: any;
  errors: any;
  idEmployee?: string;
  startTime?: string;
  endTime?: string;
}

/* =========================
   CUSTOM INPUT
========================= */

const CustomTimeInput = forwardRef<
  HTMLButtonElement,
  any
>(({ value, onClick }, ref) => (
  <button
    type="button"
    className="custom-time-wrapper custom-time-input w-full border rounded px-3 py-2"
    onClick={onClick}
    ref={ref}
  >
    <span
      className={`custom-time-text ${value ? "" : "placeholder"
        }`}
    >
      {value || "Select time"}
    </span>

    <FiClock className="time-icon" />
  </button>
));

CustomTimeInput.displayName = "CustomTimeInput";

/* =========================
   COMPONENT
========================= */

export default function TimeInput({
  field,
  control,
  errors,
  idEmployee,
  startTime,
  endTime
}: Readonly<Props>) {
  const [shiftError, setShiftError] =
    useState("");

  useEffect(() => {
    if (idEmployee) {
      setShiftError("");
    }
  }, [idEmployee]);
  return (
    <div className={`single-field col-md-${field.col}`}>
      {/* LABEL */}
      <label className="text-sm font-medium">
        {field.label}

        {field.validations?.length ? (
          <span className="error-label-icon">*</span>
        ) : (
          ""
        )}
      </label>

      {/* TIME PICKER */}
      <Controller
        name={field.name}
        control={control}
        rules={getValidationRules(field)}
        render={({ field: controllerField }) => (
          <div className="time-picker-row">
            <DatePicker
              selected={controllerField.value}
              onChange={(date: Date | null) => {
                if (!date) return;

                // END TIME VALIDATION
                if (field.name === "endTime" && startTime) {
                  const start = new Date(startTime);

                  if (date.getTime() < start.getTime()) {
                    setShiftError("End time cannot be less than start time");
                    return;
                  }
                }

                // START TIME VALIDATION
                if (field.name === "startTime" && endTime) {
                  const end = new Date(endTime);

                  if (date.getTime() > end.getTime()) {
                    setShiftError("Start time cannot be greater than end time");
                    return;
                  }
                }

                setShiftError("");
                controllerField.onChange(date);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={2}
              timeCaption="Time"
              dateFormat="hh:mm aa"
              customInput={<CustomTimeInput />}
            />
            {field.showButton ? (
              <>
                {field.buttonType === "current" ? (
                  <button
                    type="button"
                    className="now-btn"
                    onClick={() => {
                      const now = new Date();

                      // START TIME VALIDATION
                      if (field.name === "startTime" && endTime) {
                        const end = new Date(endTime);

                        if (now.getTime() > end.getTime()) {
                          setShiftError("Start time cannot be greater than end time");
                          return;
                        }
                      }

                      // END TIME VALIDATION
                      if (field.name === "endTime" && startTime) {
                        const start = new Date(startTime);

                        if (now.getTime() < start.getTime()) {
                          setShiftError("End time cannot be less than start time");
                          return;
                        }
                      }

                      setShiftError("");
                      controllerField.onChange(now);
                    }}
                  >
                    Now
                  </button>
                ) : null}
                {field.buttonType === "endShift" ? (
                  <button
                    type="button"
                    className="now-btn"
                    onClick={async () => {
                      if (!idEmployee) {
                        setShiftError(
                          "Employee is required to get shift details"
                        );
                        return;
                      }
                      setShiftError("");
                      try {
                        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                        const response = await axiosJWT.get(`${apiUrl}/getUserShift`, {
                          params: { idEmployee: idEmployee },
                        });

                        const apiData = response?.data?.data;

                        if (apiData?.endTime) {
                          const today = new Date();

                          // Normalize string
                          const endTime = apiData.endTime.trim().toUpperCase();

                          // Extract hours, minutes, am/pm
                          const match = endTime.match(/(\d+):(\d+)\s*(AM|PM)/);

                          if (match) {
                            const [, hours, minutes, modifier] = match;

                            let hrs = parseInt(hours, 10);

                            if (modifier === "PM" && hrs !== 12) {
                              hrs += 12;
                            }

                            if (modifier === "AM" && hrs === 12) {
                              hrs = 0;
                            }

                            today.setHours(hrs, parseInt(minutes, 10), 0);
                            if (startTime) {
                              const start = new Date(startTime);

                              if (today.getTime() < start.getTime()) {
                                setShiftError("End time cannot be less than start time");
                                return;
                              }
                            }
                            setShiftError("");

                            controllerField.onChange(today);
                          }
                        }
                      } catch (error) {
                        console.error(
                          "Time fetch failed",
                          error
                        );
                      }
                    }}
                  >
                    Use Shift End
                  </button>
                ) : null}
              </>) : null}
          </div>
        )}
      />
      {shiftError && (
        <p className="template-one-form-error-maessage">
          {shiftError}
        </p>
      )}
      {errors[field.name] && (
        <p className="template-one-form-error-maessage">
          {errors[field.name].message}
        </p>
      )}
      <style>{`.react-datepicker, .react-datepicker-popper, .react-datepicker__month-container{min-width: auto;} .custom-time-wrapper{background:transparent;width:100%;justify-content: space-between;
    display: flex;align-items: center;} .custom-time-wrapper .placeholder{ background-color: transparent;} .time-picker-row {display: flex;gap: 7px;}.now-btn{background: #004d95;border:none;border-radius: 7px;text-align:center;height: 40px;line-height: 1.65;display: flex;font-size: 12.2px;min-width:max-content;padding:10px 15px;color: #fff;font-weight:400;opacity:.85;
}.now-btn:hover{opacity:1;}`}</style>
    </div>
  );
}

