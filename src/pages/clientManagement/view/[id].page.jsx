/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import 'react-datepicker/dist/react-datepicker.css';
import DocumentsEvidence from "./DocumentsEvidence";
import Avatar from 'react-avatar';
import SecTab from '../../Components/Employee/SecTab';
import { FaTimes } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
const Activity = dynamic(() => import('./activity'), {
    ssr: false
});
import { IoArrowBackOutline } from "react-icons/io5";
export default function ViewClient({ userFormdata }) {
    const router = useRouter();
    const [data, setData] = useState({});
    const [businessTypes, setBusinessTypes] = useState([]);
    const [businessTypeName, setBusinessTypeName] = useState("");
    const [idClient, setIdClient] = useState("");
    const [dataStatus, setDataStatus] = useState("");
    const { id } = router.query;
    const fetchClientInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/client/view`, { params: { id: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setData(fetchedData)
                    setDataStatus(fetchedData.status)
                }

            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        const { id } = router.query;
        fetchClientInfo(id);
        setIdClient(id)
        // eslint-disable-next-line react-hooks/immutability
        fetchBusinessType()
    }, [id]);

    const fetchBusinessType = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                params: { isFor: "businessType" },
            });

            const list = response.data?.data || [];
            setBusinessTypes(list);
        } catch (error) {
            console.error("Error fetching business type:", error);
        }
    };

    useEffect(() => {
        if (
            data?.clientinfodata?.businessType &&
            businessTypes.length > 0
        ) {
            const match = businessTypes.find(
                (item) => item.id === data.clientinfodata.businessType
            );

            setBusinessTypeName(match?.name || "");
        }
    }, [data, businessTypes]);

    const businessTypeImageMap = {
        "Health": "/assets/img/healthcare-c.png",
        "Education": "/assets/img/education.png",
        "Retailer": "/assets/img/retailer.png",
        "Alcohol Industry": "/assets/img/drink.png",
    };
    const businessTypeImage =
        businessTypeImageMap[businessTypeName] ||
        "/assets/img/defaut-c.png";
    const [editForm, setEditForm] = useState(false);
    const showForm = () => {
        setEditForm(true)
    };
    const cancelEditForm = () => {
        setEditForm(false)
    };
    const normalizeAddressPayload = (data) => {
        const fields =
            data?.section?.[0]?.fields ?? [];

        const flatObject = fields.reduce((acc, field) => {
            acc[field.name] = field.attributeValue ?? "";
            return acc;
        }, {});

        // ensure addressId exists
        flatObject.addressId = flatObject.addressId || data.addressId || uuidv4();

        return flatObject;
    };
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day < 10
        const month = date.toLocaleString('default', { month: 'short' }); // Get abbreviated month name
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };
    const currentDate = new Date();
    const mergeAddressIntoData = (data, newAddress) => {
        const addressInfoData = [...(data.addressInfoData || [])];

        const index = addressInfoData.findIndex(
            (item) => item.addressId === newAddress.addressId
        );

        if (index !== -1) {
            // ✅ Update existing address
            addressInfoData[index] = {
                ...addressInfoData[index],
                ...newAddress
            };
        } else {
            // ✅ Add new address
            addressInfoData.push({
                ...newAddress,
                srNo: addressInfoData.length + 1,
                status: "Active",
                createdDate: formatDate(currentDate)
            });
        }

        return {
            ...data,
            addressInfoData
        };
    };

    const getEditformdata = async (getData) => {
        const flatAddress = normalizeAddressPayload(getData);
        const updatedData = mergeAddressIntoData(data, flatAddress);
        const formData = new FormData();
        formData.append('formData', JSON.stringify(updatedData));
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/client/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response) {
                const message = 'You have successfully <strong>Add new Address</strong>!';
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <FaRegCheckCircle style={{
                            fontSize: '35px',
                            marginRight: '10px',
                            color: '#4caf50'
                        }} />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
                            onClick={() => toast.dismiss(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
                                marginLeft: 'auto',
                                cursor: 'pointer',
                                fontSize: '20px',
                            }}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ), {
                    icon: null, // Disable default icon
                    duration: 7000,
                    style: {
                        border: '1px solid #4caf50',
                        padding: '8px',
                        color: '#4caf50',
                    },
                });
                setTimeout(() => {
                    fetchClientInfo(id);
                }, 1000);
                setEditForm(false)
            }
        } catch (error) {
            console.error(error)
        }

    };
    const addressTypeMap = {
        BTP: "Billing",
        SHTP: "Shipping",
    };
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'client-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);
    const handleBack = () => {
        router.back();
    };
    const handleWonClick = async () => {
        const payload = {
            ids: [idClient],
            status: "Active"
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.post(`${apiUrl}/client/Approval`, payload);
        if (response) {
            const message = 'You have successfully Change Status <strong>Active</strong>!';
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <FaRegCheckCircle style={{
                        fontSize: '35px',
                        marginRight: '10px',
                        color: '#4caf50'
                    }} />
                    <span dangerouslySetInnerHTML={{ __html: message }}></span>
                    <button
                        onClick={() => toast.dismiss(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#4caf50',
                            marginLeft: 'auto',
                            cursor: 'pointer',
                            fontSize: '20px',
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            ), {
                icon: null, // Disable default icon
                duration: 7000,
                style: {
                    border: '1px solid #4caf50',
                    padding: '8px',
                    color: '#4caf50',
                },
            });
            router.push(`/clientManagement`);
        }
    }
    const handleLossClick = async () => {
        const payload = {
            ids: [idClient],
            status: "Inactive"
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.post(`${apiUrl}/client/Approval`, payload);
        if (response) {
            const message = 'You have successfully Change Status <strong>Inactive</strong>!';
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <FaRegCheckCircle style={{
                        fontSize: '35px',
                        marginRight: '10px',
                        color: '#4caf50'
                    }} />
                    <span dangerouslySetInnerHTML={{ __html: message }}></span>
                    <button
                        onClick={() => toast.dismiss(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#4caf50',
                            marginLeft: 'auto',
                            cursor: 'pointer',
                            fontSize: '20px',
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            ), {
                icon: null, // Disable default icon
                duration: 7000,
                style: {
                    border: '1px solid #4caf50',
                    padding: '8px',
                    color: '#4caf50',
                },
            });
            router.push(`/clientManagement`);
        }
    }
    return (
        <>
            <Head>
                <title>View Client</title>
                <meta name="description" content={"View Client"} />
            </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Create Client"} />
                                    </div>
                                </div>
                                <div className="row" id="oxyem_client_page">
                                    <div className="col-lg-8 col-xl-8">
                                        <div className="card flex-fill comman-shadow oxyem-index" >
                                            <div className="center-part">
                                                <div className="card-body">
                                                    <div className="top-card-icon-b d-flex justify-content-between">
                                                        <span className='back-btn' onClick={handleBack}>
                                                                                                         <IoArrowBackOutline />Back
                                                        </span>
                                                        <div className='d-flex'>
                                                        {dataStatus === "open" ? (
                                                                <>
                                                                    <span className='btn-opportunity-won' onClick={handleWonClick}>Active</span>
                                                                    <span className='btn-opportunity-loss mx-0' onClick={handleLossClick}>Inactive</span>
                                                                </>
                                                            ) : (null)}  
                                                            </div>
                                                    </div>
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border">
                                                        <div className='top-heading-client align-items-center mb-3'>
                                                            <h2>Business Information</h2>
                                                            <span className={`oxyem-mark-${dataStatus}`}>{dataStatus}</span>
                                                        </div>
                                                        <div className='main-top-box-client-view'>
                                                            <div className='sub-top-box-client-view sub-top-box-client-view-l'>
                                                                <h6>Client Information</h6>
                                                                {businessTypeName && (
                                                                    <div className='inner-client-bx'>
                                                                        <img
                                                                            src={businessTypeImage}
                                                                            className="icon-client-t"
                                                                            alt={businessTypeName}
                                                                        />
                                                                        <div className='inner-client-tx'>
                                                                            <span>{businessTypeName}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <p>Client Name: {data?.clientinfodata?.clientName}</p>
                                                                <p>Client Email: {data?.clientinfodata?.emailAddress}</p>
                                                            </div>
                                                            <div className='sub-top-box-client-view'>
                                                                <h6>Client Document</h6>
                                                                <DocumentsEvidence documents={data?.pricingDocument || []} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card flex-fill comman-shadow oxyem-index client-address-section">
                                            <div className="center-part">
                                                <div className="card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className='top-heading-client align-items-center mb-3'>
                                                            <h2>Address Information</h2>
                                                            <div className="address-actions">
                                                                <button className="btn btn-oxyem" onClick={showForm}>+ Add Address</button>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {editForm ? (
                                                                <SecTab
                                                                    AdduserContent={userFormdata}
                                                                    headingContent={""}
                                                                    getsubmitformdata={getEditformdata}
                                                                    pagename={"createClient"}
                                                                    cancelClickAction={cancelEditForm}
                                                                />
                                                            ) : (null)}
                                                        </div>
                                                        <div className="address-list">
                                                            {data?.addressInfoData?.map((item) => {

                                                                return (
                                                                    <div className="address-card" key={item.addressId}>
                                                                        {/* Top row */}
                                                                        <div className="address-header">
                                                                            <div className="badge-group">
                                                                                <span className={`badge light mark-bg-${item.type}`}>
                                                                                    {addressTypeMap[item.type] || item.type}
                                                                                </span>
                                                                            </div>
                                                                            <div className='top-stauts-section-c'>
                                                                                <span className={`mark-client mark-client-${item.status}`}></span>

                                                                            </div>
                                                                        </div>

                                                                        {/* Body */}
                                                                        <div className="address-body">
                                                                            <Avatar
                                                                                name={item.contactPersonName}
                                                                                size={30}
                                                                                maxInitials={2}   // 👈 important
                                                                                textSizeRatio={2.25}
                                                                                round={true}
                                                                                style={{
                                                                                    fontSize: "12px",
                                                                                    objectFit: 'cover'
                                                                                }}
                                                                            />

                                                                            <div className="address-info">
                                                                                <h5>{item.contactPersonName}</h5>
                                                                                <p>
                                                                                    {item.adressDetails}
                                                                                    {item.adressDetails2 && `, ${item.adressDetails2}`}
                                                                                    {item.adressDetails3 && `, ${item.adressDetails3}`}
                                                                                    {item.state && `, ${item.state}`}
                                                                                    {item.country && `, ${item.country}`}
                                                                                    {item.pinCode && `, ${item.pinCode}`}
                                                                                </p>
                                                                            </div>
                                                                            <span className="date">{item.createdDate}</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-xl-4">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body card-body-activity">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className='top-heading-client mb-3'>
                                                            <h2>Activity Information</h2>
                                                        </div>
                                                        <Activity id={idClient} type={"client"} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </>
    );
}
export async function getServerSideProps(context) {
    const cookies = context.req.headers.cookie;
    const accessToken = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1] : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await axios.get(`${apiUrl}/getDynamicForm`, {
            params: { formType: 'createClientInner' },
            headers: {
                Authorization: accessToken,
            },
        });

        if (response.data.errorMessage === "Access denied") {
            return {
                redirect: {
                    destination: context.req.headers.referer || '/',
                    permanent: false,
                },
            };
        }
        return {
            props: { userFormdata: response.data.data },
        };

    } catch (error) {
        console.error(error)
        return {
            redirect: {
                destination: context.req.headers.referer || '/',
                permanent: false,
            },
        };
    }
}
