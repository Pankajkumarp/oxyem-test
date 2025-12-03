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
export default function LeavePopup({ isOpen, closeModal,onSubmit,pagename  }) {
  const [leaveReason, setLeaveReason] = useState('');
  const [formData, setFormData] = useState({ leavereason: '' });
  const [validationMessage, setValidationMessage] = useState('');

  const onChange = (newValue) => {
    setLeaveReason(newValue);   
    setFormData({ ...formData, ['leavereason']: newValue });
    if (formData.leavereason.trim() === '') {
      setValidationMessage('Reason is required.');
      return;
    }
    setValidationMessage('');
  };

  const handleSubmit = async () => {
    if (formData.leavereason.trim() === '') {
      setValidationMessage('Reason is required.');
      return;
    }
    setValidationMessage('');
    onSubmit(formData)    
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
            <h4 className="modal-title " id="myLargeModalLabel" >Recall</h4>

            <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
          </div>
          <div className="modal-body">
            <div className="form-group">

{pagename === 'claimInfo' ? (

<Textarea label={"Claim Reason"}
                placeholder={"Claim Reason"}
                name={"leavereason"}
                onChange={onChange}
                value={leaveReason}/>

):(

<Textarea label={"Leave Reason"}
                placeholder={"Leave Reason"}
                name={"leavereason"}
                onChange={onChange}
                value={leaveReason}/>
)}

              
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