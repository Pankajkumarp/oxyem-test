import React from "react";
import { MdClose } from "react-icons/md";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const customStyles = {
  content: {
    background: "#fff",
    top: "0",
    left: "30%",
    right: "auto",
    bottom: "auto",
    minWidth: "70%",
    marginRight: "-50%",
    background: "#ffffff",
    // transform: "translate(-50%, -50%)",
  },
};

const AssetHistory = ({ isOpen, closeModal, isHistroyId, datafor }) => {
  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction="right"
      className="custom-drawer"
      overlayClassName="custom-overlay"
      style={customStyles.content}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel">Reward</h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <hr />
          <div className="modal-body" id="assetshistroy">
            {isHistroyId ? (
              <iframe
              src={`https://docs.google.com/gview?url=${isHistroyId}&embedded=true`}
              width="100%"
              height="450px"
            ></iframe>
            ) : (
              <p>No reward available</p>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AssetHistory;
