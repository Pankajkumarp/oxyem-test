import React, { useState, useEffect, useRef } from 'react';
import MUIDataTable from "mui-datatables";
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { FaPlus } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import { axiosJWT } from '../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import { FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import currencySymbolMap from 'currency-symbol-map';
import numberToWords from 'number-to-words';
import pageTitles from '../../common/pageTitles.js';
import { FaRegCheckCircle} from "react-icons/fa";
const DynamicForm = dynamic(() => import('../Components/CommanForm.jsx'), {
    ssr: false
});
const Notes = dynamic(() => import('../Components/Popup/Notes'), {
    ssr: false
});
export default function opportunity({ userFormdata }) {  // Default to empty array if not provided
    const router = useRouter();
    const showButton = "";
    const pagename = "createPricing";

    const [formvalue, setFormvalue] = useState(userFormdata);

    const [calculate, setcalculate] = useState(false);
    const [fields, setfields] = useState([]);
    const formbuttons = formvalue.section[1].buttons;
    const formfinalbuttons = formvalue.section[2].buttons;
    const [activeTab, setActiveTab] = useState(formvalue.section[0].SectionName);
    const [tabArray, setTabArray] = useState([]);
    useEffect(() => {
        if (!tabArray.includes(activeTab) && activeTab !== null) {
            setTabArray((prevTabArray) => [...prevTabArray, activeTab]);
        }
    }, [activeTab]);

    const [isTabclick, setisTabclick] = useState(true);
    const [tableSection, settableSection] = useState("show");

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [existingData, setexistingData] = useState([]);
    // Merge existing data with form fields
    const mergeDataWithFields = (fields, existingData) => {
        const existingDataMap = existingData.reduce((acc, item) => {
            acc[item.attribute] = item.attributevalue;
            return acc;
        }, {});

        return fields.reduce((acc, field) => {
            acc[field.name] = existingDataMap[field.name] || field.value || '';
            return acc;
        }, {});
    };
    const initialData = mergeDataWithFields(fields, existingData);


    const options = {
        responsive: "standard",
        filterType: 'checkbox',
        search: false,
        filter: false,
        download: false,
        print: false,
        viewColumns: false,
        selectableRows: 'none',
        pagination: false,
        rowsPerPage: 30,
        count: 0,
    };


    const [Customerinfodata, setCustomerInfo] = useState([]);
    const [lineItemsData, setLineItems] = useState([]);

    const [summaryCost, setSummaryCost] = useState({});
    const [invoiceData, setInvoiceData] = useState({});
    const [tableData, settableData] = useState({});
    const [totaltaxdata, setTotaltaxdata] = useState({
        untaxedAmount: "0",
        tax: "0",
        totalAmount: "0",
    });


    const [taxpercent, setTaxpercent] = useState(0);

    const handleTaxChange = (e) => {
        const newTax = e.target.value;
        if (newTax >= 0) {
            setTaxpercent(newTax);
        }
    };

    useEffect(() => {
        const totalUntaxedAmount = lineItemsData.reduce((acc, item) => {
            const totalAmount = parseFloat(item.totalAmount);
            return acc + (isNaN(totalAmount) ? 0 : totalAmount);
        }, 0);

        const validTaxpercent = isNaN(taxpercent) ? 0 : taxpercent;
        const calculatedTax = (totalUntaxedAmount * validTaxpercent) / 100;
        const calculatedTotalAmount = totalUntaxedAmount + calculatedTax;
        setTotaltaxdata({
            untaxedAmount: totalUntaxedAmount.toFixed(2).toString(),
            tax: validTaxpercent.toString(),
            totalAmount: calculatedTotalAmount.toFixed(2).toString(),
        });

    }, [lineItemsData, taxpercent]);


    const initializeDataForTab = (tab) => {

        const selectedSection = formvalue.section.find(section => section.SectionName === tab);

        if (selectedSection && selectedSection.Subsection.length > 0) {

            const initialRow = mergeDataWithFields(selectedSection.Subsection[0].fields, []);

            return [initialRow]; // Return an array with the initial row

        }

        return [];

    };


    const handleTabClick = (tab) => {
        if (tabArray.includes(tab)) {
            if (activeTab !== tab) {
                setActiveTab(tab);
                setfields(formvalue.section.find(section => section.SectionName === tab).Subsection[0].fields);
                if (tab === "Customer Information" && Customerinfodata.length === 0) {
                    setCustomerInfo(initializeDataForTab(tab));
                } else if (tab === "Line Items" && lineItemsData.length === 0) {
                    setLineItems(initializeDataForTab(tab));
                }
            }
        } else {
            console.log(`${tab} is not in the tabArray`);
        }

    };


    const addRow = () => {

        const newRow = mergeDataWithFields(fields, existingData);

        if (activeTab === "Customer Information") {

            //setCustomerInfo([...Customerinfodata, newRow]);

        } else if (activeTab === "Line Items") {

            setLineItems([...lineItemsData, newRow]);

        }

    };


    useEffect(() => {

        const initialSection = formvalue.section.find(section => section.SectionName === activeTab);

        if (initialSection && initialSection.Subsection.length > 0) {

            setfields(initialSection.Subsection[0].fields);

            // Initialize data for the active tab only if it's empty

            if (activeTab === "Customer Information" && Customerinfodata.length === 0) {

                setCustomerInfo(initializeDataForTab(activeTab));

            } else if (activeTab === "Line Items" && lineItemsData.length === 0) {

                setLineItems(initializeDataForTab(activeTab));

            }

        }

    }, [activeTab]);







    const handleDeleteRow = (rowIndex) => {
        let updatedData;
        if (activeTab === "Customer Information") {
            updatedData = [...Customerinfodata];
            updatedData.splice(rowIndex, 1); // Remove the row at the specified index
            setCustomerInfo(updatedData);
        } else if (activeTab === "Line Items") {
            updatedData = [...lineItemsData];
            updatedData.splice(rowIndex, 1);
            setLineItems(updatedData);
        }
    };
    const columns = fields.map(field => ({
        name: field.name,
        label: field.label,
        options: {
            filter: field.isfilter,
            sort: field.issort,
            customBodyRender: (value, tableMeta, updateValue) => {
                const rowIndex = tableMeta.rowIndex; // Get the current row index
                const error = errors[field.name] ? errors[field.name][rowIndex] : undefined; // Get the error for the specific row

                if (field.type === 'Text') {
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            <input
                                className={`form-control sr-no-txt`}
                                value={value || ""}
                                disabled={field.isDisabled || ""}
                                placeholder={field.placeholder}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (
                                        newValue === "" || // Allow empty value
                                        (newValue.match(/^\d*\.?\d*$/) && parseFloat(newValue) > 0)
                                    ) {
                                        updateValue(newValue); // Update the MUI DataTable value
                                        handleChangeValue(field.name, newValue, rowIndex); // Update the local state
                                    }
                                }}
                            />
                        </span>
                    );
                } else if (field.type === 'Textarea') {
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            <textarea
                                className={`form-control sr-no-txt`}
                                value={value || ""}
                                disabled={field.isDisabled || ""}
                                placeholder={field.placeholder}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    updateValue(newValue); // Update the MUI DataTable value
                                    handleChangeValue(field.name, newValue, rowIndex); // Update the local state
                                }}
                            />
                        </span>
                    );
                } else if (field.type === 'srNo') {
                    return (
                        <div className={error ? "table_field_error" : "sr_no_f"}>
                            {rowIndex + 1 || ""}
                        </div>
                    );
                } else if (field.type === 'action') {
                    const rowCount = activeTab === "Customer Information" ? Customerinfodata.length :
                        activeTab === "Line Items" ? lineItemsData.length : 0;

                    return (
                        <>
                            {rowCount > 1 && (
                                <button
                                    className="btn_cancal_tb"
                                    onClick={() => handleDeleteRow(rowIndex)}
                                >
                                    <RiDeleteBinLine />
                                </button>
                            )}
                        </>
                    );
                } else {
                    return value; // Default case
                }
            },
            customHeadRender: (columnMeta, updateColumn) => {
                if (field.name === "srNo") {
                    return (
                        <th className="custom-class-for-invocie custom-class-for-srNo">
                            {columnMeta.label}
                        </th>
                    );
                }
                if (field.name === "totalAmount") {
                    return (
                        <th className="custom-class-for-invocie custom-class-for-totalam">
                            {columnMeta.label}
                        </th>
                    );
                }
                return (
                    <th className="custom-class-for-invocie">
                        {columnMeta.label}
                    </th>
                );
            }
        }
    }));


    const [errors, setErrors] = useState({});
    const handleChangeValue = async (fieldName, value, rowIndex) => {
        let updatedData;
        if (activeTab === "Customer Information") {
            updatedData = [Customerinfodata];
        } else if (activeTab === "Line Items") {
            updatedData = [...lineItemsData];
        }
        if (activeTab === "Customer Information") {
            updatedData[0] = {
                ...updatedData[0],
                [fieldName]: value
            };
        } else {
            updatedData[rowIndex] = {
                ...updatedData[rowIndex],
                [fieldName]: value
            };
        }
        if (activeTab === "Customer Information") {
            setCustomerInfo(updatedData);
        } else if (activeTab === "Line Items") {
            setLineItems(updatedData);
        }
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            if (newErrors[fieldName]) {
                newErrors[fieldName][rowIndex] = undefined; // Clear the error for the specific row
            }
            return newErrors;
        });
        setFormvalue({ ...formvalue });
    };



    const validateFields = (fields) => {
        const errors = {};
        let currentData;
        if (activeTab === "Customer Information") {
            currentData = Customerinfodata;
        } else if (activeTab === "Line Items") {
            currentData = lineItemsData;
        }

        currentData.forEach((row, rowIndex) => {
            fields.forEach(field => {
                if (field.validations) {
                    field.validations.forEach(validation => {
                        if (validation.type === 'required' && !row[field.name]) {
                            if (!errors[field.name]) {
                                errors[field.name] = [];
                            }
                            errors[field.name][rowIndex] = validation.message; // Store error for specific row
                        }
                    });
                }
            });
        });
        return errors;
    };







    const handleChangess = (currentIndex) => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < content.section.length) {
            setActiveTab(content.section[nextIndex].SectionName);
        }
    };

    const [sectionerrors, setSectionErrors] = useState({});
    const [idInvoice, setIdInvoice] = useState("");
    const [idInvoiceNo, setIdInvoiceNo] = useState("");
    const [idClientw, setidClientw] = useState("");
    const [opportyId, setopportyId] = useState("");
    const [currencySymbol, setCurrencySymbol] = useState("");
    const submitformdata = async (value) => {
        const inputData = value
        const transformedData = {
            customerName: typeof inputData.customerName === 'object' && inputData.customerName !== null
                ? inputData.customerName.value
                : inputData.customerName,
            BTP: typeof inputData.BTP === 'object' && inputData.BTP !== null
                ? inputData.BTP.value
                : inputData.BTP,
            STP: typeof inputData.STP === 'object' && inputData.STP !== null
                ? inputData.STP.value
                : inputData.STP,

            purchaseNumber: inputData.purchaseNumber,
            invoiceMonth: inputData.invoiceMonth,
            currencyType: typeof inputData.currencyType === 'object' && inputData.currencyType !== null
                ? inputData.currencyType.value
                : inputData.currencyType,
            invoiceStartDate: inputData.invoiceStartDate,
            invoiceEndDate: inputData.invoiceEndDate,
            invoiceNumber: inputData.invoiceNumber
        };
        const invoiceData = {
            customerName: typeof inputData.customerName === 'object' && inputData.customerName !== null
                ? inputData.customerName.label
                : inputData.customerName,
            BTP: typeof inputData.BTP === 'object' && inputData.BTP !== null
                ? inputData.BTP.label
                : inputData.BTP,
            STP: typeof inputData.STP === 'object' && inputData.STP !== null
                ? inputData.STP.label
                : inputData.STP,

            purchaseNumber: inputData.purchaseNumber,
            invoiceMonth: inputData.invoiceMonth,
            currencyType: typeof inputData.currencyType === 'object' && inputData.currencyType !== null
                ? inputData.currencyType.label
                : inputData.currencyType,
            invoiceStartDate: inputData.invoiceStartDate,
            invoiceEndDate: inputData.invoiceEndDate,
            invoiceNumber: inputData.invoiceNumber
        };
        setInvoiceData({ info: invoiceData })
        setCustomerInfo(transformedData)
        const startDate = new Date(value.startDate);
        const endDate = new Date(value.endDate);
        const errors = {};
        if (startDate >= endDate) {
            errors.dateRange = 'Start date must be before end date.';
        }
        if (Object.keys(errors).length > 0) {
            setSectionErrors(errors);
            return;
        }
        const payload = {
            status: "draft",
			sectionName:activeTab,
            idInvoice: idInvoice,
            invoiceNumber: idInvoiceNo,
            currencyName: currencySymbol,
            taxpercent: taxpercent,
            customerinfodata: transformedData,
            lineItemsData: lineItemsData,
            invoicePreview: { invoiceData: invoiceData, tableData: tableData }
        }

        const response = await axiosJWT.post(`${apiUrl}/opportunity/generateInvoice`, payload);
        if (response) {
            setIdInvoice(response.data.data.idInvoice)
            setIdInvoiceNo(response.data.data.invoiceNumber)
            setActiveTab("Line Items")
        }
    };
    const handleSubmit = async () => {
        const tabsThatRequireValidation = ["Invoice Preview"];
        if (!tabsThatRequireValidation.includes(activeTab)) {
            const fieldErrors = validateFields(fields);
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
                return;
            }

        }
        settableData({
            inlineItemsDatafo: lineItemsData,
            totaltaxdata: totaltaxdata
        });
        const status = activeTab === "Invoice Preview" ? "generated" : "draft";
		const sectionstatus = activeTab === "Invoice Preview" ? "Submitted" : activeTab;
        const payload = {
            status: status,
			sectionName:sectionstatus,
            idInvoice: idInvoice,
            invoiceNumber: idInvoiceNo,
            currencyName: currencySymbol,
            taxpercent: taxpercent,
            customerinfodata: Customerinfodata,
            lineItemsData: lineItemsData,
            invoicePreview: { invoiceData: invoiceData, tableData: tableData }
        }

        try {
            const response = await axiosJWT.post(`${apiUrl}/opportunity/generateInvoice`, payload);
            if (response) {
                if (activeTab === "Line Items") {
                    setActiveTab("Invoice Preview")
                } else if (activeTab === "Invoice Preview") {

                    const message = 'You have successfully <strong>Generate Invoice</strong>!';
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
                        router.push(`/createInvoice/view`);
                    }, 1000);

                }
            }
        } catch (error) {
        }
    };
    const removeError = (key) => {
        setSectionErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[key];
            return updatedErrors;
        });
    };
    const handleBackClick = async () => {
        router.push(`/timesheet/adminDashboard`);
    }
    const handleDraftSubmit = async () => {
        router.push(`/timesheet/adminDashboard`);
    }

    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
    const openNotesModal = async () => {
        setIsNotesModalOpen(true)
    }
    const closeNotesModal = async () => {
        setIsNotesModalOpen(false)
    }


    const getInstantValue = async (fieldName, value) => {
        if (fieldName === "currencyType" && value && value.label) {
            setCurrencySymbol(value.label);
        }
		if (fieldName === "customerName" && value && value.value) {
            const idClient = value.value;
            const opportunitySection = formvalue.section.find(section => section.SectionName === "Customer Information");
            const opportunitySubsection = opportunitySection.Subsection.find(subsection => subsection.SubsectionName === "Customer Information");
            opportunitySubsection.fields.forEach(field => {

                if (field.name === "BTP") {
                    field.dependentId = idClient;
                }
                if (field.name === "STP") {
                    field.dependentId = idClient;
                }
            });
            
        }
    };
    const hasTotalAmount = lineItemsData.some(item => item.totalAmount);
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const symbol = currencySymbolMap(currencySymbol);
    const convertNumberToWords = (number) => {
        return numberToWords.toWords(number);
    };
	
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
    return (
        <>
            <Head>
                <title>{pageTitles.CreateInvoice}</title>
                <meta name="description" content={"Create Invoice"} />
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
                                        <Breadcrumbs maintext={"Create Invoice"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index" id="oxyem_opportunity_page">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                                                        <div className="center-part">
                                                            <div className="card-body -body skolrup-learning-card-body oxyem-time-managment">
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <div className="user-text skolrup-m-user-text">

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {activeTab !== "Customer Information" ? (
                                                                    <div className="row">
                                                                        <div className="col-12 btn-notes-section">
                                                                            <span className='btn-notes-opp' onClick={openNotesModal}>Notes</span>
                                                                        </div>
                                                                    </div>
                                                                ) : (null)}


                                                                {Array.isArray(formvalue.section) ? (
                                                                    <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
                                                                        {formvalue.section.map((section, index) => (
                                                                            section.isVisible && (
                                                                                <li key={index} className="nav-item">
                                                                                    <a
                                                                                        className={`nav-link ${activeTab === section.SectionName ? 'active' : ''}`}
                                                                                        onClick={() => handleTabClick(section.SectionName)}
                                                                                    >
                                                                                        <div className="skolrup-profile-tab-link">{section.SectionName}</div>
                                                                                    </a>
                                                                                </li>
                                                                            )
                                                                        ))}
                                                                    </ul>

                                                                ) : (
                                                                    null
                                                                )}


                                                                <div className="tab-content" >



                                                                    {formvalue.section.map((section, index) => (
                                                                        activeTab === section.SectionName && (
                                                                            <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>

                                                                                {section.name === "lineItems" ? (
                                                                                    <>
                                                                                        {tableSection === "show" ? (
                                                                                            <div className='oxyem-time-mang-format in_vo_table'>
                                                                                                <h5 className="mb-5">{section.SectionName}</h5>
                                                                                                <div className="col-12 text-end">
                                                                                                    <span className='btn btn-primary breadcrum-btn' onClick={addRow}><FaPlus /></span>
                                                                                                </div>
                                                                                                <MUIDataTable
                                                                                                    title={""}
                                                                                                    data={activeTab === "Line Items" ? lineItemsData : []}
                                                                                                    columns={columns}
                                                                                                    options={options}
                                                                                                />

                                                                                                {hasTotalAmount && (
                                                                                                    <>
                                                                                                        <div className="inviocie_price_section">
                                                                                                            <div className="t_inviocie_price_section">
                                                                                                                {totaltaxdata.untaxedAmount && (
                                                                                                                    <div className='in_er_line'><span className='start_text_f'>Untaxed Amount :</span> <span className='end_text_f'>{symbol} {totaltaxdata.untaxedAmount}</span></div>
                                                                                                                )}

                                                                                                                <div className='in_er_line'>
                                                                                                                    <span className='start_text_f'>Tax % :</span>
                                                                                                                    <input
                                                                                                                        type="number"
                                                                                                                        value={totaltaxdata.tax}
                                                                                                                        onChange={handleTaxChange}
                                                                                                                    />
                                                                                                                </div>

                                                                                                                {totaltaxdata.totalAmount && (
                                                                                                                    <div className='in_er_line'><span className='start_text_f'>Total Amount :</span> <span className='end_text_f'>{symbol} {totaltaxdata.totalAmount}</span></div>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="inviocie_price_dec">
                                                                                                            <span> Declaration:</span> We declare that this invoice shows the actual price of the Services described and that particulars are true & correct.
                                                                                                        </div>
                                                                                                    </>
                                                                                                )}

                                                                                                <div className="justify-content-end d-flex w-100 mt-4">
                                                                                                    {formbuttons.map((btn, index) => (
                                                                                                        <>
                                                                                                            {btn.buttontype === "submit" ? (
                                                                                                                <button className={`btn ${btn.class}`} key={index} onClick={handleSubmit}>{btn.label}</button>
                                                                                                            ) : (
                                                                                                                <>
                                                                                                                    {btn.buttontype === "Cancel" ? (
                                                                                                                        <button className={`btn ${btn.class}`} key={index} onClick={handleBackClick}>{btn.label}</button>
                                                                                                                    ) : (
                                                                                                                        <button className={`btn ${btn.class}`} key={index} onClick={handleDraftSubmit} >{btn.label}</button>
                                                                                                                    )}
                                                                                                                </>
                                                                                                            )}
                                                                                                        </>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (<></>)}
                                                                                    </>
                                                                                ) : section.name === "summary" ? (
                                                                                    <div className='row justify-content-center'>
                                                                                        <div className='col-xxl-10 col-md-12'>
                                                                                            {Object.keys(invoiceData).length > 0 && (
                                                                                                <div className="invoice_all_section_div">
                                                                                                    <div className="invoice_top_section_total">
                                                                                                        <div className="row align-items-center">
                                                                                                            <div className="col-md-4">
                                                                                                                <div className="invoice_logo_section">
                                                                                                                    <h1 className='invoice_logo'><span>O</span>XYTAL</h1>
                                                                                                                    <p className='invoice_logo_bottom'>Trusted Digital Partner</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-md-4">
                                                                                                                <div className="invoice_cente_section">
                                                                                                                    <h2 className=''>Invoice</h2>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-md-4">
                                                                                                                <div className="invoice_top_section">
                                                                                                                    <p>Oxytal India Private Limited</p>
                                                                                                                    <p>CIN: U72900HR2022FTC100829</p>
                                                                                                                    <p>#72, Gali No-5, Near Shiv Mandir </p>
                                                                                                                    <p>R.K. Puram, Panipat Haryana - 132103, India </p>
                                                                                                                    <p>Email: Info@oxytal.com </p>
                                                                                                                    <p>IEC : AADCO6845</p>
                                                                                                                    <p>GST: 06AADCO6845K1Z3</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div className="invoice_middle_section">
                                                                                                        <div className="row">
                                                                                                            <div className="col-md-4 invoice_middle_text">
                                                                                                                <h2>Bill To</h2>
                                                                                                                <p><span>Name:</span> {invoiceData.info.customerName}</p>
                                                                                                                <p><span>Bill to Party:</span> {invoiceData.info.BTP}</p>
                                                                                                            </div>
                                                                                                            <div className="col-md-4 invoice_middle_text">
                                                                                                                <h2>Ship to Party</h2>
                                                                                                                <br />
                                                                                                                <p>{invoiceData.info.STP}</p>
                                                                                                            </div>
                                                                                                            <div className="col-md-4 invoice_middle_text">
                                                                                                                <p><span>Service Period:</span> {formatDate(invoiceData.info.invoiceStartDate)} To {formatDate(invoiceData.info.invoiceEndDate)}</p>
                                                                                                                <p><span>Invoice No:</span> {idInvoiceNo}</p>
                                                                                                                <p><span>Invoice Date:</span> {invoiceData.info.invoiceMonth}</p>
                                                                                                                <p><span>HSN/SAC:</span> 9983</p>
                                                                                                                {
                                                                                                                    invoiceData.info.purchaseNumber ? (
                                                                                                                        <p><span>Purchase Number:</span> {invoiceData.info.purchaseNumber}</p>
                                                                                                                    ) : null
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div className="invoice_description_section">
                                                                                                        <div className="row mt-4">
                                                                                                            <div className="col-md-12">
                                                                                                                <table className="invoice_description_table">
                                                                                                                    <thead>
                                                                                                                        <tr>
                                                                                                                            <th className="th-item">Item No.</th>
                                                                                                                            <th className="th-description">Description</th>
                                                                                                                            <th className="th-amount">Amount</th>
                                                                                                                        </tr>
                                                                                                                    </thead>
                                                                                                                    <tbody>
                                                                                                                        {tableData.inlineItemsDatafo.map((item, index) => (
                                                                                                                            <tr key={index}>
                                                                                                                                <td>{index + 1}</td>
                                                                                                                                <td>{item.description}</td>
                                                                                                                                <td>{symbol} {item.totalAmount}</td>
                                                                                                                            </tr>
                                                                                                                        ))}

                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div className="invoice_total_section">
                                                                                                        <div className="row invocie-declaration-section">
                                                                                                            <div className="col-md-8 invocie-declaration-text">
                                                                                                                <h3>Declaration:</h3>
                                                                                                                <p>We declare that this invoice shows the actual price of the services described and that particulars are true & correct.</p>
                                                                                                                <p className='bt_d'>This is a system-generated document. No signature is required.</p>
                                                                                                            </div>
                                                                                                            <div className="col-md-4">
                                                                                                                <div className="inviocie_price_section">
                                                                                                                    <div className="t_inviocie_price_section">
                                                                                                                        <div className='in_er_line'>
                                                                                                                            <span className='start_text_f'>Untaxed Amount :</span>
                                                                                                                            <span className='end_text_f'>{symbol} {tableData.totaltaxdata.untaxedAmount}</span>
                                                                                                                        </div>
                                                                                                                        <div className='in_er_line'>
                                                                                                                            <span className='start_text_f'>Tax % :</span>
                                                                                                                            <span className='end_text_f'>{tableData.totaltaxdata.tax}</span>
                                                                                                                        </div>
                                                                                                                        <div className='in_er_line'>
                                                                                                                            <span className='start_text_f'>Total:</span>
                                                                                                                            <span className='end_text_f'>{symbol} {tableData.totaltaxdata.totalAmount}</span>
                                                                                                                        </div>
                                                                                                                        <div className='in_er_line'>
                                                                                                                            <span className='start_text_f'>{currencySymbol}</span>
                                                                                                                            <span className='end_text_f current_word_con'>{convertNumberToWords(tableData.totaltaxdata.totalAmount)} only</span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                            <div className="justify-content-end d-flex w-100 mt-4">
                                                                                                {formfinalbuttons.map((btn, index) => (
                                                                                                    <>
                                                                                                        {btn.buttontype === "submit" ? (
                                                                                                            <button className={`btn ${btn.class}`} key={index} onClick={handleSubmit}>{btn.label}</button>
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                {btn.buttontype === "Cancel" ? (
                                                                                                                    <button className={`btn ${btn.class}`} key={index} onClick={handleBackClick}>{btn.label}</button>
                                                                                                                ) : (
                                                                                                                    <button className={`btn ${btn.class}`} key={index} onClick={handleDraftSubmit} >{btn.label}</button>
                                                                                                                )}
                                                                                                            </>
                                                                                                        )}
                                                                                                    </>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        {sectionerrors && Object.keys(sectionerrors).map((key) => (
                                                                                            <div key={key} className="alert alert-danger alert-dismissible fade show" role="alert">
                                                                                                {sectionerrors[key]}
                                                                                                <button type="button" className="btn-close" aria-label="Close" onClick={() => removeError(key)}></button>
                                                                                            </div>
                                                                                        ))}
                                                                                        <DynamicForm
                                                                                            fields={section}
                                                                                            content={formvalue}
                                                                                            apiurl={apiUrl}
                                                                                            handleChangeValue={handleChangeValue}
                                                                                            Openedsection={index}
                                                                                            handleChangess={() => handleChangess(index)}

                                                                                            submitformdata={submitformdata}
                                                                                            getInstantValue={getInstantValue}
                                                                                            isModule={formvalue.formType}
                                                                                            pagename={pagename}
                                                                                            showButton={showButton}
                                                                                        />
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    ))}
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

export async function getServerSideProps(context) {
    const cookies = context.req.headers.cookie;
    const accessToken = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1] : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await axios.get(`${apiUrl}/getDynamicForm`, {
            params: { formType: 'pricingInvoice' },
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
        return {
            redirect: {
                destination: context.req.headers.referer || '/',
                permanent: false,
            },
        };
    }
}
