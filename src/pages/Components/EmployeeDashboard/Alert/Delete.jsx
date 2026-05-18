"use client";

import ReactModal from "react-modal";
import React from "react";
import { MdClose } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const customStyles = {
  content: {
    background: "#fff",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    border: "none",
    borderRadius: "8px",
    width: "600px", 
    minWidth: "300px",       // Small popup width
    maxWidth: "90%",      // Responsive on mobile
    height: "40%",      // Responsive on mobile
  },
};

export default function DeleteModal({ isOpen, closeModal, handleDeleteData, idEmployee, idDependent }) {
  const data = { idEmployee, idDependent };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Delete Modal"
      style={customStyles}
      ariaHideApp={false}
    >
      {/* Header with close button */}
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-light btn-sm p-1"
          onClick={closeModal}
          aria-label="Close"
        >
          <MdClose size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="text-center">
        <RiDeleteBinLine size={36} className="text-danger mb-2" /> {/* smaller icon */}
        <h5 className="mb-3">Are you sure you want to delete?</h5>

        <div className="d-flex justify-content-center gap-5">
          <button className="btn btn-oxyem mx-2" onClick={closeModal}>
            No, Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleDeleteData(data)}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
