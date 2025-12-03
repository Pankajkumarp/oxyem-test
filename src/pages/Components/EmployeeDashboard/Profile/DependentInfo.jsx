import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';
import DeleteModal from '../Alert/Delete';

export default function DependentInfo({ empId, apiBaseUrl ,showbutton }) {
    const [dependentInfo, setDependentInfo] = useState([]);
    const [formColumns, setFormColumns] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState([]);
    const [EditDependentData, setEditDependent] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [idEmergency, setidEmergencyContact] = useState('');
    const [Dependentid, setDependentid] = useState('');
    const [isEditDepOpen, setIsEditDepOpen] = useState(false);
    
    const fetchDependentForm = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "DependentInformation" } });

            if (response.status === 200 && response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };

    const openEditModal = () => {
        fetchDependentForm()
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
    };

    const openEditDepModal = () => {
        fetchDependentForm()
        setIsEditDepOpen(true);
    };

    const closeEditDepModal = () => {
        setIsEditDepOpen(false);
        setEditDependent([]);
    };

    const fetchDependentInfo = async () => {
        try {
            if (empId) {
                const response = await axiosJWT.get(`${apiBaseUrl}/dependentInfo`, {
                    params: { idEmployee: empId }
                });

                if (response.status === 200 && response.data.data) {
                    setFormColumns(response.data.data.formColoumns);
                    setDependentInfo(response.data.data.data);
                }
            }
        } catch (error) {
            setFormColumns([]);
            setDependentInfo([]);
        }
    };
    useEffect(() => {
        fetchDependentInfo();
    }, [empId]);

    useEffect(() => {
        if (EditDependentData.length > 0) {
            populateFormData();
        }
    }, [EditDependentData]);
const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const getsubmitformdata = async (value) => {
        setSubmitButtonLoading(true);
        try {
            if (value) {
                const response = await axiosJWT.post(`${apiBaseUrl}/dependentInfo`, value);
                if (response.status === 200) {
                    closeEditModal();
                    closeEditDepModal();
                    fetchDependentInfo();
                    ToastNotification({ message: response.data.message });
                    setSubmitButtonLoading(false);
                }
            }
        } catch (error) {
            setSubmitButtonLoading(false);
            console.error("Error occurred during API call:", error);
        }
    }

    const openDeleteModal = (id) => {
        setIsDeleteOpen(true);
        setidEmergencyContact(id);
    };

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
    };

    const deleteEmergencyContact = async (value) => {
        try {
            const response = await axiosJWT.delete(`${apiBaseUrl}/dependentInfo`, {
                data: { 
                    idEmployee: empId,
                    idDependent: idEmergency
                }
            });

            if (response.status === 200) {
                fetchDependentInfo();
                closeDeleteModal();
                ToastNotification({ message: "Dependent deleted successfully" });
            }

        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };



    const fetchSingleDependentInfo = async (id) => {
        try {
            const response = await axiosJWT.get(`${apiBaseUrl}/dependentInfo`, {
                params: { idDependent: id }
            });

            if (response.status === 200 && response.data.data) {
                setEditDependent(response.data.data);
            }

            setDependentid(id);
        } catch (error) {
            console.error("Error fetching single dependent information:", error);
        }
    };

    const populateFormData = () => {
        const updatedFormData = { ...formData };

        const section = updatedFormData.section.find(sec => sec.SectionName === "DependentInformation");
        
        if (section) {
            const subsection = section.Subsection.find(sub => sub.SubsectionName === "Profile Information");
            
            if (subsection) {
                subsection.fields.forEach(field => {
                    
                    const matchingInfo = EditDependentData[0]?.section[0]?.fields.find(info => info.name === field.name);
                    
                    if (matchingInfo) {
                        field.value = matchingInfo.attributeValue;
                    }
                });
            } 
        }

        setFormData(updatedFormData);
        openEditDepModal();
    };

    return (
        <>

            <Edit isOpen={isEditDepOpen} closeModal={closeEditDepModal} formData={formData} getsubmitformdata={getsubmitformdata} empId={empId} Dependentid={Dependentid} loaderSubmitButton={SubmitButtonLoading}/>
            <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={formData} getsubmitformdata={getsubmitformdata} empId={empId} loaderSubmitButton={SubmitButtonLoading}/>
            <DeleteModal isOpen={isDeleteOpen} closeModal={closeDeleteModal} idEmployee={empId} idDependent={idEmergency} handleDeleteData={deleteEmergencyContact}/>
            <div className="card-body">
                <h3 className="card-title">Dependent Information
                {!showbutton ? null : <span className="add-btn-circle" onClick={openEditModal}>+</span>}
                    
                </h3>

                {dependentInfo.length === 0 ? (
                    <div>No records found</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                {formColumns.map((column) => (
                                    <th key={column.name}>{column.lebel}</th>
                                ))}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dependentInfo.map((info) => (
                                <tr key={info.idDependent}>
                                    {formColumns.map((column) => (
                                        <td key={column.name}>{column.name === 'DOF' ? new Date(info[column.name]).toLocaleDateString() : info[column.name]}</td>
                                    ))}
                                    <td><FaEdit size={15} className='edit-icon-color' onClick={() => fetchSingleDependentInfo(info.idDependent)} /> 
                                    <RiDeleteBinLine color='red' size={15} style={{cursor:'pointer'}} onClick={() => openDeleteModal(info.idDependent)}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <ToastContainer />
        </>
    );
}
