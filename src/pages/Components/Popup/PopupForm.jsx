import ReactModal from 'react-modal';
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { MdClose } from "react-icons/md";
import Profile from '../commancomponents/profile';
import ButtonPrimary from '../common/Buttons/ButtonPrimaryComponent';
import SecTab from '../Employee/SecTab';
import Apialert from '../Errorcomponents/Apierror'
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minHeight: '460px', 
    },
};


export default function PopupForm({ isOpen, closeModal, labelText, dynamicform, actionid, alloctionid, section, handleGetformvalueClick, callmainApi }) {
    const [showForm, setShowForm] = useState(false);
    const [AdduserContent, setAdduserContent] = useState([]);
    const [showerror, setShowError] = useState("");
    const headingContent = '';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const hitapidata = async () => {
        const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": dynamicform } })
        if (response) {
            setAdduserContent(response.data.data)
            setTimeout(() => {
                setShowForm(true)
            }, 500);
        }
    };


    useEffect(() => {
        if (isOpen) {
            hitapidata();
        }
    }, [isOpen]);

    const getapidataResponse = async () => {

        const response = await axiosJWT.get(`${apiUrl}/project/allocation`, { params: { "idAllocation": alloctionid } })
        const apiData = response.data.data[0];
        AdduserContent.section.forEach(section => {
            section.Subsection.forEach(subsection => {
                subsection.fields.forEach(field => {
                    // Map the API response values to the corresponding fields
                    switch (field.name) {
                        case 'idEmployee':
                            field.value = apiData.idEmployee;
                            break;
                        case 'allocation':
                            field.value = apiData.allocation;
                            break;
                        case 'startDate':
                            field.value = apiData.startDate;
                            break;
                        case 'endDate':
                            field.value = apiData.endDate;
                            break;
                        // Add more cases as needed for other fields
                    }
                });
            });
        });
        setAdduserContent(AdduserContent)
    };
    useEffect(() => {
        if (section === "allocationEdit") {
            getapidataResponse();
        }
    }, [isOpen, alloctionid]);
    const getsubmitformdata = async (value) => {
        if (section === "Btp_shtp") {
            handleGetformvalueClick(value)
        } else {
            value.idProject = actionid;
            value.idAllocation = alloctionid;
            try {
                const response = await axiosJWT.post(`${apiUrl}/project/allocation`, value);
                // Handle the response if needed
                if (response) {
                    callmainApi();
                    setTimeout(() => {
                        callmainApi();
                    }, 2000);
                }
            } catch (error) {
                // Handle the error if any
                console.error("Error occurred:", error.response.data.errors);
                setShowError(error.response.data.errors);
            }
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
                        <h4 className="modal-title" id="myLargeModalLabel" ><b>{labelText}</b></h4>

                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            {showerror ? (<><Apialert
                                type={"danger"}
                                message={showerror}
                                show={true} /></>) : (<></>)}
                            {showForm ? (<SecTab AdduserContent={AdduserContent} headingContent={headingContent} getsubmitformdata={getsubmitformdata} />) : null}
                        </div>


                    </div>

                </div>
            </div>

        </ReactModal>

    )
}
