import ReactModal from 'react-modal';
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FiDownload } from "react-icons/fi";

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

export default function DeleteModal({ isOpen, closeModal, documentData }) {
    const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

    const renderDocumentList = () => {
        return documentData.map((doc, index) => {
            // Extracting document name from the URL
            const documentName = doc.split('/').pop(); 
            const documentUrl = `${baseImageUrl}/${doc}`;

            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{documentName}</td>
                    <td>
                        <a href={documentUrl} download>
                            <FiDownload size={20} style={{ cursor: 'pointer' }} />
                        </a>
                    </td>
                </tr>
            );
        });
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel">Document List</h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Sr No</th>
                                    <th>Document Name</th>
                                    <th>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderDocumentList()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
