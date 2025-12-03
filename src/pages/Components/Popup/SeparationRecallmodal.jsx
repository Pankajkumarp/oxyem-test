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
export default function SeparationRecallmodal({ isOpen, closeModal, onSubmit, id, title, filedName, placeholder }) {
  const [reasonData, setReasonData] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const onChange = (newValue) => {
    setReasonData(newValue);
    if (newValue.trim() === '') {
      setValidationMessage('Reason is required.');
      return;
    }
    setValidationMessage('');
  };

  const handleSubmit = async () => {
    if (reasonData.trim() === '') {
      setValidationMessage('Reason is required.');
      return;
    }
    const getData= {
      id:id,
      reason:reasonData
    }
    setValidationMessage('');
    onSubmit(getData)

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
            <h4 className="modal-title " id="myLargeModalLabel" >{title}</h4>

            <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
          </div>
          <div className="modal-body">
            <div className="form-group mb-3">
              <Textarea label={filedName}
                placeholder={placeholder}
                name={"reason"}
                onChange={onChange}
                value={reasonData} />
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