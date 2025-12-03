import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";

const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minHeight: '80vh',
        maxHeight: '90vh',
        minWidth: '83vw',
        overflow: 'hidden', // Prevents extra scrollbars
        padding: '15px',
        border: 'none', // Removes modal border
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow for better UI
    },
};

export default function Preview({ isOpen, closeModal, pdfData }) {
    const [pdfUrl, setPdfUrl] = useState("");

    useEffect(() => {
        if (pdfData) {
            let url;
            if (typeof pdfData === "string") {
                if (pdfData.startsWith("data:application/pdf")) {
                    url = pdfData; // Base64 PDF
                } else {
                    url = pdfData; // File URL
                }
            } else {
                const blob = new Blob([pdfData], { type: 'application/pdf' });
                url = URL.createObjectURL(blob);
            }
            setPdfUrl(url);
        }
    }, [pdfData]);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-content flex flex-col">
                
                <div className="modal-header mb-3 flex justify-between items-center">
                    <h6 className="text-lg font-semibold">PDF Preview</h6>
                    <button className="oxyem-btn-close text-xl" onClick={closeModal}>
                        <MdClose />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-grow overflow-hidden">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            frameBorder="0"
                            style={{
                                width: '100%',
                                height: '75vh',
                                border: 'none', // Removed border
                                backgroundColor: 'transparent' // Transparent background
                            }}
                        ></iframe>
                    ) : (
                        <p>Loading PDF...</p>
                    )}
                </div>
            </div>
        </ReactModal>
    );
}
