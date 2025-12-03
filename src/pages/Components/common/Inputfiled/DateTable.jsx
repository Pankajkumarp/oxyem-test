import React, { useState, useEffect, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { FaRegCalendarAlt } from "react-icons/fa";

const DateTable = ({ placeholder, value, onChange , disabled}) => {
  const isDisabled = false;
  const readonly = false;
  const [startDate, setStartDate] = useState(value);
  const datePickerRef = useRef(null); // Create a ref for the date picker input

  useEffect(() => {
    // Synchronize internal state with props
    setStartDate(value);
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
      console.log('Error:', error.message);
    }
    setStartDate(formattedDate)
    onChange(formattedDate);
  };

  const handleIconClick = () => {
    if (readonly) return;
    datePickerRef.current.setFocus(); // Focus the date picker input when the icon is clicked
  };

  return (
    <div className='custom-calender-oxyem'>
      
      <ReactDatePicker
        ref={datePickerRef} // Assign the ref to the date picker input
        selected={startDate}
        disabled={disabled}
        readOnly={readonly} 
        onChange={handleDateChange}
        dateFormat="dd-MM-yyyy"
        className="form-control"
        placeholderText={placeholder}
        showYearDropdown // Enables year dropdown for easier navigation
        scrollableYearDropdown // Allows scrolling in the year dropdown
        showMonthDropdown // Enables month dropdown for easier navigation
       
      />
      <span className='oxyem-date-icon' onClick={handleIconClick}><FaRegCalendarAlt /></span>
    </div>
  );
};

export default DateTable;
