/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosJWT } from '../../../../Auth/AddAuthorization';
import { format } from 'date-fns';
import { FaRegCalendarAlt } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { getDateValidationRules } from "./getDateValidationRules";

export default function DatePickerField({ field, control, errors, leaveType, startDate, isPage, idEmployee, setValue }: any) {
  useEffect(() => {
  if (field.value) {
    setValue(field.name, field.value);
  }
}, [field.value]);
  const isToDateDisabled =
    field.name === "toDate" && leaveType === "Birthday";
  const STORAGE_KEY = "HOLIDAYS_CACHE_V1";
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hrs
  const [days, setDays] = useState([]);
  const datePickerRef = useRef(null);
  const [leaveDays, setLeaveDays] = useState([]);
  const normalizeLeaveStatus = (status: string) => {
  if (!status) return "default";

  const s = status.toLowerCase();

  if (s === "holiday") return "holiday";

  if (
    s.includes("leave") ||
    s.includes("birthday") ||
    s.includes("earned") ||
    s.includes("lossofpay")
  ) {
    return "leave";
  }

  return "default";
};
const fetchLeaveInfo = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (isPage === "admin" && !idEmployee) return;

    const params =
      isPage === "admin"
        ? { idEmployee }
        : {};

    const response = await axiosJWT.get(
      `${apiUrl}/leave/getDaysInfo`,
      { params }
    );

    if (response?.data?.data) {
      const formatted = response.data.data
        .filter((i) => i.date)
        .map((i) => ({
          date: i.date,
          status: normalizeLeaveStatus(i.status),
          showtext: i.showtext || i.reason || "Leave Applied",
          isselect: false
        }));

      setLeaveDays(formatted);
    }
  } catch (err) {
    console.error("Leave info fetch failed", err);
  }
};

useEffect(() => {
  if (days.length === 0) {
    fetchInfo();
  }

  if (field.leaveShow === true && leaveDays.length === 0) {
    fetchLeaveInfo();
  }
}, []);
useEffect(() => {

  if (field.leaveShow === true) {
    fetchLeaveInfo();
  }
}, [idEmployee]);

  const convertHolidays = (fetchedData) => {
    return fetchedData.map(item => ({
      date: item.date,
      status: "holiday",
      showtext: item.name,
      isselect: false
    }));
  };
  const getCalendarConstraints = () => {
    let minDate: Date | undefined;
    let maxDate: Date | undefined;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    field.validations?.forEach((v: any) => {
      switch (v.type) {
        case "noFutureDate": {
          maxDate = new Date(today);
          const days = Number(v.checkVlaue ?? 0);
          maxDate.setDate(today.getDate() + days);
          break;
        }

        case "maxPastDays": {
          minDate = new Date(today);
          const days = Number(v.checkVlaue ?? 0);
          minDate.setDate(today.getDate() - days);
          break;
        }
      }
    });

    return { minDate, maxDate };
  };


  const fetchInfo = async () => {
    try {
      // 🔹 1. Try localStorage first
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_KEY);

        if (cached) {
          const { data, timestamp } = JSON.parse(cached);

          // check expiry
          if (Date.now() - timestamp < CACHE_TTL) {
            const formattedHolidays = convertHolidays(data);
            setDays(formattedHolidays);
            return; // ✅ stop here
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }

      // 🔹 2. Fallback to API
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(
        `${apiUrl}/holiday`,
        { params: { isFor: "year" } }
      );

      if (response.status === 200 && response.data.data) {
        const fetchedData = response.data.data;

        // save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              data: fetchedData,
              timestamp: Date.now()
            })
          );
        }

        const formattedHolidays = convertHolidays(fetchedData);
        setDays(formattedHolidays);
      }
    } catch (error) {
      console.error("Holiday fetch failed", error);
    }
  };
  const handleIconClick = () => {
    if (field.readonly) return;
    datePickerRef.current.setFocus();
  };
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };
    const mergedDays = React.useMemo(() => {
  const map = new Map();

  [...days, ...leaveDays].forEach((item) => {
    map.set(item.date, item); // leave overrides holiday
  });

  return Array.from(map.values());
}, [days, leaveDays]);
  const status = {
    present: {
      labelStyle: { backgroundColor: 'green', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
    holiday: {
      labelStyle: { backgroundColor: '#e0dfdf', color: '#000000', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
    leave: {
      labelStyle: { backgroundColor: '#fc7171', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
    default: {
      labelStyle: { backgroundColor: 'gray', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
  };
  const renderDayContents = (day, date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayInfo = mergedDays.find(d => d.date === formattedDate);
    if (dayInfo) {
      const { labelStyle } = status[dayInfo.status] || status.default;
      return (
        <span data-tip={dayInfo.status} style={labelStyle} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={dayInfo.showtext}>
          {day}
          <Tooltip id="my-tooltip-datatable" />
        </span>
      );
    }
    return <span>{day}</span>;
  };
  useEffect(() => {
    if (days.length === 0) {
      fetchInfo();
    }
  }, []);
const isHoliday = (date: Date) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  return mergedDays.some(
    (d) => d.date === formattedDate && d.status === "holiday"
  );
};


  const { minDate, maxDate } = getCalendarConstraints();
const normalizedStartDate = startDate
  ? new Date(startDate + "T00:00:00")
  : null;
const isLeaveDay = (date: Date) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  return mergedDays.some(
    (d) => d.date === formattedDate && d.status === "leave"
  );
};

const filterSelectableDate = (date: Date) => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  if (
    field.requiredStartDate &&
    normalizedStartDate &&
    current < normalizedStartDate
  ) {
    return false; // ❌ previous dates blocked
  }

  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
if (field.weakend !== "no" && isWeekend(date)) return false;
  if (isHoliday(date)) return false;
 if (isLeaveDay(date)) return false;
  return true;
};
useEffect(() => {
  if (!startDate || !field.value) return;

  if (
    field.name === "invoiceEndDate" ||
    field.name === "invoiceDueDate"
  ) {
    const start = new Date(startDate + "T00:00:00");
    const current = new Date(field.value + "T00:00:00");

    if (start > current) {
      setValue(field.name, null);
    }
  }
}, [startDate, field.value]);
  return (
    <div className={`single-field col-md-${field.col}`}>
      <label className="text-sm font-medium">
        {field.label} {field.validations?.length ? <span className="error-label-icon">*</span> : ""}
      </label>
      <div className='custom-calender-oxyem'>
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
                  controllerField.onChange(format(date, "yyyy-MM-dd"));
                }
              }}
              dateFormat="dd-MM-yyyy"
              placeholderText={field.placeholder}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={85}
              showMonthDropdown
              portalId="datepicker-portal"
              className={`w-full border rounded px-3 py-2
      ${errors[field.name] ? "border-red-500" : ""}`}
              renderDayContents={renderDayContents}
              filterDate={filterSelectableDate}
              disabled={isToDateDisabled}
            />
          )}
        />
        <span className='oxyem-date-icon' onClick={handleIconClick}><FaRegCalendarAlt /></span>
      </div>
      {errors[field.name] && (
        <p className="template-one-form-error-maessage">
          {errors[field.name].message}
        </p>
      )}
    </div>
  );
}
