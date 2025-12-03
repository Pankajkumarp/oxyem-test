import ReactModal from 'react-modal';
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

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


export default function DeleteModal({ isOpen, closeModal,  projectid, alloctionid, CallDeleteApi, usernameD}) {
    const data = {
        "idAllocation": alloctionid,
        "idProject": projectid
    }

    const handleDelete= () => {
        CallDeleteApi(data);
    };
    const handleReject = () => {
        closeModal();
    };
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog modal-lg ">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel" ></h4>

                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body text-center oxyem-delete-popup-c">
                        <RiDeleteBinLine />
                        <h2 className='mt-4'>Do you want to deallocate this {usernameD}?</h2>
                        <span className='oxyem-delete-btn-section'>
                            <button className='btn btn-no' onClick={handleReject}>No</button>
                            <button className='btn btn-yes' onClick={handleDelete}>Yes</button>
                        </span>
                    </div>

                </div>
            </div>

        </ReactModal>

    )
}
