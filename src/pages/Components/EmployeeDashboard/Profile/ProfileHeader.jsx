import React, { useState, useEffect, useRef } from 'react';
import { IoLocationSharp } from "react-icons/io5";
import { MdEdit, MdEmail, MdOutlineEdit } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import Address from '../Edit/Address';
import { FaRegEdit } from "react-icons/fa";
import { Tooltip } from 'react-tooltip'
import { GrTooltip } from "react-icons/gr";
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';
import AlertWithButton from '../Alert/AlerWithbutton';


export default function ProfileHeader({ empId, apiBaseUrl, hitAddressApi, handelactiveuser, showbutton, getEmpName }) {
    const [viewData, setViewData] = useState(null);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState([]);
    const [form, setFormDataAdd] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isEditOpenADD, setIsEditOpenADD] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [Imgpa, setImg] = useState('../assets/img/avatar-10.jpg');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const [showAddressAlert, setShowAddressAlert] = useState(false);
    const [hasShownAddressAlert, setHasShownAddressAlert] = useState(false);

    useEffect(() => {
        if (
            viewData &&
            !viewData.address &&
            !hasShownAddressAlert
        ) {
            setShowAddressAlert(true);
            setHasShownAddressAlert(true);
        }
    }, [viewData, hasShownAddressAlert]);

    const openEditModal = () => {
        updateFormDataWithPersonalInfo();
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
    };

    const openEditModalADD = () => {
        fetchFormAdd();
        setIsEditOpenADD(true);
    };

    const closeEditModalADD = () => {
        setIsEditOpenADD(false);
    };

    const fetchPersonalInfo = async () => {
        try {
            if (empId) {
                const response = await axiosJWT.get(`${apiBaseUrl}/profile`, {
                    params: { idEmployee: empId }
                });

                if (response.status === 200 && response.data.data) {
                    setViewData(response.data.data.view);
                    setEditData(response.data.data.edit);
                    const url = response.data.data.view.profilePicPath
                    if (url) { setImg(`${url}?t=${new Date().getTime()}`); }
                    const vData = response.data.data.view.isActive
                    handelactiveuser(vData);
                    getEmpName(response.data.data.view.empName);
                }
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };

    useEffect(() => {
        fetchPersonalInfo();
        fetchForm();
    }, [empId]);

    const getsubmitformdata = async (value) => {
        try {
            setSubmitButtonLoading(true);
            if (value) {
                const apiUrl = `${apiBaseUrl}/address`;
                const response = await axiosJWT.post(apiUrl, value);

                if (response.status === 200) {
                    closeEditModalADD();
                    fetchPersonalInfo();
                    ToastNotification({ message: response.data.message });
                    hitAddressApi(true);
                    setSubmitButtonLoading(false);
                }
            }
        } catch (error) {
            setSubmitButtonLoading(false);
            console.error("Error occurred during API call:", error);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('idEmployee', empId);

        setLoading(true);

        try {
            const response = await axiosJWT.post(`${apiBaseUrl}/uploadProfilePic`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.status === 200) {
                fetchPersonalInfo();
                setLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message || 'Failed to submit the form. Please try again later.';
                ToastNotification({ message: errorMessage });
                setLoading(false);
            } else {

                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
                setLoading(false);
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };

    const handleEditIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input click
        }
    };

    const fetchFormAdd = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "addressInformation" } });

            if (response.status === 200 && response.data.data) {
                setFormDataAdd(response.data.data);
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };

    const fetchForm = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getPermissionBasedDynamicForm`, { params: { "formType": "EmployeeProfile" } });

            if (response.status === 200 && response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };

    const getsubmitformdataP = async (value) => {
        setSubmitButtonLoading(true);
        try {
            if (value) {
                const apiUrl = `${apiBaseUrl}/profile`;
                const response = await axiosJWT.post(apiUrl, value);

                if (response.status === 200) {
                    closeEditModal();
                    fetchPersonalInfo();
                    ToastNotification({ message: response.data.message });
                    setSubmitButtonLoading(false);
                }
            }
        } catch (error) {
            setSubmitButtonLoading(false);
            console.error("Error occurred during API call:", error);
        }
    };

    const updateFormDataWithPersonalInfo = () => {
        if (!editData || !formData || formData.length === 0) return;

        const updatedFormData = { ...formData };
        const profileSection = updatedFormData.section.find(section => section.name === 'PersonalInfo');

        if (profileSection) {
            profileSection.Subsection.forEach(subsection => {
                subsection.fields.forEach(field => {
                    if (field.name in editData) {
                        field.value = editData[field.name];
                    }
                });
            });
        }

        setFormData(updatedFormData);
    };

    if (!viewData) {
        return <div>Loading...</div>;
    }



    return (
        <>

            <Address isOpen={isEditOpenADD} closeModal={closeEditModalADD} formData={form} getsubmitformdata={getsubmitformdata} empId={empId} loaderSubmitButton={SubmitButtonLoading} />
            <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={formData} data={editData} getsubmitformdata={getsubmitformdataP} empId={empId} loaderSubmitButton={SubmitButtonLoading} />
            <div className="card-body">
                {!showbutton ? null :
                    <span className="" onClick={openEditModal}>
                        <FaRegEdit style={{ cursor: 'pointer', float: 'right', color: 'var(--theme-pending-color-text)' }} size={15} />
                    </span>
                }
                <div className="row">
                    <div className="col-md-12">
                        <div className="profile-view">
                            <div className="profile-img-wrap">
                                <div className="profile-img">
                                    <img alt="#" src={Imgpa === '' ? '../assets/img/avatar-10.jpg' : Imgpa} />

                                    {/* {!showbutton ? null :
                                    <span className="edit-icon" onClick={handleEditIconClick}>
                                        <MdEdit />
                                    </span> } */}

                                    {loading ? (
                                        <span className="edit_profileloader" ></span>
                                    ) : (
                                        !showbutton ? null :
                                            <span className="edit-icon" onClick={handleEditIconClick}>
                                                <MdEdit />
                                            </span>
                                    )}


                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                                </div>
                            </div>

                            <div className="profile-basic">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="profile-info-left">
                                            <h2 className="user-name">{viewData.empName || ''}</h2>
                                            <h3 className="text-muted ">{viewData.role || ''}</h3>
                                            <h4 className="text-muted">{viewData.department || ''}</h4>

                                            <ul className="personal-info-header top-details">

                                                <li>
                                                    <div className="title">ID :</div>
                                                    <div className="text">
                                                        {viewData.empNumber || <>&nbsp;</>}
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="title"><FaPhone /> :</div>
                                                    <div className="text">
                                                        {viewData.mobileNumber || <>&nbsp;</>}
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="title"><MdEmail /> :</div>
                                                    <div className="text">{viewData.emailAddress || <>&nbsp;</>}</div>
                                                </li>
                                                <li>
                                                    <div className="title"><IoLocationSharp /> :</div>
                                                    <div className="text">{viewData.joiningCountry || <>&nbsp;</>}</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <ul className="personal-info-header-right top-details">

                                            <li>
                                                <div className="title">Birthday :</div>
                                                <div className="text">{viewData.DOB ? viewData.DOB : ''}</div>
                                            </li>
                                            <li>
                                                {showAddressAlert && (
                                                    <AlertWithButton
                                                        message="Please add your Address to complete your profile."
                                                        type="warning"
                                                        actionLabel="Add Address"
                                                        onAction={() => {
                                                            openEditModalADD();
                                                        }}
                                                    />
                                                )}

                                                <div className="title">Address :</div>
                                                <div className="text">
                                                    {viewData.address ? (
                                                        viewData.address.length > 35 ? (
                                                            <>
                                                                <div className='oxyem-tooltip-text'>
                                                                    {viewData.address.substr(0, 35)}...
                                                                    <GrTooltip className='oxyem-tooltip-icon' style={{ marginLeft: '5px' }} data-tooltip-id="my-tooltip-table-text" data-tooltip-content={viewData.address} />
                                                                    <Tooltip id="my-tooltip-table-text" type='dark' effect='solid' style={{ width: '40%', zIndex: '999' }} />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {viewData.address}
                                                            </>
                                                        )
                                                    ) : (
                                                        <>&nbsp;</>
                                                    )}
                                                    {viewData.address ? (
                                                        <>
                                                            {/* <FaRegEdit style={{marginLeft:'20px'  ,color: '#333' ,padding: '1px 0px 4px 1px'}} size={19} onClick={openEditModalADD}/> */}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {!showbutton ? null : <span className="add-btn-circle" onClick={openEditModalADD}>+</span>}
                                                        </>

                                                    )}

                                                </div>
                                            </li>
                                            <li>
                                                <div className="title">Gender :</div>
                                                <div className="text">{viewData.gender || <>&nbsp;</>}</div>
                                            </li>
                                            <li>
                                                <div className="title">Joining Date :</div>
                                                <div className="text">{viewData.dateOfJoining ? viewData.dateOfJoining : <>&nbsp;</>}</div>
                                            </li>
                                            <li>
                                                <div className="title">Reports to :</div>
                                                <div className="text">{viewData.reportingTo || <>&nbsp;</>}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tooltip id="my-tooltip-datatable" style={{ zIndex: 99999 }} />
            <ToastContainer />
        </>
    );
}
