import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbsdiscription.jsx';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import { FaRegCheckCircle } from "react-icons/fa";
import PricingRender from './pricicngRender.js';
import { FaTimes } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
const Notes = dynamic(() => import('../../Components/Popup/Notes'), {
    ssr: false
});
export default function CreatePricingViewId() {  // Default to empty array if not provided
    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ) {
                setShowPopup(false);
            }
        };

        if (showPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup]);
    const [pricingId, setPricingId] = useState("");

    const [alldata, setAlldata] = useState({});
    const [dataStatus, setDataStatus] = useState("");
    const { id } = router.query;
    const fetchOpportunityInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/opportunity/priceView`, { params: { id: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setAlldata(fetchedData)
                    setDataStatus(fetchedData.status)
                }
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        const { id } = router.query;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOpportunityInfo(id);
        setPricingId(id)
    }, [id]);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const openNotesModal = async () => {
        setIsNotesModalOpen(true)
    }
    const closeNotesModal = async () => {
        setIsNotesModalOpen(false)
    }

    const handleWonClick = async () => {
        const payload = alldata
        // eslint-disable-next-line react-hooks/immutability
        payload.status = "Approve";
        const formData = new FormData();
        formData.append('formData', JSON.stringify(payload));
        const response = await axiosJWT.post(`${apiUrl}/opportunity/addPricing`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response) {
            const message = 'You have successfully Change Status <strong>Approve</strong>!';
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
            router.push(`/createPricing/view`);
        }
    }
    const handleLossClick = async () => {
        const payload = alldata
        // eslint-disable-next-line react-hooks/immutability
        payload.status = "Reject";
        const formData = new FormData();
        formData.append('formData', JSON.stringify(payload));
        const response = await axiosJWT.post(`${apiUrl}/opportunity/addPricing`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response) {
            const message = 'You have successfully Change Status <strong>Reject</strong>!';
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
            router.push(`/createPricing/view`);
        }
    }

    const updateDate = alldata?.modifiedDate || alldata?.createDate
    let diffInDays;
    if (updateDate) {
        const givenDate = new Date(updateDate);
        const today = new Date();

        givenDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffInMs = today - givenDate;
        diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    }
    return (
        <>
            <Head>
                <title>Project Opportunity Pricing | View Cost & Proposal Details</title>
                <meta name="description" content={"View detailed pricing, cost breakdowns, and proposal information for this project opportunity. Compare options and make informed decisions with complete transparency."} />
            </Head>
            {isNotesModalOpen ? (
                <Notes isOpen={isNotesModalOpen} closeModal={closeNotesModal} id={pricingId} type={"Pricing"} />
            ) : (null)}
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs
                                            maintext={"Create DealFlow - Deal & Pricing Hub"}
                                            discription={"Create DealFlow - Deal & Pricing Hub, tracks deals, pricing, milestones, and project financials"}
                                        />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index" id="oxyem_opportunity_page">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border opportunity-view-page" id="sk-create-page">

                                                        <div className="center-part">
                                                            <div className="card-body -body skolrup-learning-card-body oxyem-time-managment oxyem-pricing-module">
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <div className="user-text skolrup-m-user-text">

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center opportunity-header mb-1">
                                                                    <div className='oxyem-opportunity-header-left'>
                                                                        <span className={`oxyem-mark-opp oxyem-mark-${dataStatus}`}>{dataStatus}</span> <p className='main-heading-opportunity'>{alldata?.datapricinginfo?.projectName}</p>
                                                                    </div>
                                                                    <div className='oxyem-opportunity-header-right prc-oxy'>
                                                                        <div className="combo_btn_opp">
                                                                            {dataStatus === "open" && (
                                                                                <span className="won-loss-wrapper" ref={popupRef}>
                                                                                    <span
                                                                                        className={`btn-trigger ${showPopup ? "open" : ""}`}
                                                                                        onClick={() => setShowPopup(!showPopup)}
                                                                                        data-tooltip-content={"Click to change deal outcome or stage"}
                                                                                        data-tooltip-id={`my-tooltip-p`}
                                                                                    >
                                                                                        <span className='blue-icon'></span>Proposal
                                                                                        {showPopup ? (
                                                                                            <FaChevronUp className="chevron-icon" />
                                                                                        ) : (
                                                                                            <FaChevronDown className="chevron-icon" />
                                                                                        )}
                                                                                    </span>

                                                                                    {showPopup && (
                                                                                        <div className="won-loss-popup">
                                                                                            <div
                                                                                                className="btn-opportunity-drop"
                                                                                                onClick={() => {
                                                                                                    handleWonClick();
                                                                                                    setShowPopup(false);
                                                                                                }}
                                                                                            >
                                                                                                Approve
                                                                                            </div>

                                                                                            <div
                                                                                                className="btn-opportunity-drop"
                                                                                                onClick={() => {
                                                                                                    handleLossClick();
                                                                                                    setShowPopup(false);
                                                                                                }}
                                                                                            >
                                                                                                Reject
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                            <span className='btn-notes-opp' onClick={openNotesModal}>Notes</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <PricingRender data={alldata} pricingId={pricingId} diffInDays={diffInDays} dataStatus={dataStatus} />

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
                </div>
            </div>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </>
    );
}
