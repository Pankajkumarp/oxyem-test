import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import ViewPopup from '../../Popup/PopupForm';
export default function Popupform({ type, placeholder, label, value, validations = [], onChange, actionid }) {
  const [isModalOpeninput, setIsModalOpeninput] = useState(false);
  const closeModalInputselect = () => {
    setIsModalOpeninput(false);
  };
  const handleGetvalueClick = () => {
    setIsModalOpeninput(true); 
  };
  return (
    <>
  <ViewPopup isOpen={isModalOpeninput} closeModal={closeModalInputselect} labelText={"Add Allocation"} dynamicform={"Member_allocation"} actionid={actionid}/>
      <div className='row align-items-center text-end' style={{marginBottom: '-25px'}}>
        <div className='col-md-12'>   
          <button type='button' className='btn btn-primary oxyem-filter-button' onClick={handleGetvalueClick}><FaPlus/></button>
        </div>
      </div>
    </>
  );
}
