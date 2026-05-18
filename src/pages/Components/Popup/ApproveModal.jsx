"use client";
import React from "react";
import ReactModal from "react-modal";
import { MdClose } from "react-icons/md";

const modalStyles = {
  content: {
    width: "360px",              // ✅ SMALL WIDTH
    inset: "50% auto auto 50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "8px",
    border: "none",              // ✅ NO BORDER
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
};
export default function ApproveModal({ isOpen, closeModal, onSubmit }) {
  return (
     <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modalStyles}
      ariaHideApp={false}
    >
      {/* Title */}
      <h6 className="fw-semibold mb-2">
        Approve Milestone
      </h6>

      {/* Message */}
      <p className="text-muted mb-4" style={{ fontSize: "13px" }}>
        Are you sure you want to approve this milestone?
      </p>

      {/* Actions */}
      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-oxyem mx-2"
          onClick={closeModal}
        >
          Cancel
        </button>
       <button className="btn btn-primary" onClick={onSubmit}>
  Approve
</button>
      </div>
    </ReactModal>
  );
}
