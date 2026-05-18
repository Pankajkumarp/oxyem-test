import { MdClose } from "react-icons/md";

import Drawer from 'react-modern-drawer'
export default function previewImage({ isOpen, closeModal ,previewDoc }) {
    if (!isOpen || !previewDoc) return null;
    
    return (
        <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer-preview'
      overlayClassName='custom-overlay' // Apply the custom overlay class
    >
            <div className="modal-dialog oxyem-user-time-select">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="myLargeModalLabel" ></h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body mt-4">
                        {previewDoc.type === "image" && (
          <img
            src={previewDoc.url}
            alt={previewDoc.name}
            style={{ maxWidth: "100%" }}
          />
        )}

        {previewDoc.type === "pdf" && (
          <iframe
            src={`/api/pdfpreview?url=${encodeURIComponent(previewDoc.url)}`}
            width="100%"
          />
        )}
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
