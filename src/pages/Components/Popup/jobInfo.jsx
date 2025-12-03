import React, { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";
import parse from 'html-react-parser';
import { axiosJWT } from "../../Auth/AddAuthorization";
const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minHeight: '85vh',
        maxHeight: '85vh',
        minWidth: '75vw'
    },
};

export default function jobInfo({ isOpen, closeModal ,isviewId }) {
const [data, setData] = useState("");

    useEffect(() => {
        if (isviewId) {
            fetchJobDetails(isviewId);
        }
    }, [isviewId]);

    const fetchJobDetails = async (isviewId) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/jobs/vacancyDetails`, {
                params: { idJob: isviewId },
            });
            if (response && response.data) {
                setData(response.data.data[0]);
            }
        } catch (error) {
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog oxyem-user-time-select">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel" ></h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body" id="jobinfo-popup">
                        <div className="container mt-5">
                            <div className="top_header_section">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="top_header_left">
                                            <h1 className="job-post-title">{data.jobTitle}</h1>
                                            <span className="job-group-item"><strong>Posted on:</strong> {data.postedDate}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="top_header_right">
                                            <span className="job-group-item"><strong>Job ID:</strong>{data.jobNumber}</span>
                                            <span className="job-group-item"><strong>End Date:</strong> {data.postEndDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="middle_header_section">
                                <div className="row">
                                    <div className="col-md-6">
                                        <span className="job-group-item"><strong>Location:</strong> {data.cityname} {data.countryname}</span>
                                        <span className="job-group-item"><strong>Department:</strong> {data.department}</span>

                                    </div>
                                    <div className="col-md-6">
                                        <span className="job-group-item"><strong>Job Type:</strong> {data.typeofjob}</span>
                                        <span className="job-group-item"><strong>Role:</strong> {data.roles}</span>

                                    </div>
                                </div>
                            </div>
                            <div className="bottom_section_content">
                                <h6 className="mt-4">Job Description:</h6>
                                {data.jobDescription && <p>{parse(data.jobDescription)}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}