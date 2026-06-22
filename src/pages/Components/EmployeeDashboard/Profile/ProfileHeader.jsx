/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { MdEdit } from "react-icons/md";
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import Address from '../Edit/Address';
import { Tooltip } from 'react-tooltip'
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';
import styles from './ProfileHeader.module.css';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
    FiEdit,
    FiPhone,
    FiMail,
    FiMapPin,
    FiHome,
    FiUser,
    FiUsers,
    FiCalendar,
    FiCheckCircle,
    FiGift,
    FiBriefcase,
    FiCreditCard,
    FiXCircle,
    FiDownload,
} from 'react-icons/fi';

export default function ProfileHeader({ empId, apiBaseUrl, hitAddressApi, handelactiveuser, showbutton, getEmpName, contactNumber }) {
    const cardRef = useRef();
    const [viewData, setViewData] = useState(null);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState([]);
    const form = [];
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isEditOpenADD, setIsEditOpenADD] = useState(false);
    const [Imgpa, setImg] = useState('../assets/img/avatar-10.jpg');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const [hasShownAddressAlert, setHasShownAddressAlert] = useState(false);

    useEffect(() => {
        if (
            viewData &&
            !viewData.address &&
            !hasShownAddressAlert
        ) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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


    const closeEditModalADD = () => {
        setIsEditOpenADD(false);
    };


    const [ImgBase64, setImgBase64] = useState('');
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
                    if (url) {
                        const timestampedUrl = `${url}?t=${new Date().getTime()}`;
                        setImg(timestampedUrl);
                        try {
                            const response = await fetch(
                                `/api/proxy-image?url=${encodeURIComponent(timestampedUrl)}`
                            );
                            const data = await response.json();
                            const base64Src = data.base64;
                            setImgBase64(base64Src)
                        } catch (err) {
                            console.warn('Could not convert image to base64:', err);
                            // fallback: ImgBase64 stays empty, Imgpa (URL) is used
                        }
                    }
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPersonalInfo();
        // eslint-disable-next-line react-hooks/immutability
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
        if (!editData || !formData || !formData.section) return;

        const updatedFormData = JSON.parse(JSON.stringify(formData));

        const profileSection = updatedFormData.section.find(
            section => section.name === 'PersonalInfo'
        );

        if (!profileSection) return;

        profileSection.Subsection.forEach(subsection => {
            subsection.fields.forEach(field => {

                // 🔹 Generic mapping for all fields
                if (editData[field.name] !== undefined) {
                    field.value = editData[field.name];
                }

                // 🔹 Special case: role (React Select)
                if (field.name === "role" && editData.role) {
                    field.value =
                        typeof editData.role === "object"
                            ? editData.role
                            : { label: editData.role, value: editData.roleId };
                }

                // 🔹 Optional: department override (if needed)
                if (field.name === "department") {
                    field.value = editData.department;
                }

            });
        });

        setFormData(updatedFormData);
    };



    // Replace the openDownloadIDCard function with this:
    const openDownloadIDCard = async () => {
        const element = cardRef.current;

        // ✅ If ImgBase64 is already set, swap img src before capture
        if (ImgBase64) {
            const images = element.querySelectorAll('img');
            images.forEach(img => {
                img.src = ImgBase64;
            });
        }

        const canvas = await html2canvas(element, {
            scale: 4,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("Employee-ID-Card.pdf");
    };


    if (!viewData) {
        return <div className={styles.loadingBox}>Please wait data is Loading...</div>;
    }
    return (
        <>

            <Address isOpen={isEditOpenADD} closeModal={closeEditModalADD} formData={form} getsubmitformdata={getsubmitformdata} empId={empId} loaderSubmitButton={SubmitButtonLoading} />
            <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={formData} data={editData} getsubmitformdata={getsubmitformdataP} empId={empId} loaderSubmitButton={SubmitButtonLoading} />
            <div className="card-body-4">
                <div className={styles.employeeCard}>
                    <div className="row align-items-center">

                        <div className="col-lg-12">
                            <div ref={cardRef} className={styles.cardContainer} style={{ 
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        zIndex: -1,
        pointerEvents: 'none'
    }}>
                                <div className={styles.idCard}>
                                    <div className={styles.topHeader}>
                                        <span className={styles.oxy}>O</span>
                                        <span className={styles.xytal}>XYTAL</span>
                                    </div>

                                    <div className={styles.profilecardBody}>
                                        <img
                                            src={ImgBase64 || Imgpa || '../assets/img/avatar-10.jpg'}
                                            alt={viewData.empName || ''}
                                            className={styles.profileImage}
                                        />

                                        <h2 className={styles.idemployeeName}>{viewData.empName || ''}</h2>

                                        <p className={styles.iddesignation}>{viewData.role || ''}</p>

                                        <p className={styles.idemployeeId}>{viewData.empNumber}</p>

                                        <p className={styles.bloodGroup}>{viewData?.bloodGroup || "Not Added"}</p>
                                    </div>

                                    <div className={styles.bottomBar}></div>
                                </div>

                                {/* BACK SIDE */}
                                <div className={styles.idCardRight}>
                                    <div className={styles.backTopSection}>
                                        <div className={styles.emergencySection}>
                                            <p className="label">Emergency No.</p>
                                            <p className="value">{contactNumber || "Not Added"}</p>
                                        </div>

                                        <div className={styles.addressSection}>
                                            <p className="label">Registered office Address</p>

                                            <p className={styles.companyName}>
                                                Oxytal India Private Limited
                                            </p>

                                            <p className="addressText">
                                                76, RK Puram Jatal Road, Near Shiv Mandir
                                            </p>

                                            <p className="addressText">
                                                Panipat - Haryana
                                            </p>

                                            <p className="addressText">
                                                India - 132103
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* LEFT SIDE */}
                        <div className="col-lg-6">
                            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
                                {/* IMAGE */}
                                <div className={styles.profileWrapper}>
                                    <div className={styles.profileRing}>
                                        <img
                                            src={Imgpa === '' ? '../assets/img/avatar-10.jpg' : Imgpa}
                                            alt=""
                                            className={styles.profileRingImg}
                                        />
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

                                {/* USER INFO */}
                                <div className="flex-grow-1 w-100">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
                                        <div>
                                            <h2 className={styles.employeeName}>{viewData.empName || ''}</h2>
                                            <h6 className={styles.employeeRole}>{viewData.role}</h6>
                                            <p className={styles.employeeDepartment}>
                                                {viewData.department}
                                            </p>
                                        </div>
                                        <div
                                            className={`${styles.statusBadge} ${viewData.isActive ? styles.active : styles.inactive
                                                }`}
                                        >
                                            {viewData.isActive ? <FiCheckCircle /> : <FiXCircle />}
                                            {viewData.isActive ? 'Active' : 'Inactive'}
                                        </div>

                                    </div>

                                    {/* INFO GRID */}
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <FiCreditCard />
                                            <span>ID : {viewData.empNumber}</span>
                                        </div>

                                        <div className={styles.infoItem}>
                                            <FiPhone />
                                            <span>{viewData.mobileNumber}</span>
                                        </div>

                                        <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                                            <FiMail />
                                            <span>{viewData.emailAddress}</span>
                                        </div>
                                    </div>

                                    {/* TAGS */}
                                    <div className="d-flex flex-wrap gap-3 mt-4">
                                        <div className={`${styles.tag} ${styles.location}`}>
                                            <FiMapPin />
                                            {viewData.joiningCountry}
                                        </div>

                                        <div className={`${styles.tag} ${styles.permanent}`}>
                                            <FiBriefcase />
                                            {viewData.employeeType}
                                        </div>

                                        <div className={`${styles.tag} ${styles.remote}`}>
                                            <FiHome />
                                            {viewData?.worktype || "Remote"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="col-lg-4">
                            <div className={styles.centerSection}>
                                <div className={styles.detailsList}>
                                    <div className={styles.detailRow}>
                                        <div className={styles.labelWrap}>
                                            <div className={styles.iconBox}>
                                                <FiGift />
                                            </div>
                                            <span>Birthday</span>
                                        </div>

                                        <strong>{viewData.DOB ? viewData.DOB : ''}</strong>
                                    </div>

                                    <div className={styles.detailRow}>
                                        <div className={styles.labelWrap}>
                                            <div className={styles.iconBox}>
                                                <FiUser />
                                            </div>
                                            <span>Gender</span>
                                        </div>

                                        <strong>{viewData.gender || <>&nbsp;</>}</strong>
                                    </div>

                                    <div className={styles.detailRow}>
                                        <div className={styles.labelWrap}>
                                            <div className={styles.iconBox}>
                                                <FiCalendar />
                                            </div>
                                            <span>Joining Date</span>
                                        </div>

                                        <strong>{viewData.dateOfJoining ? viewData.dateOfJoining : <>&nbsp;</>}</strong>
                                    </div>

                                    <div className={`${styles.detailRow} border-0 pb-0`}>
                                        <div className={styles.labelWrap}>
                                            <div className={styles.iconBox}>
                                                <FiUsers />
                                            </div>
                                            <span>Reports To</span>
                                        </div>

                                        <strong>{viewData.reportingTo || <>&nbsp;</>}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className={styles.rightSection}>
                                {showbutton && (<button className={styles.editBtn} onClick={openEditModal}>
                                    <FiEdit />
                                    Edit Profile
                                </button>)}
                                <button className={styles.downloadBtn} onClick={openDownloadIDCard}>
                                    <FiDownload />
                                    Download ID Card
                                </button>
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