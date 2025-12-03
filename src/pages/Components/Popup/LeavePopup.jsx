import React, { useState, useEffect } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import Modal from 'react-modal';
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
export default function LeavePopup({ isOpen, closeModal }) {
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
     

      <Modal   isOpen={isOpen}
            onRequestClose={closeModal}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
        <button type="reset" className="btn btn-danger" onClick={closeModal}><AiFillCloseCircle /> No</button>
                            <button className="btn btn-success ms-2"><AiFillCheckCircle /> yes</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}