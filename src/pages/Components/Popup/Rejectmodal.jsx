import React, { useState, useEffect } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";
import Textarea from '../common/Inputfiled/TextAreaComponentcomman';
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
export default function Rejectmodal({ isOpen, closeModal,onSubmit  }) {
  const [leaveReason, setLeaveReason] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const onChange = (newValue) => {
   console.log("ttt",leaveReason)
    setLeaveReason(newValue);   
    if (leaveReason.trim() === '') {
      // setValidationMessage('Rejection reason is required.');
      return;
    }
    setValidationMessage('');
  };

  const handleSubmit = async () => {
    if (leaveReason.trim() === '') {
      setValidationMessage('Rejection reason is required.');
      return;
    }
    setValidationMessage('');
    
    onSubmit(leaveReason)
    setLeaveReason("");
    // You can use fetch or axios to send data to the backend
    
  };

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
            <h4 className="modal-title " id="myLargeModalLabel" >Reason for Rejection</h4>

            <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
          </div>
          <div className="modal-body">
            <div className="form-group">

              <Textarea label={"Reject Reason"}
                placeholder={"Rejection Reason"}
                name={"rejection"}
                onChange={onChange}
                value={leaveReason}/>
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