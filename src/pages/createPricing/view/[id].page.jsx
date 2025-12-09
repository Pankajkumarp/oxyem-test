import React, { useState, useEffect, useRef } from 'react';
import MUIDataTable from "mui-datatables";
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import { FaPlus } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import { FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FaRegCheckCircle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import UploadFileDetail from '../../Components/common/UploadFile/UploadFileCommanApi.jsx';
const DynamicForm = dynamic(() => import('../../Components/CommanForm.jsx'), {
    ssr: false
});
const Notes = dynamic(() => import('../../Components/Popup/Notes'), {
    ssr: false
});
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function opportunity({ userFormdata }) {  // Default to empty array if not provided
    const router = useRouter();
    const showButton = "";
    const pagename = "createPricing";

    const [formvalue, setFormvalue] = useState(userFormdata);

    const [calculate, setcalculate] = useState(false);
    const [fields, setfields] = useState([]);
    const formbuttons = formvalue.section[1].buttons;
    const formsubmitbuttons = formvalue.section[2].buttons;
    const formfinalbuttons = formvalue.section[3].buttons;
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
    const [data, setData] = useState([initialData]);

    const [pricingId, setPricingId] = useState("");

    const [alldata, setAlldata] = useState({});
    const [datapricinginfo, setPricingInfo] = useState([]);
    const [milestoneDetails, setMilestoneDetails] = useState([]);
    const [opportunitySummary, setOpportunitySummary] = useState({});
    const [summaryCost, setSummaryCost] = useState({});
    const [dataStatus, setDataStatus] = useState("");
    const [totalAmout, setTotalAmount] = useState("");
    const [opptotalAmout, setOppTotalAmount] = useState("");
     const [dataDocuments, setDataDocuments] = useState([]);
    const [currenyAmout, setOppCurrency] = useState("");
    const { id } = router.query;
    function getTotalAmount(milestoneData) {
        return milestoneData.reduce((sum, milestone) => {
            return sum + parseFloat(milestone.totalAmount);
        }, 0);
    }
    const fetchOpportunityInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/opportunity/priceView`, { params: { id: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    console.log(fetchedData, "fetchedData")
                    setAlldata(fetchedData)
                    setDataStatus(fetchedData.status)
                    setPricingInfo(fetchedData.datapricinginfo)
                    setMilestoneDetails(fetchedData.milestoneDetails)
                    const totalAmountSum = getTotalAmount(fetchedData.milestoneDetails);
                    setTotalAmount(totalAmountSum);
                    setOpportunitySummary(fetchedData.OpportunitySummary)
                    setDataDocuments(fetchedData.pricingDocuments || []);
                    const financialTotal = fetchedData.OpportunitySummary["Financial  Information"].total;
                    if (financialTotal) {
                        setOppTotalAmount(financialTotal);
                        const match = financialTotal.match(/^([^\d]+)\s*([\d,]+\.\d{2})$/);
                        if (match) {
                            setOppCurrency(match[1].trim());
                        }
                    }
                    setSummaryCost(fetchedData.summary)
                    const opportunitySection = formvalue.section.find(section => section.SectionName === "Pricing Information");
                    const opportunitySubsection = opportunitySection.Subsection.find(subsection => subsection.SubsectionName === "Pricing Details");
                    opportunitySubsection.fields.forEach(field => {

                        if (fetchedData.datapricinginfo[field.name] !== undefined) { // Check if the field exists in fetchedData


                            field.value = fetchedData.datapricinginfo[field.name]; // Use fetchedData.datapricinginfo

                            field.isDisabled = true;
                            if (field.name === "projectName") {
                                field.dependentId = fetchedData.datapricinginfo.idClient; // Assign the value to dependentId
                            }
                            if (field.name === "BTP") {
                                field.dependentId = fetchedData.datapricinginfo.idClient; // Assign the value to dependentId
                            }
                            if (field.name === "STP") {
                                field.dependentId = fetchedData.datapricinginfo.idClient; // Assign the value to dependentId
                            }
                            if (field.name === "opportunityName") {
                                field.documentType = "opportunity_list_edit";
                            }
                        }
                        if (field.name === "pricingDoccument") {
                            if (fetchedData.pricingDocument) {
                                field.value = fetchedData.pricingDocument;
                                field.isDisabled = true;
                            }
                        }
                    });

                    opportunitySection.buttons = [];
                }
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        const { id } = router.query;
        fetchOpportunityInfo(id);
        setPricingId(id)
    }, [id]);

    const [cuurencyId, setCurrencyId] = useState("");
    const fetchTotalCostForRole = async (role) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const payload = {
                idRole: role,
                currencyType: cuurencyId,
            }
            const response = await axiosJWT.post(`${apiUrl}/opportunity/getRate`, payload);

            if (response) {
                const data = response.data.data.rateCardHrs;
                // Return the totalCost from the response
                return data;
            } else {
                console.error("Failed to fetch totalCost. Status:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Error fetching totalCost:", error);
            return null; // Return null in case of error
        }
    };


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
        rowsPerPage: 60,
        count: 0,
    };


    // Initialize data for the active tab

    const initializeDataForTab = (tab) => {

        const selectedSection = formvalue.section.find(section => section.SectionName === tab);

        if (selectedSection && selectedSection.Subsection.length > 0) {

            const initialRow = mergeDataWithFields(selectedSection.Subsection[0].fields, []);

            return [initialRow]; // Return an array with the initial row

        }

        return [];

    };


    const handleTabClick = (tab) => {
        //if (tabArray.includes(tab)) {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setfields(formvalue.section.find(section => section.SectionName === tab).Subsection[0].fields);
            if (tab === "Pricing Information" && datapricinginfo.length === 0) {
                setPricingInfo(initializeDataForTab(tab));
            } else if (tab === "Milestone Details" && milestoneDetails.length === 0) {
                setMilestoneDetails(initializeDataForTab(tab));
            }
            //}
        } else {
            console.log(`${tab} is not in the tabArray`);
        }

    };


    const addRow = () => {

        const newRow = mergeDataWithFields(fields, existingData);

        if (activeTab === "Pricing Information") {

            //setPricingInfo([...datapricinginfo, newRow]);

        } else if (activeTab === "Milestone Details") {

            setMilestoneDetails([...milestoneDetails, newRow]);

        }

    };


    useEffect(() => {

        const initialSection = formvalue.section.find(section => section.SectionName === activeTab);

        if (initialSection && initialSection.Subsection.length > 0) {

            setfields(initialSection.Subsection[0].fields);

            // Initialize data for the active tab only if it's empty

            if (activeTab === "Pricing Information" && datapricinginfo.length === 0) {

                setPricingInfo(initializeDataForTab(activeTab));

            } else if (activeTab === "Milestone Details" && milestoneDetails.length === 0) {

                setMilestoneDetails(initializeDataForTab(activeTab));

            }

        }

    }, [activeTab]);







    const handleDeleteRow = (rowIndex) => {
        let updatedData;
        if (activeTab === "Pricing Information") {
            updatedData = [...datapricinginfo];
            updatedData.splice(rowIndex, 1); // Remove the row at the specified index
            setPricingInfo(updatedData);
        } else if (activeTab === "Milestone Details") {
            updatedData = [...milestoneDetails];
            updatedData.splice(rowIndex, 1);
            setMilestoneDetails(updatedData);
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
                                disabled={true}
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
                                disabled={true}
                                placeholder={field.placeholder}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    updateValue(newValue); // Update the MUI DataTable value
                                    handleChangeValue(field.name, newValue, rowIndex); // Update the local state
                                }}
                            />
                        </span>
                    );
                } else if (field.type === 'Date') {
                    return (
                        <span className={error ? "table_field_error custom-calender-oxyem" : "custom-calender-oxyem"}>
                            <ReactDatePicker
                                className={`form-control sr-no-txt`}
                                selected={value ? new Date(value) : null}
                                onChange={(date) => {
                                    const newValue = date ? date.toISOString().split('T')[0] : ""; // Format to "YYYY-MM-DD"
                                    updateValue(newValue); // Update the MUI DataTable value
                                    handleChangeValue(field.name, newValue, rowIndex); // Update the local state
                                }}
                                disabled={true}
                                placeholderText={field.placeholder}
                                dateFormat="yyyy-MM-dd"
                            />
                            <span className='oxyem-date-icon' ><FaRegCalendarAlt /></span>
                        </span>
                    );
                } else if (field.type === 'srNo') {
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            <input
                                className={`form-control sr-no-input`}
                                value={rowIndex + 1 || ""}
                                disabled={true}
                                placeholder={field.placeholder}
                            />
                        </span>
                    );
                } else if (field.type === 'action') {
                    const rowCount = activeTab === "Pricing Information" ? datapricinginfo.length :
                        activeTab === "Milestone Details" ? milestoneDetails.length : 0;

                    return (
                        <>
                            {rowCount > 1 && (
                                <></>
                            )}
                        </>
                    );
                } else {
                    return value; // Default case
                }
            }
        }
    }));


    const [errors, setErrors] = useState({});
    const handleChangeValue = async (fieldName, value, rowIndex) => {
        let updatedData;
        if (activeTab === "Pricing Information") {
            updatedData = [datapricinginfo];
        } else if (activeTab === "Milestone Details") {
            updatedData = [...milestoneDetails];
        }
        if (activeTab === "Pricing Information") {
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
        if (activeTab === "Pricing Information") {
            setPricingInfo(updatedData);
        } else if (activeTab === "Milestone Details") {
            setMilestoneDetails(updatedData);
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
        if (activeTab === "Pricing Information") {
            currentData = datapricinginfo;
        } else if (activeTab === "Milestone Details") {
            currentData = milestoneDetails;
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

    const submitformdata = async (value) => {
        const inputData = value
        const transformedData = {
            opportunityName: typeof inputData.opportunityName === 'object' && inputData.opportunityName !== null
                ? inputData.opportunityName.value
                : inputData.opportunityName,
            clientName: inputData.clientName,
            startDate: inputData.startDate,
            endDate: inputData.endDate,
            currencyType: inputData.currencyType,
            opportunityId: inputData.opportunityId,
            projectName: typeof inputData.projectName === 'object' && inputData.projectName !== null
                ? inputData.projectName.value
                : inputData.projectName,
            BTP: typeof inputData.BTP === 'object' && inputData.BTP !== null
                ? inputData.BTP.value
                : inputData.BTP,
            STP: typeof inputData.STP === 'object' && inputData.STP !== null
                ? inputData.STP.value
                : inputData.STP
        };
        setPricingInfo(transformedData)
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
            status: "Draft",
            idPricing: pricingId,
            pricingInfo: transformedData,
            milestoneDetails: milestoneDetails,
            OpportunitySummary: opportunitySummary,
            Summary: summaryCost
        }
        const formData = new FormData();
        formData.append('formData', JSON.stringify(payload));
        const myFile = value.pricingDoccument
        if (Array.isArray(myFile)) {
            myFile.forEach((file) => {
                formData.append('file', file);
            });
        } else {
            console.error('fileData is not an array:', myFile);
        }
        const response = await axiosJWT.post(`${apiUrl}/opportunity/addPricing`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response) {
            setPricingId(response.data.moduleId)
            setActiveTab("Milestone Details");
            const tab = "Milestone Details"

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

        const fieldsToDisable = ["opportunityId", "clientName", "currencyType", "startDate", "endDate"];
        if (fieldName === "opportunityName") {
            function getValue(value) {
                if (value && typeof value === 'object' && value.hasOwnProperty('value')) {
                    return value.value;
                }
                return value;
            }
            const opportunityvalue = getValue(value)
            if (opportunityvalue !== null && opportunityvalue !== undefined && opportunityvalue !== "") {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    const response = await axiosJWT.get(`${apiUrl}/opportunity/details`, { params: { "id": opportunityvalue } })
                    if (response) {
                        const responseData = response.data.data;
                        const updateFormValues = (form, data) => {
                            form.section.forEach(section => {
                                section.Subsection.forEach(subsection => {
                                    subsection.fields.forEach(field => {
                                        if (data[field.name] !== undefined) {
                                            field.value = data[field.name];
                                        }
                                        fields.forEach(field => {
                                            if (fieldsToDisable.includes(field.name)) {
                                                field.isDisabled = true;
                                                if (field.name === "opportunityId") {
                                                    field.value = data.id;
                                                }
                                            }
                                        });
                                    });
                                });
                            });
                            return form;
                        };
                        const mergeData = updateFormValues(formvalue, responseData);
                        setFormvalue(mergeData)
                        const idClient = response.data.data.idClient;
                        if (idClient) {

                            const fieldsOption = ["projectName"];
                            const updateFormValueOption = (form) => {
                                form.section.forEach(section => {
                                    section.Subsection.forEach(subsection => {
                                        subsection.fields.forEach(field => {
                                            fields.forEach(field => {
                                                if (fieldsOption.includes(field.name)) {
                                                    field.dependentId = idClient;
                                                }
                                            });
                                        });
                                    });
                                });
                                return form;
                            };
                            const mergeOptionData = updateFormValueOption(formvalue);
                            setFormvalue(mergeOptionData)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching options:', error);

                }
            } else {
                const updateFormValueswithout = (form) => {
                    form.section.forEach(section => {
                        section.Subsection.forEach(subsection => {
                            subsection.fields.forEach(field => {
                                fields.forEach(field => {
                                    if (fieldsToDisable.includes(field.name)) {
                                        field.isDisabled = false;
                                        field.value = "";
                                    }
                                });
                            });
                        });
                    });
                    return form;
                };
                const mergeData = updateFormValueswithout(formvalue);
                setFormvalue(mergeData)
            }
        }
    };

    const handleWonClick = async () => {
        const payload = alldata
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


    const categories = milestoneDetails.map(item => item.date);
    const datagraph = milestoneDetails.map(item => parseFloat(item.totalAmount));
    const descriptions = milestoneDetails.map(item => item.description);
    const colors = [
        '#316799', '#009688', '#8e24aa', '#00bcd4', '#795548',
        '#1e88e5'
    ];
    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350
        },
        colors: colors,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                const datagraphs = datagraph[opts.dataPointIndex];
                return datagraphs;
            },
            style: {
                colors: ['#fff'],
                fontSize: '12px',
                fontWeight: 'bold'
            }
        },
        legend: {
            show: false,
            labels: {
                formatter: function (seriesName, opts) {
                    return descriptions[opts.seriesIndex];
                }
            }
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 'normal'
                }
            }
        }
    };



    const chartSeries = [
        {
            name: 'Amount',
            data: datagraph
        }
    ];
    return (
        <>
            <Head>
                <title>View Pricing</title>
                <meta name="description" content={"View Pricing"} />
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
                                        <Breadcrumbs maintext={"View Pricing"} />
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



                                                                <div className="row top_btn_opp">
                                                                    <div className='col-md-4'>
                                                                        <span className={`oxyem-mark-${dataStatus}`}>{dataStatus}</span>
                                                                    </div>
                                                                    <div className='col-md-8'>

                                                                        {activeTab !== "Pricing Information" ? (
                                                                            <div className="combo_btn_opp">
                                                                                {dataStatus === "open" ? (
                                                                                    <>
                                                                                        {activeTab === "Summary" ? (
                                                                                            <>
                                                                                                <span className='btn-opportunity-won' onClick={handleWonClick}>Approve</span>
                                                                                                <span className='btn-opportunity-loss' onClick={handleLossClick}>Reject</span>
                                                                                            </>
                                                                                        ) : (null)}
                                                                                    </>
                                                                                ) : (null)}
                                                                                <span className='btn-notes-opp' onClick={openNotesModal}>Notes</span>
                                                                            </div>
                                                                        ) : (null)}
                                                                    </div>
                                                                </div>
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

                                                                                {section.SectionName === "Pricing Information" ? (
                                                                                    <div className="oxyem-time-mang-format">
                                                                                        <div className="row justify-content-center">
                                                                                            <div className="col-xxl-10">
                                                                                                <div className="row">
                                                                                                    {/* Left column */}
                                                                                                    <div className="col-md-6">
                                                                                                        <ul className="personal-info-header-right claim-detail-v-page top-details">
                                                                                                            {datapricinginfo?.opportunityName && (
                                                                                                                <li>
                                                                                                                    <div className="title">Opportunity Name :</div>
                                                                                                                    <div className="text">{datapricinginfo.opportunityName}</div>
                                                                                                                </li>
                                                                                                            )}
                                                                                                            {datapricinginfo?.clientName && (
                                                                                                                <li>
                                                                                                                    <div className="title">Client Name :</div>
                                                                                                                    <div className="text">{datapricinginfo.clientName}</div>
                                                                                                                </li>
                                                                                                            )}
                                                                                                            {datapricinginfo?.startDate && (
                                                                                                                <li>
                                                                                                                    <div className="title">Start Date :</div>
                                                                                                                    <div className="text">{datapricinginfo.startDate}</div>
                                                                                                                </li>
                                                                                                            )}
                                                                                                            {datapricinginfo?.projectName && (
                                                                                                                <li>
                                                                                                                    <div className="title">Project Name :</div>
                                                                                                                    <div className="text">{datapricinginfo.projectName}</div>
                                                                                                                </li>
                                                                                                            )}
                                                                                                        </ul>
                                                                                                    </div>

                                                                                                    {/* Right column */}
                                                                                                    <div className="col-md-6">
                                                                                                        <ul className="personal-info-header-right claim-detail-v-page top-details">
                                                                                                            {(         //datapricinginfo?.BTP &&
                                                                                                                <li>
                                                                                                                    <div className="title">BTP :</div>
                                                                                                                    <div className="text">{datapricinginfo.BTP || '-'}</div>
                                                                                                                </li>
                                                                                                            )}
                                                                                                            {(     //datapricinginfo?.STP &&
                                                                                                                <li>
                                                                                                                    <div className="title">STP :</div>
                                                                                                                    <div className="text">{datapricinginfo.STP || '-'}</div>
                                                                                                                </li>
                                                                                                            )}
                                                                                                            {datapricinginfo?.endDate && (
                                                                                                                <li>
                                                                                                                    <div className="title">End Date :</div>
                                                                                                                    <div className="text">{datapricinginfo.endDate}</div>
                                                                                                                </li>
                                                                                                            )}
                                                                                                            {datapricinginfo?.currencyType && (
                                                                                                                <li>
                                                                                                                    <div className="title">Currency Type :</div>
                                                                                                                    <div className="text">{datapricinginfo.currencyType}</div>
                                                                                                                </li>
                                                                                                            )}

                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ): section.SectionName === "Documents" ? (
                                                                                            <div className="oxyem-time-mang-format">
                                                                                                <div className="row">
                                                                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                                                                        {/* Info Section */}
                                                                                                        <div className="opp_box_info">
                                                                                                            <div className='icon_box_perform'>
                                                                                                                <FaInfoCircle />
                                                                                                            </div>
                                                                                                            <div>
                                                                                                                <p>Uploaded project-related documents are listed below:</p>
                                                                                                            </div>
                                                                                                        </div>

                                                                                                       {/* Upload Component - pass onDocumentsChange to sync parent state */}
                                                                                                       <UploadFileDetail 
                                                                                                           documentId={pricingId} 
                                                                                                           documentFor="pricing" />

                                                                                                       

                                                                                                      
                                                                                                    </div>
                                                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                                                                </div>
                                                                                                </div>

                                                                                            </div>
                                                                                        ): section.name === "milestoneDetails" ? (
                                                                                    <>
                                                                                        {tableSection === "show" ? (
                                                                                            <div className='oxyem-price-top-amount'>
                                                                                                <div className='row top-amount_box_pr'>
                                                                                                    <div className='col-md-6'>
                                                                                                        <h5 className="mb-5 aomunt_opp_total_top_head">{section.SectionName}</h5>
                                                                                                    </div>
                                                                                                    <div className='col-md-6'>
                                                                                                        {opptotalAmout && (
                                                                                                            <div className="aomunt_opp_total_top">
                                                                                                                <div className="aomunt_opp_total_section">
                                                                                                                    {opptotalAmout && (
                                                                                                                        <div className='in_er_line'><span className='start_text_f'>Financial Amount :</span> <span className={`end_text_f oxyem-mark-finacialinfo`}>{opptotalAmout}</span></div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>

                                                                                                </div>
                                                                                                <MUIDataTable
                                                                                                    title={""}
                                                                                                    data={activeTab === "Milestone Details" ? milestoneDetails : []}
                                                                                                    columns={columns}
                                                                                                    options={options}
                                                                                                />
                                                                                                {totalAmout && (
                                                                                                    <div className="inviocie_price_section pr_create_oxyem">
                                                                                                        <div className="t_inviocie_price_section">
                                                                                                            {totalAmout && (
                                                                                                                <div className='in_er_line'><span className='start_text_f'>Amount :</span> <span className='end_text_f'>{currenyAmout} {totalAmout}</span></div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        ) : (<></>)}
                                                                                    </>
                                                                                ) : section.name === "opportunitySummary" ? (
                                                                                    <div className="row justify-content-center">
                                                                                        <div className="col-xxl-10">
                                                                                            <div className="row_design_view">
                                                                                                {opportunitySummary["Opportunity  Information"] && (
                                                                                                    <div className="card oppor_cards">
                                                                                                        <div className="card-body card_inform">
                                                                                                            <h5 className="card-title">Opportunity Information</h5>
                                                                                                            {Object.entries(opportunitySummary["Opportunity  Information"]).map(([key, value]) => (
                                                                                                                <p key={key} className="card-text">
                                                                                                                    <span className='card-text-left'>{key}</span>
                                                                                                                    <span className='card-text-center'>:</span>
                                                                                                                    <span className='card-text-right'>{value}</span>
                                                                                                                </p>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Resource Information Card */}
                                                                                                {opportunitySummary["Resource  Information"] && (
                                                                                                    <div className="card oppor_cards">
                                                                                                        <div className="card-body card_resources">
                                                                                                            <h5 className="card-title">Resource Information</h5>
                                                                                                            <div className='res_opp'>
                                                                                                                {Object.entries(opportunitySummary["Resource  Information"]).map(([key, value], index) => (
                                                                                                                    <div key={key} className={index % 2 === 0 ? 'res_opp_left' : 'res_opp_right'}>
                                                                                                                        <p className="card-title">{key}</p>
                                                                                                                        <p className="card-text-cus">{value}</p>
                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Financial Information Card */}
                                                                                                {opportunitySummary["Financial  Information"] && (
                                                                                                    <div className="card oppor_cards">
                                                                                                        <div className="card-body card_financial">
                                                                                                            <h5 className="card-title">Financial Information</h5>
                                                                                                            <div className="card_financial_top">
                                                                                                                {Object.entries(opportunitySummary["Financial  Information"]).map(([key, value]) => {
                                                                                                                    if (key === "total") {
                                                                                                                        return <p key={key} className="card-text-cus">{value}</p>;
                                                                                                                    }
                                                                                                                    return null;
                                                                                                                })}
                                                                                                            </div>
                                                                                                            <div className="row">
                                                                                                                {Object.entries(opportunitySummary["Financial  Information"]).map(([key, value]) => (
                                                                                                                    key !== "total" && (
                                                                                                                        <div key={key} className="card_oppor_cards">
                                                                                                                            <p className="card-text">
                                                                                                                                <span className='card-text-left'>{key}</span>
                                                                                                                                <span className='card-text-center'>:</span>
                                                                                                                                <span className='card-text-right'>{value}</span>
                                                                                                                            </p>
                                                                                                                        </div>
                                                                                                                    )
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Profit Margin Card */}
                                                                                                {opportunitySummary["Profit Margin"] && (
                                                                                                    <div className="card oppor_cards">
                                                                                                        <div className="card-body card_profit_o">
                                                                                                            <h5 className="card-title">Profit Margin</h5>
                                                                                                            <div className="card_financial_top">
                                                                                                                {Object.entries(opportunitySummary["Profit Margin"]).map(([key, value]) => {
                                                                                                                    if (key === "total") {
                                                                                                                        return <p key={key} className="card-text-cus">{value}</p>;
                                                                                                                    }
                                                                                                                    return null;
                                                                                                                })}
                                                                                                            </div>
                                                                                                            <div className="row">
                                                                                                                {Object.entries(opportunitySummary["Profit Margin"]).map(([key, value]) => (
                                                                                                                    key !== "total" && (
                                                                                                                        <div key={key} className="card_oppor_cards">
                                                                                                                            <p className="card-text">
                                                                                                                                <span className='card-text-left'>{key}</span>
                                                                                                                                <span className='card-text-center'>:</span>
                                                                                                                                <span className='card-text-right'>{value}</span>
                                                                                                                            </p>
                                                                                                                        </div>
                                                                                                                    )
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : section.SectionName === "Documents" ? (
                                                                                                                                                                            <div className="oxyem-time-mang-format">
                                                                                                                                                                                {/* <h5 className="mb-4">{section.SectionName}</h5> */}
                                                                                                                                                                                <div className="row" >
                                                                                                                                                                                    <div className="col-xl-12 col-lg-6 col-md-6 col-sm-6">
                                                                                
                                                                                                                                                                                        {/* Info Section if you want (optional) */}
                                                                                                                                                                                        <div className="opp_box_info">
                                                                                                                                                                                            <div className='icon_box_perform'>
                                                                                                                                                                                                <FaInfoCircle />
                                                                                                                                                                                            </div>
                                                                                                                                                                                            <div>
                                                                                                                                                                                                <p>Uploaded project-related documents are listed below:</p>
                                                                                                                                                                                            </div>
                                                                                                                                                                                        </div>
                                                                                
                                                                                
                                                                                                                                                                                        <FileTable
                                                                                                                                                                                            files={dataDocuments}
                                                                                                                                                                                            baseImageUrl={process.env.NEXT_PUBLIC_IMAGE_BASE_URL}
                                                                                                                                                                                        />
                                                                                
                                                                                                                                                                                      
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                                                                                                                                                </div>
                                                                                                                                                                                </div>
                                                                                
                                                                                
                                                                                                                                                                            </div>
                                                                                                                                                                        ): section.name === "summary" ? (
                                                                                    <>
                                                                                        <div className="row justify-content-center sum_next_des">
                                                                                            <div className="col-xl-4">
                                                                                                <div className='chart_des_graph'>
                                                                                                    <Chart
                                                                                                        options={chartOptions}
                                                                                                        series={chartSeries}
                                                                                                        type="bar"
                                                                                                        height={330}
                                                                                                    />

                                                                                                    <div className='label_div_box_graph'>
                                                                                                        {descriptions.map((desc, index) => (
                                                                                                            <div
                                                                                                                key={index}
                                                                                                                className='label_box_graph_each'

                                                                                                            >
                                                                                                                <span className={`description-lab-${index}`}></span>
                                                                                                                <span>{desc}</span>
                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-xl-8">
                                                                                                <div className="row_design_view">
                                                                                                    {summaryCost["Milestone Total"] && (
                                                                                                        <div className="card oppor_cards">
                                                                                                            <div className="card-body card_profit_o">
                                                                                                                <h5 className="card-title">Milestone Total</h5>
                                                                                                                <div className="card_financial_top">
                                                                                                                    {Object.entries(summaryCost["Milestone Total"]).map(([key, value]) => {
                                                                                                                        if (key === "total") {
                                                                                                                            return <p key={key} className="card-text-cus">{value}</p>;
                                                                                                                        }
                                                                                                                        return null;
                                                                                                                    })}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}


                                                                                                    {/* Profit Margin Card */}
                                                                                                    {summaryCost["Profit Margin"] && (
                                                                                                        <div className="card oppor_cards">
                                                                                                            <div className="card-body card_profit_o">
                                                                                                                <h5 className="card-title">Profit Margin</h5>
                                                                                                                <div className="card_financial_top">
                                                                                                                    {Object.entries(summaryCost["Profit Margin"]).map(([key, value]) => {
                                                                                                                        if (key === "total") {
                                                                                                                            return <p key={key} className="card-text-cus">{value}</p>;
                                                                                                                        }
                                                                                                                        return null;
                                                                                                                    })}
                                                                                                                </div>
                                                                                                                <div className="row">
                                                                                                                    {Object.entries(summaryCost["Profit Margin"]).map(([key, value]) => (
                                                                                                                        key !== "total" && (
                                                                                                                            <div key={key} className="card_oppor_cards">
                                                                                                                                <p className="card-text">
                                                                                                                                    <span className='card-text-left'>{key}</span>
                                                                                                                                    <span className='card-text-center'>:</span>
                                                                                                                                    <span className='card-text-right'>{value}</span>
                                                                                                                                </p>
                                                                                                                            </div>
                                                                                                                        )
                                                                                                                    ))}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                    {summaryCost["Financial  Difference"] && (
                                                                                                        <div className="card oppor_cards">
                                                                                                            <div className="card-body card_financial">
                                                                                                                <h5 className="card-title">Financial  Difference</h5>
                                                                                                                <div className="card_financial_top">
                                                                                                                    {Object.entries(summaryCost["Financial  Difference"]).map(([key, value]) => {
                                                                                                                        if (key === "total") {
                                                                                                                            return <p key={key} className="card-text-cus">{value}</p>;
                                                                                                                        }
                                                                                                                        return null;
                                                                                                                    })}
                                                                                                                </div>
                                                                                                                <div className="row">
                                                                                                                    {Object.entries(summaryCost["Financial  Difference"]).map(([key, value]) => (
                                                                                                                        key !== "total" && (
                                                                                                                            <div key={key} className="card_oppor_cards">
                                                                                                                                <p className="card-text">
                                                                                                                                    <span className='card-text-left'>{key}</span>
                                                                                                                                    <span className='card-text-center'>:</span>
                                                                                                                                    <span className='card-text-right'>{value}</span>
                                                                                                                                </p>
                                                                                                                            </div>
                                                                                                                        )
                                                                                                                    ))}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
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
            params: { formType: 'createPricing' },
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
