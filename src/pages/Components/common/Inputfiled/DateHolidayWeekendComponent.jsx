"use client";
import React, { useState, useEffect, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { format } from 'date-fns';
import { FaRegCalendarAlt } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { axiosJWT } from '../../../Auth/AddAuthorization';


const DateHolidayWeekendComponent = ({ placeholder, readonly, isDisabled, label, value, validations = [], onChange, otherAttributes, projectStartDate, projectEndDate, isModule, startDateValue, name }) => {
  const projectMinDate =
  projectStartDate ? new Date(projectStartDate) : null;

const projectMaxDate =
  projectEndDate ? new Date(projectEndDate) : null;

  const selectedStartDate =
  startDateValue ? new Date(startDateValue) : null;

  const [days, setDays] = useState([]);
  const [startDate, setStartDate] = useState(
  value ? new Date(value) : null
);
const convertHolidays = (fetchedData) => {
  return fetchedData.map(item => ({
    date: item.date,
    status: "holiday",
    showtext: item.name,
    isselect: false
  }));
};
const STORAGE_KEY = "HOLIDAYS_CACHE_V1";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hrs

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

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

useEffect(() => {
  if (days.length === 0) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInfo();
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  const isRequired = validations.some(validation => validation.type === "required");
  const datePickerRef = useRef(null);
  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
setStartDate(value ? new Date(value) : null);
}, [value]);

  const handleDateChange = (date) => {
    if (readonly) return;
    let formattedDate = '';
    try {
      const dateObject = new Date(date);
      if (!isNaN(dateObject.getTime())) {
        formattedDate = format(dateObject, 'yyyy-MM-dd');
      } else {
        console.log('Invalid date');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
    setStartDate(date);
    onChange(formattedDate);
  };

  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() );
  
const currentYear = new Date().getFullYear();
const minYear = currentYear - 85;
const maxYear = currentYear + 5;

let maxDate = new Date(`${maxYear}-12-31`);
let minDate = new Date(`${minYear}-01-01`);
const isEndDateField =
  typeof name === "string" &&
  name.toLowerCase().includes("enddate");
// 🔹 AssignTaskNew → project date range
if (
  isModule === "AssignTaskNew" &&
  projectMinDate &&
  projectMaxDate
) {
  minDate = projectMinDate;
  maxDate = projectMaxDate;
}

// 🔹 End Date should not be before Start Date
if (isEndDateField && selectedStartDate && selectedStartDate > minDate) {
  minDate = selectedStartDate;
}


// 🔹 fallback attributes (DOB etc.)
if (
  isModule !== "AssignTaskNew" &&
  Array.isArray(otherAttributes) &&
  otherAttributes.length > 0
) {
  for (const attribute of otherAttributes) {
    if (attribute.maxDate === true) {
      maxDate = today;
      break;
    } else if (attribute.minDate === true) {
      minDate = new Date(tomorrow);
      break;
    }
  }
}

  const handleIconClick = () => {
    if (readonly) return;
    datePickerRef.current.setFocus();
  };
  const status = {
    present: {
      labelStyle: { backgroundColor: 'green', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
    Leave: {
      labelStyle: { backgroundColor: 'red', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
	LossOfPay: {
      labelStyle: { backgroundColor: 'red', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
    BirthdayLeave: {
      labelStyle: { backgroundColor: '#735DA5', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
    holiday: {
      labelStyle: { backgroundColor: '#e0dfdf', color: '#000000', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
    EarnedLeave: {
      labelStyle: { backgroundColor: '#F96167', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
    default: {
      labelStyle: { backgroundColor: 'gray', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
    },
  };

  const renderDayContents = (day, date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayInfo = days.find(d => d.date === formattedDate);
    if (dayInfo) {
      const { labelStyle } = status[dayInfo.status] || status.default;
      return (
        <span data-tip={dayInfo.status} style={labelStyle} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={dayInfo.showtext}>
          {day}
          <Tooltip id="my-tooltip-datatable" type='dark' effect='solid'  style={{ minWidth: '50px', zIndex: '999', backgroundColor:'#73605B' }}/>
        </span>
      );
    }
    return <span>{day}</span>;
  };

  const isDaySelectable = (date) => {
    if (isWeekend(date)) {
    return false;
  }
  if (
    isModule === "AssignTaskNew" &&
    projectMinDate &&
    projectMaxDate
  ) {
    if (date < projectMinDate || date > projectMaxDate) {
      return false;
    }
  }
  if (isEndDateField && selectedStartDate && date < selectedStartDate) {
    return false;
  }
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayInfo = days.find(d => d.date === formattedDate);
    if (dayInfo && !dayInfo.isselect) {
      return false;
    }
    return true;
  };

  function isValidDate(d) { return d instanceof Date && !isNaN(d); }
  const highlightDates = days.map(day => new Date(day.date)).filter(date => isValidDate(date));

  return (
    <div className='custom-calender-oxyem'>
      {isRequired ? <LabelMandatory labelText={label}/> : <LabelNormal labelText={label}/>}
      <ReactDatePicker
        ref={datePickerRef}
        selected={startDate}
        disabled={isDisabled}
        readOnly={readonly}
        onChange={handleDateChange}
        dateFormat="dd-MM-yyyy"
        className="form-control"
        placeholderText={placeholder}
        showYearDropdown 
        scrollableYearDropdown
        yearDropdownItemNumber={85}
        showMonthDropdown
        maxDate={maxDate}
        minDate={minDate}
		portalId="datepicker-portal"
        renderDayContents={renderDayContents}
filterDate={
  label?.toLowerCase() === "dob"
    ? () => true
    : isDaySelectable
}
        highlightDates={highlightDates}
        {...otherAttributes.length > 0 ? otherAttributes.reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}) : {}}
      />
      <span className='oxyem-date-icon' onClick={handleIconClick}><FaRegCalendarAlt /></span>
    </div>
  );
};

export default DateHolidayWeekendComponent;
