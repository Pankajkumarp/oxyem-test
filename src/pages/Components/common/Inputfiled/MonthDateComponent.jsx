import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarAlt } from "react-icons/fa";
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { format } from 'date-fns';

const DatePicker = ({ type, placeholder, readonly, isDisabled, label, value, validations = [], onChange, otherAttributes, showleave, selectEmpId }) => {
  const isRequired = validations.some(validation => validation.type === "required");
  // const [startDate, setStartDate] = useState(value ? value : new Date()); // Set initial state to current date if value is not provided

  const [startDate, setStartDate] = useState(''); 
  useEffect(() => {
    if (value !== "") {
      setStartDate(value);
    }else{
      const startDate = new Date()
      setStartDate(startDate);
      handleDateChange(startDate)
    }
  }, [value]);

  const handleDateChange = (date) => {
    if (readonly) return; // Prevent change if readOnly
    let formattedDate = '';
    try {
      const dateObject = new Date(date);
      if (!isNaN(dateObject.getTime())) {
        formattedDate = format(dateObject, 'yyyy-MM');
      } else {
        console.log('Invalid date');
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
    setStartDate(formattedDate);
    onChange(formattedDate);
  };

  // Set minDate to current date to disable previous dates
  const minDate = new Date();

  return (
    <>
      {isRequired ? <LabelMandatory labelText={label}/> : <LabelNormal labelText={label}/>}
      <ReactDatePicker
        selected={startDate}
        onChange={handleDateChange}
        dateFormat="MM/yyyy"
        className="form-control"
        placeholderText="YYYY/MM"
        showMonthYearPicker
        // minDate={minDate} // Disable dates before the current date
        disabled={isDisabled}
      />
    </>
  );
};

export default DatePicker;
