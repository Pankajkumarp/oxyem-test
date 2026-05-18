import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import 'react-datepicker/dist/react-datepicker.css';
import currencySymbolMap from 'currency-symbol-map';
import numberToWords from 'number-to-words';
import { FaRegCheckCircle } from "react-icons/fa";
import { format } from "date-fns";
import { FaTimes } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoArrowBackOutline } from "react-icons/io5";
import TemplateOneInvoice from '../../Components/FormRender/TemplateTwo/fields/InvoiceTemplate/TemplateOneInvoice';
import TemplateTwoInvoice from '../../Components/FormRender/TemplateTwo/fields/InvoiceTemplate/TemplateTwoInvoice';
import TemplateThreeInvoice from '../../Components/FormRender/TemplateTwo/fields/InvoiceTemplate/TemplateThreeInvoice';
import TemplateFourInvoice from '../../Components/FormRender/TemplateTwo/fields/InvoiceTemplate/TemplateFourInvoice';

const Notes = dynamic(() => import('../../Components/Popup/Notes'), {
    ssr: false
});
export default function opportunity() {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d) ? "" : format(d, "dd MMM yyyy");
    };
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
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("customerInformation");
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [templateFor, setTemplateFor] = useState("");
    const [templateData, setTemplateData] = useState({});
    const [invoiceData, setInvoiceData] = useState({});
    const [tableData, settableData] = useState({});
    const [allData, setAllData] = useState({});
    const [taxpercent, setTaxpercent] = useState(0);
    const [idInvoice, setIdInvoice] = useState("");
    const [idInvoiceNo, setIdInvoiceNo] = useState("");
    const [currencySymbol, setCurrencySymbol] = useState("");
    const [dataStatus, setDataStatus] = useState("");
    const { id } = router.query;
    const fetchInvoiceInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/opportunity/invoiceView`, { params: { id: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setAllData(fetchedData)
                    setTemplateData(fetchedData.invoicePreview)
                    setTemplateFor(fetchedData?.template)
                    setCurrencySymbol(fetchedData.currencyName)
                    setIdInvoiceNo(fetchedData.invoiceNumber)
                    setDataStatus(fetchedData.status)
                    setInvoiceData(fetchedData.invoicePreview.invoiceData)
                    settableData(fetchedData.invoicePreview.tableData)
                    setTaxpercent(fetchedData.taxpercent)
                }

            }
        } catch (error) {

        }
    };

    useEffect(() => {
        const { id } = router.query;
        fetchInvoiceInfo(id);
        setIdInvoice(id)
    }, [id]);




    const handleTabClick = (tab) => {
        setActiveTab(tab);

    };
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const openNotesModal = async () => {
        setIsNotesModalOpen(true)
    }
    const closeNotesModal = async () => {
        setIsNotesModalOpen(false)
    }

    const symbol = currencySymbolMap(currencySymbol);
    const convertNumberToWords = (number) => {
        return numberToWords.toWords(number);
    };

    const handleWonClick = async () => {
        const payload = {
            ids: [idInvoice],
            status: "approved"
        }
        const response = await axiosJWT.post(`${apiUrl}/opportunity/invoiceApproval`, payload);
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
            router.push(`/createInvoice/view`);
        }
    }
    const handleLossClick = async () => {
        const payload = {
            ids: [idInvoice],
            status: "rejected"
        }
        const response = await axiosJWT.post(`${apiUrl}/opportunity/invoiceApproval`, payload);
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
            router.push(`/createInvoice/view`);
        }
    }
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'invoice-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);
    const updateDate = allData?.generatedDate || allData?.generatedDate
    let diffInDays;
    if (updateDate) {
        const givenDate = new Date(updateDate);
        const today = new Date();

        givenDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffInMs = today - givenDate;
        diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    }

    const formatMDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d) ? "" : format(d, "MMM yyyy");
    };
    const invoiceNo = allData?.invoiceNumber;
    const customer = allData?.invoicePreview?.invoiceData?.customerName;
    const month = allData?.invoicePreview?.invoiceData?.invoiceMonth;
    const handleBack = () => {
        router.back();
    };
    return (
        <>
            <Head>
                <title>View Invoice</title>
                <meta name="description" content={"View Invoice"} />
            </Head>
            {isNotesModalOpen ? (
                <Notes isOpen={isNotesModalOpen} closeModal={closeNotesModal} id={idInvoice} type={"Invoice"} />
            ) : (null)}
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"View Invoice"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index" id="oxyem_opportunity_page">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className="top-card-icon-b">
                                                            <span className='back-btn' onClick={handleBack}>
                                                                <IoArrowBackOutline />Back
                                                            </span>
                                                        </div>
                                                        <div className="center-part">
                                                            <div className="card-body -body skolrup-learning-card-body oxyem-time-managment">
                                                                <div className="row top_btn_opp">
                                                                    <div className='col-md-8'>
                                                                        <div className='top-heading-box-in'>
                                                                            <h1>
                                                                                {invoiceNo}

                                                                                {customer && (
                                                                                    <>
                                                                                        {" "}
                                                                                        <span className="text-muted">|</span> {customer}
                                                                                    </>
                                                                                )}

                                                                                {month && (
                                                                                    <> ({formatMDate(month)})</>
                                                                                )}
                                                                            </h1>
                                                                            <span className={`oxy-mark ms-2 oxyem-mark-${dataStatus}`}>{dataStatus}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-md-4'>
                                                                        <div className="combo_btn_opp">
                                                                            {dataStatus === "generated" && (
                                                                                <span className="won-loss-wrapper" ref={popupRef}>
                                                                                    <span
                                                                                        className={`btn-trigger ${showPopup ? "open" : ""}`}
                                                                                        onClick={() => setShowPopup(!showPopup)}
                                                                                        data-tooltip-content={"Click to change deal outcome or stage"}
                                                                                        data-tooltip-id={`my-tooltip-p`}
                                                                                    >
                                                                                        <span className='blue-icon'></span>Action
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
                                                                <div className="status-bar-insight">
                                                                    <div className="status-item">
                                                                        <span className="label">Invoice Created:</span>
                                                                        <span className="status-pill">
                                                                            {formatDate(updateDate)}
                                                                        </span>
                                                                    </div>

                                                                    <span className="divider">|</span>

                                                                    <div className="status-item muted">
                                                                        Last Updated: {
                                                                            diffInDays === 0
                                                                                ? 'Today'
                                                                                : diffInDays === 1
                                                                                    ? '1 day ago'
                                                                                    : `${diffInDays} days ago`
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab mt-3">

                                                                    <li className="nav-item">
                                                                        <a
                                                                            className={`nav-link ${activeTab === "customerInformation" ? 'active' : ''}`}
                                                                            onClick={() => handleTabClick("customerInformation")}
                                                                        >
                                                                            <div className="skolrup-profile-tab-link">Invoice Details</div>
                                                                        </a>
                                                                    </li>
                                                                    <li className="nav-item">
                                                                        <a
                                                                            className={`nav-link ${activeTab === "invoicePreview" ? 'active' : ''}`}
                                                                            onClick={() => handleTabClick("invoicePreview")}
                                                                        >
                                                                            <div className="skolrup-profile-tab-link">Invoice Preview</div>
                                                                        </a>
                                                                    </li>
                                                                </ul>


                                                                <div className="tab-content" >

                                                                    {activeTab === "customerInformation" ? (
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="row">
                                                                                    <div className="col-md-6">
                                                                                        <div className="card invoice-card-oxyem h-100">
                                                                                            <div className="card-header-middle-s">
                                                                                                <p className="main-heading-invoice"><img src='/assets/img/organization.png' alt='organization Details' /> Invoicing Entity Details</p>
                                                                                            </div>
                                                                                            {allData?.invoicePreview?.invoice_entityName && (
                                                                                                <div style={{ lineHeight: '1.85' }} className="px-3 py-4"
                                                                                                    dangerouslySetInnerHTML={{ __html: allData?.invoicePreview?.invoice_entityName }}
                                                                                                />
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <div className="card invoice-card-oxyem h-100">
                                                                                            <div className="card-header-middle-s">
                                                                                                <p className="main-heading-invoice"><img src='/assets/img/client.png' alt='Client Details' /> Client Details</p>
                                                                                            </div>
                                                                                            <div className="card-body">
                                                                                                <div className="address-grid">
                                                                                                    {allData?.invoicePreview?.invoiceData?.BTP && (
                                                                                                        <div className="address-card">
                                                                                                            <div className='client-address-section'>
                                                                                                                <span class="badge light mark-bg-BTP">Billing</span>
                                                                                                                <p className='mt-1'>{allData.invoicePreview.invoiceData.BTP}</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                    {allData?.invoicePreview?.invoiceData?.STP && (
                                                                                                        <div className="address-card">
                                                                                                            <div className='client-address-section'>
                                                                                                                <span class="badge light mark-bg-SHTP">Shipping</span>
                                                                                                                <p className='mt-1'>{allData.invoicePreview.invoiceData.STP}</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                               <div className="label" style={{color:'#212529bf', marginBottom:'10px'}}><b> Service Period:</b><br /><span  style={{color:'#000000'}}>{formatDate(allData?.invoicePreview?.invoiceData?.invoiceStartDate)} TO {formatDate(allData?.invoicePreview?.invoiceData?.invoiceEndDate)}</span></div>
                                                                                                <div className="info-grid">
                                                                                                    <div className="info-item">
                                                                                                        <div className="label"><b>Invoice Number:</b> <br /><span>{allData?.invoiceNumber}</span></div>
                                                                                                    </div>
                                                                                                    <div className="info-item">
                                                                                                        <div className="label"><b>Currency Name:</b> <br /><span>{allData?.invoicePreview?.invoiceData?.currencyType}</span></div>
                                                                                                    </div>
                                                                                                    {allData?.invoicePreview?.invoiceData?.purchaseNumber && (
                                                                                                        <div className="info-item">
                                                                                                            <div className="label"><b>Purchase Number:</b> <br /><span>{allData?.invoicePreview?.invoiceData?.purchaseNumber || "-"}</span></div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                    <div className="info-item">
                                                                                                        <div className="label"><b>Invoice Month:</b> <br /><span>{formatMDate(allData?.invoicePreview?.invoiceData?.invoiceMonth)}</span></div>
                                                                                                    </div>
                                                                                                    <div className="info-item">
                                                                                                        <div className="label"><b>Start Date:</b> <br /><span>{formatDate(allData?.invoicePreview?.invoiceData?.invoiceStartDate)}</span></div>
                                                                                                    </div>
                                                                                                    <div className="info-item">
                                                                                                        <div className="label"><b>End Date</b> <br /><span>{formatDate(allData?.invoicePreview?.invoiceData?.invoiceEndDate)}</span></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5">
                                                                                <div className="card invoice-card-oxyem h-100">
                                                                                    <div className="card-header-middle-s">
                                                                                        <p className="main-heading-invoice"><img src='/assets/img/list-items.png' alt='Invoice Items' />Invoice Items</p>
                                                                                    </div>
                                                                                    <div className="card-body">
                                                                                        <div className="table-responsive">
                                                                                            <table>
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th style={{ width: '65px' }}>Sr No.</th>
                                                                                                        <th>Description</th>
                                                                                                        <th className="text-end" style={{ width: '100px' }}>Amount</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    {allData?.lineItemsData?.map((item, index) => (
                                                                                                        <tr key={index}>
                                                                                                            <td>{index + 1}</td>
                                                                                                            <td>{item.description}</td>
                                                                                                            <td className="text-end" s>
                                                                                                                {currencySymbolMap(allData?.invoicePreview?.invoiceData?.currencyType)} {item.totalAmount}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    ))}
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                        <div className="totals">
                                                                                            <div><span>Untaxed Amount :</span> <b>{currencySymbolMap(allData?.invoicePreview?.invoiceData?.currencyType)}
                                                                                                {allData?.invoicePreview?.tableData?.totaltaxdata?.untaxedAmount}</b></div>
                                                                                            <div><span>Tax % :</span> <b>{taxpercent}</b></div>
                                                                                            <div className="total"><span>Total Amount :</span> <b> {currencySymbolMap(allData?.invoicePreview?.invoiceData?.currencyType)}
                                                                                                {allData?.invoicePreview?.tableData?.totaltaxdata?.totalAmount}</b></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : activeTab === "invoicePreview" ? (
                                                                        <div className='row justify-content-center'>
                                                                            <div className='col-xxl-10 col-md-12'>
                                                                                {(templateFor === "classicCorporate" || templateFor === "") && (
                                                                                    <TemplateOneInvoice InvoiceAllData={templateData} />
                                                                                )}

                                                                                {templateFor === "modernProfessional" && (
                                                                                    <TemplateTwoInvoice InvoiceAllData={templateData} />
                                                                                )}
                                                                                {templateFor === "brandedExecutive" && (
                                                                                    <TemplateThreeInvoice InvoiceAllData={templateData} />
                                                                                )}
                                                                                {templateFor === "modernCorporateGlobalRemittance" && (
                                                                                    <TemplateFourInvoice InvoiceAllData={templateData} />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ) : (null)}
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
            </div>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </>
    );
}
