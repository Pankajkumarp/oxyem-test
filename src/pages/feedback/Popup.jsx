import ReactModal from 'react-modal';
import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../Auth/AddAuthorization';
import { ToastNotification } from '../Components/EmployeeDashboard/Alert/ToastNotification';
import { Toaster } from 'react-hot-toast';

const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        height: '200px', // popup height
        // minWidth: '400px', // optional: width
        overflow: 'auto', // scroll if content exceeds height
        borderRadius: '8px'
    },
};


export default function SelectUser({ isOpen, closeModal ,idShare ,selectedStatus ,refreshPage}) {
    const [selectedOption, setSelectedOption] = useState(selectedStatus);

    

    const options = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
    ];

    useEffect(() => {
    if (selectedStatus) {
        // find matching option object based on selectedStatus string
        const matchedOption = options.find(opt => opt.value === selectedStatus);
        setSelectedOption(matchedOption || null);
    }
}, [selectedStatus]);

    const handleSubmit = async () => {
        console.log("Selected:", selectedOption);

        const payload = {
            status:selectedOption.value,
            idShare: idShare
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.post(`${apiUrl}/feedback/updateStatus`, payload);
      if(response){
ToastNotification({ message: 'Status updated successfully' });
        refreshPage()
        closeModal();
      }
        
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog modal-lg oxyem-user-image-select">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel">Update Status</h4>
                        <button className="oxyem-btn-close" onClick={closeModal}>
                            <MdClose />
                        </button>
                    </div>
                    <div className="modal-body" style={{ marginBottom: "20px" }}>
                        <Select
                            value={selectedOption}
                            onChange={setSelectedOption}
                            options={options}
                            placeholder="Select status"
                        />
                    </div>
                    <div className="modal-footer d-flex justify-content-end gap-2">
                        <button className="btn btn-secondary" onClick={closeModal}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            
        </ReactModal>
    );
}
