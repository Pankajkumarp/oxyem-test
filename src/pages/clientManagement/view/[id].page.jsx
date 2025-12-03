import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MUIDataTable from "mui-datatables";
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import Profile from '../../Components/commancomponents/profile';
import { FaPlus } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import { FaTimes } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import SecTab from '../../Components/Employee/SecTab';
import Cookies from 'js-cookie';
import { FiEdit } from "react-icons/fi";
import { FaRegCheckCircle} from "react-icons/fa";
import ClientDetailView from '../../Components/Client/ClientDetails.jsx';
const DynamicForm = dynamic(() => import('../../Components/CommanForm.jsx'), {
    ssr: false
});
const Notes = dynamic(() => import('../../Components/Popup/Notes'), {
    ssr: false
});
export default function viewClient({ userFormdata }) {  // Default to empty array if not provided
    const router = useRouter();
    const showButton = "";
    const pagename = "createPricing";
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const accessToken = Cookies.get('accessToken');
    const [AdduserContent, setAdduserContent] = useState({});
    const [showForm, setShowForm] = useState(false);


    const getInnerForm = async () => {
        const response = await axios.get(`${apiUrl}/getDynamicForm`, {
            params: { formType: 'createClientInner' },
            headers: {
                Authorization: accessToken,
            },
        });
        if (response) {
            setAdduserContent(response.data.data)
            setShowForm(true)
        }
    }
    const showRow = () => {
        getInnerForm();
        setTimeout(() => {
            window.scrollTo({
                top: 120,
                behavior: 'smooth'
            });
        }, 1000);
    };
    const [formvalue, setFormvalue] = useState(userFormdata);

    const [fields, setfields] = useState([]);
    const formbuttons = formvalue.section[1].buttons;
    const [activeTab, setActiveTab] = useState(formvalue.section[0].SectionName);
    const [tabArray, setTabArray] = useState([]);
    useEffect(() => {
        if (!tabArray.includes(activeTab) && activeTab !== null) {
            setTabArray((prevTabArray) => [...prevTabArray, activeTab]);
        }
    }, [activeTab]);

    const [clientinfodata, setClientInfo] = useState({});
    const [addressInfoData, setAddressInfo] = useState([]);
    const [idClient, setIdClient] = useState("");
    const [editForm, setEditForm] = useState(false);
    const [dataStatus, setDataStatus] = useState("");
    const [clientInfo, setClientInfoDetail] = useState(null);
const [pricingDocs, setPricingDocs] = useState([]);

    const { id } = router.query;
    const fetchClientInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/client/view`, { params: { id: value } });
                console.log(response,"this is responce of clientdata")
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
					setAddressInfo(fetchedData.addressInfoData)
                    const documentFile = response.data.data.pricingDocument;
					setDataStatus(fetchedData.status)
                    setAddressInfo(fetchedData.addressInfoData)

                        // ✅ Store unique variables for view page
    setClientInfoDetail(fetchedData.clientinfodata || null);
    setPricingDocs(fetchedData.pricingDocument || []);

                    const opportunitySection = formvalue.section.find(section => section.SectionName === "Client Information");
                    const opportunitySubsection = opportunitySection.Subsection.find(subsection => subsection.SubsectionName === "Client Information");
                    opportunitySubsection.fields.forEach(field => {

                        if (fetchedData.clientinfodata[field.name] !== undefined) { // Check if the field exists in fetchedData


                            field.value = fetchedData.clientinfodata[field.name]; // Use fetchedData.datapricinginfo

                            field.isDisabled = true;
                        }
                        if(field.name ==="clientDoccument"){
                            field.value = documentFile
                            field.isDisabled = true;
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
        fetchClientInfo(id);
        setIdClient(id)
    }, [id]);
    //     const opportunitySection = formvalue.section.find(section => section.SectionName === "Client Information");
    //     const opportunitySubsection = opportunitySection?.Subsection.find(subsection => subsection.SubsectionName === "Client Information");
    //
    //     if (!opportunitySubsection) return;
    //     const clientNameField = opportunitySubsection.fields.find(field => field.name === "clientName");
    //     if (clientNameField) {
    //         clientNameField.col = 6;
    //     }
    //     const businessTypeField = opportunitySubsection.fields.find(field => field.name === "businessType");
    //     if (businessTypeField) {
    //         businessTypeField.col = 6;
    //     }
    //     const clientIdField = opportunitySubsection.fields.find(field => field.name === "clientId");
    //     if (clientIdField) {
    //         clientIdField.isVisible = false;
    //     }
    //     const clientDoccumentField = opportunitySubsection.fields.find(field => field.name === "clientDoccument");
    //     if (clientDoccumentField) {
    //         clientDoccumentField.col = 6;
    //     }
    // }, [activeTab]);

    const [isTabclick, setisTabclick] = useState(true);
    const [tableSection, settableSection] = useState("show");


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



    const getEditForm = async (matchedRow) => {
        const response = await axios.get(`${apiUrl}/getDynamicForm`, {
            params: { formType: 'createClientInner' },
            headers: {
                Authorization: accessToken,
            },
        });
        if (response) {
            const formData = response.data.data
            const insertData = matchedRow;
            formData.section.forEach(section => {
                section.Subsection.forEach(subsection => {
                    subsection.fields.forEach(field => {
                        const fieldName = field.name;
                        if (insertData[fieldName] !== undefined) {
                            field.value = insertData[fieldName];
                        }
                    });
                });
            });
            setAdduserContent(formData);
            setEditForm(true)
            setTimeout(() => {
                window.scrollTo({
                    top: 120,
                    behavior: 'smooth'
                });
            }, 1000);
        }
    }

    const handleEditRow = (value) => {
        const matchedRow = addressInfoData.find(item => item.addressId === value);
        getEditForm(matchedRow)
    }
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
            if (tab === "Client Information" && clientinfodata.length === 0) {
                setClientInfo(initializeDataForTab(tab));
            } else if (tab === "Address Information" && addressInfoData.length === 0) {
                setAddressInfo(initializeDataForTab(tab));
            }
            //}
        } else {
            console.log(`${tab} is not in the tabArray`);
        }

    };


    const addRow = () => {
        const newRow = mergeDataWithFields(fields, existingData);
        if (activeTab === "Address Information") {
            setAddressInfo([...addressInfoData, newRow]);
        }
    };



    useEffect(() => {

        const initialSection = formvalue.section.find(section => section.SectionName === activeTab);

        if (initialSection && initialSection.Subsection.length > 0) {

            setfields(initialSection.Subsection[0].fields);

            // Initialize data for the active tab only if it's empty

            if (activeTab === "Client Information" && clientinfodata.length === 0) {

                setClientInfo(initializeDataForTab(activeTab));
                console.log(clientinfodata,"yzzzzzzzz")

            } else if (activeTab === "Address Information" && addressInfoData.length === 0) {

                setAddressInfo(initializeDataForTab(activeTab));

            }

        }

    }, [activeTab]);







    const handleRadioChange = (event, idIndex) => {
        const newValue = event.target.checked ? "Active" : "InActive";
        const updatedAddressInfoData = addressInfoData.map(address => {
            if (address.addressId === idIndex) {
                return {
                    ...address,
                    status: newValue
                };
            }
            return address;
        });
        setAddressInfo(updatedAddressInfoData)
    };


    const handleDeleteRow = (rowIndex) => {
        let updatedData;
        if (activeTab === "Client Information") {
            updatedData = [...clientinfodata];
            updatedData.splice(rowIndex, 1); // Remove the row at the specified index
            setClientInfo(updatedData);
        } else if (activeTab === "Address Information") {
            updatedData = [...addressInfoData];
            updatedData.splice(rowIndex, 1);
            setAddressInfo(updatedData);
        }
    };
    const columns = fields.map(field => ({
        name: field.name,
        label: field.label,
        options: {
            filter: field.isfilter,
            sort: field.issort,
            display: ['adressDetails2', 'adressDetails3', 'addressId'].includes(field.name) ? 'excluded' : 'true',
            customBodyRender: (value, tableMeta, updateValue) => {

                const error = errors[field.name] ? errors[field.name][rowIndex] : undefined;
                const rowIndex = tableMeta.rowIndex;

                if (field.type === 'address') {
                    const rowData = tableMeta.rowData;
                    const addressLine2 = rowData[4];
                    const addressLine3 = rowData[5];
                    const adressDetails = rowData[3];
                    const combinedAddress = [
                        adressDetails ? adressDetails : '',
                        addressLine2,
                        addressLine3
                    ].filter(Boolean).join(', ');
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            {combinedAddress}
                        </span>
                    );
                } else if (field.type === 'Text') {
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            {value}
                        </span>
                    );
                } else if (field.type === 'srNo') {
                    return (
                        <div className={error ? "table_field_error" : "sr_no_f"}>
                            {value}
                        </div>
                    );
                } else if (field.type === 'type') {
                    return (
                        <span className={`oxyem-mark-${value}`}>
                            <span className={`circle-mark-${value}`}></span>
                            {value}
                        </span>
                    );
                } else if (field.type === 'status') {
                    const rowData = tableMeta.rowData;
                    const idIndex = rowData[1];
                    return (
                        <>
                            {idIndex && (
                                <div className="checkbox-wrapper-22">
                                    <label className="switch" htmlFor={`checkbox-${idIndex}`}>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${idIndex}`}
                                            checked={value === "Active"}
                                            onChange={(event) => handleRadioChange(event, idIndex)}
                                            disabled={true}
                                        />
                                        <div className="slider round"></div>
                                    </label>
                                </div>
                            )}
                        </>
                    );
                } else if (field.type === 'valueShow') {
                    return (
                        <span className={`only_value_dis`}>{value}</span>
                    );
                } else if (field.type === 'user') {
                    const rowData = tableMeta.rowData;
                    const idIndex = rowData[1];
                    return (
                        <>
                            {idIndex && (
                                <span className='oxyem-custom-table-profile'>
                                    <Profile name={value} imageurl={``} size={"30"} profilelink={``} />
                                    <span className='oxyem-table-link' >{value}</span>
                                </span>
                            )}
                        </>
                    );
                } else if (field.type === 'action') {
                    const rowCount = activeTab === "Client Information" ? clientinfodata.length :
                        activeTab === "Address Information" ? addressInfoData.length : 0;
                    const rowData = tableMeta.rowData;
                    const idIndex = rowData[1];
                    return (
                        < div className='btn_tb_section_o  disable_clie'>
                            {idIndex && (
                                <button
                                    className="btn_edit_tb"
                                    
                                >
                                    <FiEdit />
                                </button>
                            )}
                            {rowCount > 1 && (
                                <button
                                    className="btn_cancal_tb"
                                    
                                >
                                    <RiDeleteBinLine />
                                </button>
                            )}
                        </div>
                    );
                } else {
                    return value;
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
        if (activeTab === "Client Information") {
            updatedData = [clientinfodata];
        } else if (activeTab === "Address Information") {
            updatedData = [...addressInfoData];
        }
        if (activeTab === "Client Information") {
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
        if (activeTab === "Client Information") {
            setClientInfo(updatedData);
        } else if (activeTab === "Address Information") {
            setAddressInfo(updatedData);
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
        if (activeTab === "Client Information") {
            currentData = clientinfodata;
        } else if (activeTab === "Address Information") {
            currentData = addressInfoData;
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
            businessType: typeof inputData.businessType === 'object' && inputData.businessType !== null
                ? inputData.businessType.value
                : inputData.businessType,
            clientId: inputData.clientId,
            clientName: inputData.clientName
        };

        setClientInfo(transformedData)


        if (Object.keys(errors).length > 0) {
            setSectionErrors(errors);
            return;
        }
        const payload = {
            status: "draft",
            idClient: idClient,
            sectionName: activeTab,
            clientinfodata: transformedData,
            addressInfoData: addressInfoData,
        }
        const formData = new FormData();
        formData.append('formData', JSON.stringify(payload));
        inputData.clientDoccument.forEach((file, index) => {
            formData.append(`file[${index}]`, file);
        });
        console.log("44747", formData)

        const response = await axiosJWT.post(`${apiUrl}/client/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response) {
            setIdClient(response.data.idClient)
            setActiveTab("Address Information")
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
        const status = activeTab === "Address Information" ? "open" : "draft";
        const sectionstatus = activeTab === "Address Information" ? "Submitted" : activeTab;
        const payload = {
            status: status,
            idClient: idClient,
            sectionName: sectionstatus,
            clientinfodata: clientinfodata,
            addressInfoData: addressInfoData,
        }
        const formData = new FormData();
        formData.append('formData', JSON.stringify(payload));
        try {
            const response = await axiosJWT.post(`${apiUrl}/client/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response) {
                if (activeTab === "Address Information") {
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
    const openNotesModal = async () => {
        setIsNotesModalOpen(true)
    }
    const closeNotesModal = async () => {
        setIsNotesModalOpen(false)
    }


    const getInstantValue = async (fieldName, value) => {
        if (fieldName === "clientName") {
            const opportunitySection = formvalue.section.find(section => section.SectionName === "Client Information");
            const opportunitySubsection = opportunitySection?.Subsection.find(subsection => subsection.SubsectionName === "Client Information");

            if (!opportunitySubsection) return;

            const clientIdField = opportunitySubsection.fields.find(field => field.name === "clientId");

            if (clientIdField) {
                if (value !== "") {
                    clientIdField.value = uuidv4();
                    clientIdField.isDisabled = true;
                } else {
                    clientIdField.value = "";
                    clientIdField.isDisabled = false;
                }
            }
        }
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day < 10
        const month = date.toLocaleString('default', { month: 'short' }); // Get abbreviated month name
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const getEditformdata = async (value) => {

        const convertedData = {};
        const fields = value.section[0]?.fields || [];

        fields.forEach(field => {
            convertedData[field.name] = field.attributeValue;
        });
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        convertedData.createdDate = formattedDate;
        setAddressInfo(prevData => {
            const updatedData = prevData.map(item => {
                if (item.addressId === convertedData.addressId) {
                    return {
                        ...item,
                        ...convertedData,
                    };
                }
                return item;
            });
            return updatedData;
        });
        setEditForm(false)
    }

    const getsubmitformdata = async (value) => {
        const uniqueId = uuidv4();
        const convertedData = {};
        const fields = value.section[0]?.fields || [];

        fields.forEach(field => {
            convertedData[field.name] = field.attributeValue;
        });

        convertedData.status = "Active";
        convertedData.addressId = uniqueId;
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        convertedData.createdDate = formattedDate;

        if (convertedData.both === true) {
            const dataForBTP = {
                ...convertedData,
                type: "BTP",
                addressId: uuidv4(),
            };

            const dataForSHTP = {
                ...convertedData,
                type: "SHTP",
                addressId: uuidv4(),
            };
            setAddressInfo(prevData => {
                const isFirstEmpty = prevData[0]?.addressId === "" && prevData[0]?.contactPersonName === "" && prevData[0]?.adressDetails === "";
                if (isFirstEmpty) {
                    return [dataForBTP, dataForSHTP, ...prevData.slice(1)];
                } else {
                    return [...prevData, dataForBTP, dataForSHTP];
                }
            });
            setShowForm(false)

        } else {
            setAddressInfo(prevData => {
                const isFirstEmpty = prevData[0]?.addressId === "" && prevData[0]?.contactPersonName === "" && prevData[0]?.adressDetails === "";
                if (isFirstEmpty) {
                    return [convertedData, ...prevData.slice(1)];
                } else {
                    return [...prevData, convertedData];
                }
            });
            setShowForm(false)
        }
    };
    const cancelMainAction = () => {
        router.push(`/clientManagement`);
    };
    const cancelAddForm = () => {
        setShowForm(false)
    };
    const cancelEditForm = () => {
        setEditForm(false)
    };
	
	        const handleWonClick = async () => {
            const payload = {
                ids: [idClient],
                status: "Active"
            }
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


        console.log(clientinfodata,"this is transformed data")
    return (
        <>
            <Head>
                <title>View Client</title>
                <meta name="description" content={"View Client"} />
            </Head>
            {isNotesModalOpen ? (
                <Notes isOpen={isNotesModalOpen} closeModal={closeNotesModal} id={idClient} type={"client"} />
            ) : (null)}
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Create Client"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index" id="oxyem_client_page">
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
                                                                        {activeTab !== "Client Information" ? (
                                                                            <div className="combo_btn_opp">
                                                                                {dataStatus === "open" ? (
                                                                                    <>
                                                                                        {activeTab === "Address Information" ? (
                                                                                            <>
                                                                                                <span className='btn-opportunity-won' onClick={handleWonClick}>Active</span>
                                                                                                <span className='btn-opportunity-loss' onClick={handleLossClick}>Inactive</span>
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

                                                                                {section.name === "addressInformation" ? (
                                                                                    <>
                                                                                        {tableSection === "show" ? (
                                                                                            <div className='oxyem-time-mang-format in_vo_table'>
                                                                                                <h5 className="mb-5">{section.SectionName}</h5>
                                                                                                
                                                                                                <div className={`inner_form_client ${showForm ? 'expand_form_client' : 'reduce_form_client'}`}>
                                                                                                    {showForm ? (

                                                                                                        <SecTab
                                                                                                            AdduserContent={AdduserContent}
                                                                                                            headingContent={""}
                                                                                                            getsubmitformdata={getsubmitformdata}
                                                                                                            pagename={"createClient"}
                                                                                                            cancelClickAction={cancelAddForm}
                                                                                                        />

                                                                                                    ) : (
                                                                                                        null
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className={`inner_form_client ${editForm ? 'expand_form_client' : 'reduce_form_client'}`}>
                                                                                                    {editForm ? (
                                                                                                        <SecTab
                                                                                                            AdduserContent={AdduserContent}
                                                                                                            headingContent={""}
                                                                                                            getsubmitformdata={getEditformdata}
                                                                                                            pagename={"createClient"}
                                                                                                            cancelClickAction={cancelEditForm}
                                                                                                        />

                                                                                                    ) : (
                                                                                                        null
                                                                                                    )}
                                                                                                </div>
                                                                                                <MUIDataTable
                                                                                                    title={""}
                                                                                                    data={activeTab === "Address Information" ? addressInfoData : []}
                                                                                                    columns={columns}
                                                                                                    options={options}
                                                                                                />
                                                                                                
                                                                                            </div>
                                                                                        ) : (<></>)}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {sectionerrors && Object.keys(sectionerrors).map((key) => (
                                                                                            <div key={key} className="alert alert-danger alert-dismissible fade show" role="alert">
                                                                                                {sectionerrors[key]}
                                                                                                <button type="button" className="btn-close" aria-label="Close" onClick={() => removeError(key)}></button>
                                                                                            </div>
                                                                                        ))}
                                                                                         <ClientDetailView
      clientinfodata={clientInfo}
    pricingDocument={pricingDocs}

    />
                                                                                        {/* <DynamicForm
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
                                                                                            cancelClickAction={cancelMainAction}
                                                                                        /> */}
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
            params: { formType: 'createClient' },
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
