"use client";
import React, { useState } from "react";
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Textarea from '../common/Inputfiled/TextAreaComponentcomman';
import { FaRegCalendarAlt } from "react-icons/fa";

const customStyles = {
  content: {
    background: '#fff',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function LeavePopup({ isOpen, closeModal,onSubmit  }) {
  const [delayreason, setDelayReason] = useState('');
  const [formData, setFormData] = useState({ delayreason: '' });
  const [validationMessage, setValidationMessage] = useState('');
  const [date, setDate] = useState(new Date());

// eslint-disable-next-line react/display-name
const SmallDateInput = React.forwardRef(
  ({ value, onClick, placeholder }, ref) => (
    <div className="position-relative">
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        readOnly
        placeholder={placeholder}
        className="form-control form-control-sm"
        style={{
          paddingRight: "32px",
          fontSize: "13px",
          cursor: "pointer",
        }}
      />
      <FaRegCalendarAlt
        onClick={onClick}
        style={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "14px",
          cursor: "pointer",
          color: "#555",
        }}
      />
    </div>
  )
);

  const onChange = (newValue) => {
    setDelayReason(newValue);   
    setFormData({ ...formData, ['delayreason']: newValue });
    if (formData.delayreason.trim() === '') {
      setValidationMessage('Reason is required.');
      return;
    }
    setValidationMessage('');
  };

  const handleSubmit = async () => {
    if (formData.delayreason.trim() === '') {
      setValidationMessage('Reason is required.');
      return;
    }
    setValidationMessage('');
onSubmit({
    delayreason: formData,
    date: date,               
  });  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={customStyles}
    >
      <div className="modal-dialog modal-lg oxyem-user-image-select">
        <div className="modal-content">
          <div className="modal-header mb-4">
                  <h6 className="fw-semibold mb-2">Delay</h6>

            <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
          </div>
          <div className="modal-body">
            <div className="form-group">

{/* {pagename === 'claimInfo' ? ( */}

<Textarea label={"Milestone Delay Reason"}
                placeholder={"Milestone Delay"}
                name={"delayreason"}
                onChange={onChange}
                value={delayreason}/>
<div className="form-group mt-3">
  <label className="form-label" style={{ fontSize: "13px" }}>
    Completion Date <span className="text-danger">*</span>
  </label>

  <DatePicker
    selected={date}
    onChange={(date) => setDate(date)}
    dateFormat="dd/MM/yyyy"
    minDate={new Date()}
    // eslint-disable-next-line react-hooks/static-components
    customInput={<SmallDateInput placeholder="Starting Date" />}
  />
</div>

            </div>
            {validationMessage && <div className="error text-danger">{validationMessage}</div>}
            <div className="text-end w-100">
              <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>

          </div>

        </div>

      </div>

    </ReactModal >
  );
}