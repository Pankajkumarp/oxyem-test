import React from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import Modal from 'react-modal';
export default function LeavePopup({ isOpen, closeModal }) {
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