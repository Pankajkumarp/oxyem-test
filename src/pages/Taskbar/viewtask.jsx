import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import Profile from '../Components/commancomponents/profile';



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


const DocumentComponent = ({ isOpen, closeModal ,taskData}) => {
  
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="modal-dialog modal-lg ">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel" >View Task</h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body  ">
                    <div className="">
            <div style={{ borderRadius: '50%', margin: '4px 10px' }}>
              {/* <Profile name={'Sumit Kumar'} imageurl="" size="30" /> */}
            </div>
            <div className="oxyem-user-text mt-4">
             <p> <h6><span className="main-text">{taskData.name}</span></h6></p>
              <p className=""><span className="sub-text mt-2">{taskData.message}{''}</span></p>
              <p><span className="sub-text">{'Date Range-'} {taskData.dateRange}</span></p>
              {/* <p><span className="sub-text">{'created time-'} {taskData.createdtime}</span></p> */}
              

              
            </div>
           
          </div>
                    </div>
                    {/* <span className='oxyem-delete-btn-section text-end'>
                            <button className='btn btn-no' onClick={closeModal}>Reject</button>
                            <button className='btn btn-yes' onClick={closeModal}>Approve</button>
                        </span> */}
                </div>
                
            </div>
    </ReactModal>
  );
};

export default DocumentComponent;
