import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { format } from 'date-fns';

const DatePicker = ({ readonly, isDisabled, label, value, validations = [], onChange }) => {
  const isRequired = validations.some(validation => validation.type === "required");
  // const [startDate, setStartDate] = useState(value ? value : new Date()); // Set initial state to current date if value is not provided

  const [startDate, setStartDate] = useState(''); 
  useEffect(() => {
    if (value !== "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartDate(value);
    }else{
      const startDate = new Date()
      setStartDate(startDate);
      // eslint-disable-next-line react-hooks/immutability
      handleDateChange(startDate)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.error('Error:', error.message);
    }
    setStartDate(formattedDate);
    onChange(formattedDate);
  };


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
