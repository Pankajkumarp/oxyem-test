import React, { useState, useEffect } from 'react';
import { GrFormNext } from 'react-icons/gr';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';
import DeleteModal from '../Alert/Delete';
import { RiDeleteBinLine } from "react-icons/ri";

export default function EmergencyInfo({ empId, apiBaseUrl ,showbutton}) {
    const [emergencyInfo, setEmergencyInfo] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [openSection, setOpenSection] = useState(true); // Set to true to open section by default
    const [openItem, setOpenItem] = useState(0); // Set to 0 to open the first item by default
    const [Formdata, setFormData] = useState([]);

    const openEditModal = () => {
        fetchEmergencyForm();
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
    };

    const fetchEmergencyForm = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "EmergencyContact" } });

            if (response.status === 200 && response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };

    const fetchEmergencyInfo = async () => {
        try {
            if (empId) {
                const response = await axiosJWT.get(`${apiBaseUrl}/emergencyContact`, {
                    params: { idEmployee: empId }
                });

                if (response.status === 200 && response.data.data) {
                    setEmergencyInfo(response.data.data);
                }
            }
        } catch (error) {
            setEmergencyInfo([])
        }
    };

    useEffect(() => {
        fetchEmergencyInfo();
    }, [empId]);
    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const getsubmitformdata = async (value) => {
        try {
            setSubmitButtonLoading(true);
            if (value) {
                const apiUrl = apiBaseUrl + '/emergencyContact';
                const response = await axiosJWT.post(apiUrl, value);

                if (response.status === 200) {
                    closeEditModal();
                    fetchEmergencyInfo();
                    ToastNotification({ message: response.data.message });
                    setSubmitButtonLoading(false);
                }
            }
        } catch (error) {
            setSubmitButtonLoading(false);
            console.error("Error occurred during API call:", error);

        }
    };

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [idEmergency, setidEmergencyContact] = useState('');

    

    const openDeleteModal = (id) => {
        setIsDeleteOpen(true);
        setidEmergencyContact(id);
    };

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
    };

    const deleteEmergencyContact = async (value) => {
        try {
            const response = await axiosJWT.delete(`${apiBaseUrl}/emergencyContact`, {
                data: { 
                    idEmployee:empId,
                    idEmergencyContact:idEmergency
                }
            });

            if (response.status === 200) {
                fetchEmergencyInfo();
                closeDeleteModal();
                ToastNotification({ message: "Contact deleted successfully" });
            }

        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };

    const toggleSection = () => {
        setOpenSection(!openSection);
    };

    const toggleItem = (index) => {
        setOpenItem(openItem === index ? null : index);
    };

    return (
        <>
            <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={Formdata} getsubmitformdata={getsubmitformdata} empId={empId} loaderSubmitButton={SubmitButtonLoading}/>
            <DeleteModal isOpen={isDeleteOpen} closeModal={closeDeleteModal} idEmployee={empId} idDependent={idEmergency} handleDeleteData={deleteEmergencyContact}/>
            <div className="card-body">
                <h3 className="card-title">
                    Emergency Contact Information
                    {!showbutton ? null : <span className="add-btn-circle" onClick={openEditModal}>+</span> }
                    <GrFormNext size={20} style={{ cursor: 'pointer', float: 'right', transform: openSection ? 'rotate(90deg)' : 'rotate(0deg)', marginRight: '10px' }} onClick={toggleSection} />
                </h3>

                {openSection && (
                    <div className="accordion-body mt-1">
                        {emergencyInfo.length === 0 ? (
                            <div>No records found</div>
                        ) : (
                            emergencyInfo.map((infoArray, index) => {
                                // Filter out objects with the label "idEmergencyContact"
                                const filteredInfoArray = infoArray.filter(info => info.lebel !== "idEmergencyContact");
                                const name = filteredInfoArray.find(info => info.lebel === "Name")?.value;
                                const relationship = filteredInfoArray.find(info => info.lebel === "Relationship")?.value;
                                const id = infoArray.find(info => info.lebel === "idEmergencyContact")?.value;

                                return (
                                    <div key={index} className="accordion-item mt-1">
                                        <div className="accordion-header" onClick={() => toggleItem(index)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                        <span>{name} ({relationship})</span>
                                            <span>
                                                <RiDeleteBinLine style={{width: '30px'}} color='red' size={15}  onClick={() => openDeleteModal(id)}/>
                                                <GrFormNext size={20} style={{ transform: openItem === index ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                                            </span>
                                           
                                           
                                            {/* {name} ({relationship})
                                            <FiTrash2 size={20} style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => deleteEmergencyContact(id)} />
                                            <GrFormNext size={20} style={{ transform: openItem === index ? 'rotate(90deg)' : 'rotate(0deg)' }} /> */}
                                        </div>
                                        {openItem === index && (
                                            <div className="accordion-body mt-0">
                                                <div className="accordion-body-content">
                                                    <ul className="personal-info">
                                                        {filteredInfoArray.map((info, detailIndex) => (
                                                            <li key={detailIndex}>
                                                                <div className="title">{info.lebel}</div>
                                                                <div className="text">{info.value}</div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
            <ToastContainer />
        </>
    );
}
