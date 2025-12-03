import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer';
import { FcProcess } from "react-icons/fc";
import 'react-modern-drawer/dist/index.css';

export default function stautsModal({ isOpen, closeModal, isDoc, CallStatusApi }) {
    const [idDocumment, setIdDocumment] = useState("");
    const handleSubmit = () => {
        const data = {
            "id": idDocumment,
            "status": "approve",
        }
        CallStatusApi(data);
    };
    const handleReject = () => {
        const data = {
            "id": idDocumment,
            "status": "reject",
        }
        CallStatusApi(data);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("hide-body-scroll");
            setIdDocumment(isDoc);
        } else {
            document.body.classList.remove("hide-body-scroll");
            setIdDocumment("")
        }
    }, [isOpen, isDoc]);
    return (
        <Drawer
            open={isOpen}
            onClose={closeModal}
            direction='right'
            className='custom-drawer'
            overlayClassName='custom-overlay'
        >
            <div className="modal-dialog modal-lg histroy-process-modal">
                <div className="modal-content main-view-box-leave">
                    <div className="modal-header detail-box-leave">
                        <button className="oxyem-btn-close" onClick={closeModal}>
                                      <MdClose />
                                    </button>
                        <h4 className="modal-title space-top" id="myLargeModalLabel"><FcProcess />Process Document </h4>
                    </div>
                    <div className="modal-body oxyem-process-popup-c">
                        <h5 className='mt-4'>Would you like to go ahead with processing this document, then select status to submit?</h5>
                        <span className='oxyem-delete-btn-section'>
                            <button className='btn btn-no' onClick={handleReject}>Reject</button>
                            <button className='btn btn-yes' onClick={handleSubmit}>Approve</button>
                        </span>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
