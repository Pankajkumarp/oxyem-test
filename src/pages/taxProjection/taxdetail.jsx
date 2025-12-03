import React from "react";
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";

const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minHeight: '350px',
        minWidth: '50vw'
    },
};

export default function TaxInfo({ isOpen, closeModal, viewData ,Heading}) {

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog oxyem-user-time-select">
                <div className="modal-content">
                    <div className="modal-header mb-3">
                        <h4 className="modal-title" id="myLargeModalLabel">{Heading}</h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        {viewData && viewData.length > 0 ? (
                            <table className="table-asset-info-t">
                                <tbody>
                                    {viewData.map((row, rowIndex) => (
                                        Object.entries(row).map(([key, value], cellIndex) => (
                                            <tr key={`${rowIndex}-${cellIndex}`}>
                                                <th>{key}</th>
                                                <td>
                                                    {key === "View Detail" ? (
                                                        <Link href="#view-details" onClick={() => alert('Details clicked!')}>
                                                            {value}
                                                        </Link>
                                                    ) : (
                                                        value
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
