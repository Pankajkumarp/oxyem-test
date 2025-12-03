import React, { useState, useEffect, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { format } from 'date-fns';
import { FaRegCalendarAlt } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { axiosJWT } from '../../../Auth/AddAuthorization';
const DatePicker = ({ type, placeholder, readonly, isDisabled, label, value, validations = [], onChange, otherAttributes, showleave, selectEmpId }) => {
  const [days, setDays] = useState([]);
  
  const [startDate, setStartDate] = useState(value);
  const isRequired = validations.some(validation => validation.type === "required");
  const datePickerRef = useRef(null); // Create a ref for the date picker input

  useEffect(() => {
      const fetchOptions = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/leave/getDaysInfo`)
          setDays(response.data.data);
          
        } catch (error) {
          console.error('Error fetching options:', error); 
        }
      };
      const fetchonlyholidayOptions = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/leave/getDaysInfo`)
          const holidayinfo =response.data.data.filter(day => day.status === 'holiday')
          setDays(holidayinfo);
        } catch (error) {
          console.error('Error fetching options:', error); 
        }
      };
      if(showleave === "yes"){
      fetchOptions()
      }
      if(showleave === "holiday"){
      fetchonlyholidayOptions()
      }
  }, []);

  

  useEffect(() => {
      const fetchEmpOptions = async (value) => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/leave/getDaysInfo`, { params: { "idEmployee": value } })
          setDays(response.data.data);
        } catch (error) {
          console.error('Error fetching options:', error); 
        }
      };
      if(selectEmpId !== ""){
      if(showleave === "holiday"){
        fetchEmpOptions(selectEmpId)
      }
    }
  }, [selectEmpId]);
  useEffect(() => {
    // Synchronize internal state with props
    setStartDate(value);
  }, [value]);

  const handleDateChange = (date) => {
    if (readonly) return; // Prevent change if readOnly
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
    setStartDate(formattedDate);
    onChange(formattedDate);
  };

  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() );
  
  let maxDate = "";
  let minDate = "";

  if (Array.isArray(otherAttributes) && otherAttributes.length > 0) {
    for (const attribute of otherAttributes) {
      if (attribute.maxDate === true) {
        maxDate = today;
        break; // Exit loop after finding maxDate
      }
      else if (attribute.minDate === true) {
        minDate = new Date(tomorrow);
        break; // Exit loop after finding minDate
      }
    }
  }

  if (Array.isArray(otherAttributes) && otherAttributes.length > 0) {
    for (const attribute of otherAttributes) {
      if (attribute.maxDate === true) {
        maxDate = today;
        break; // Exit loop after finding maxDate
      }
    }
  }

  const handleIconClick = () => {
    if (readonly) return; // Prevent focus if readOnly
    datePickerRef.current.setFocus(); // Focus the date picker input when the icon is clicked
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
      labelStyle: { backgroundColor: '#2C5F2D', color: '#fff', display: 'block', borderRadius: '4px', width: '1.7rem', lineHeight: '1.7rem' },
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
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayInfo = days.find(d => d.date === formattedDate);
    // If the dayInfo exists and isselect is true, make it unselectable
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
        ref={datePickerRef} // Assign the ref to the date picker input
        selected={startDate}
        disabled={isDisabled}
        readOnly={readonly} // Add readOnly attribute
        onChange={handleDateChange}
        dateFormat="dd-MM-yyyy"
        className="form-control"
        placeholderText={placeholder}
        showYearDropdown // Enables year dropdown for easier navigation
        scrollableYearDropdown // Allows scrolling in the year dropdown
        showMonthDropdown // Enables month dropdown for easier navigation
        maxDate={maxDate} // Sets the maximum selectable date to today
        minDate={minDate}
        renderDayContents={renderDayContents}
        filterDate={isDaySelectable} // Use the filterDate prop to make certain days unselectable
        highlightDates={highlightDates}
        {...otherAttributes.length > 0 ? otherAttributes.reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}) : {}}
      />
      <span className='oxyem-date-icon' onClick={handleIconClick}><FaRegCalendarAlt /></span>
    </div>
  );
};

export default DatePicker;
