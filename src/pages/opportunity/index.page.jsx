import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { FaPlus } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import { axiosJWT } from '../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { GrDocumentNotes } from "react-icons/gr";
import { FaRegClock, FaTimes } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from 'axios';
import { FaRegCheckCircle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import UploadFileDetail from '../Components/common/UploadFile/UploadFileCommanApi.jsx';

const DynamicForm = dynamic(() => import('../Components/CommanForm.jsx'), {
    ssr: false
});
const Notes = dynamic(() => import('../Components/Popup/Notes'), {
    ssr: false
});
export default function opportunity({ userFormdata }) {  // Default to empty array if not provided

    const router = useRouter();
    const showButton = "";
    const pagename = "timeManagement";
    const customDropdownStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : provided.borderColor,
            boxShadow: state.isFocused ? 'var(--dropdownfocusboxshadow)' : provided.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : 'var(--dropdownhoverbordercolor)',
            },
            backgroundColor: state.isFocused ? 'var(--dropdownfocusbgcolor)' : provided.backgroundColor,

        }),
        indicatorSeparator: (provided, state) => ({
            ...provided,
            backgroundColor: 'var(--dropdownhoverbg)',
            fontWeight: 'var(--dropdownfontweight)',
        }),
        menu: (provided) => ({
            ...provided,
            width: 'max-content',
            minWidth: '100%',
            marginBottom: '75px'
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '155px',
            overflowY: 'auto',
        }),
        option: (provided, state) => ({
            ...provided,
            padding: 'var(--dropdownpadding)',
            cursor: 'var(--dropdowncursorstyle)',
            fontWeight: 'var(--dropdownfontweight)',
            backgroundColor: state.isSelected
                ? 'var(--dropdownselectedbgcolor)'
                : state.isFocused
                    ? 'var(--dropdownhoverbg)'
                    : 'var(--dropdowntransparentcolor)',
            color: state.isSelected ? 'var(--dropdownselectedcolor)' : 'var(--dropdowninheritcolor)',
            ':hover': {
                backgroundColor: 'var(--dropdownhoverbg)',
                color: 'var(--dropdownhovercolor)',
                fontWeight: 'var(--dropdownfontweight)',
            },
            width: '100%', // Option width to fit the content
            whiteSpace: 'nowrap',
        }),
    };

    const [formvalue, setFormvalue] = useState(userFormdata);
    const [dataDocuments, setDataDocuments] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [calculate, setcalculate] = useState(false);
    const [fields, setfields] = useState([]);
    const formbuttons = formvalue.section[1].buttons;
    const formsubmitbuttons = formvalue.section[3].buttons;
    const [activeTab, setActiveTab] = useState(formvalue.section[0].SectionName);
    // const [tabArray, setTabArray] = useState([]);
    // useEffect(() => {
    //     if (!tabArray.includes(activeTab) && activeTab !== null) {
    //         setTabArray((prevTabArray) => [...prevTabArray, activeTab]);
    //     }
    // }, [activeTab]);
    const [tabArray, setTabArray] = useState([]);

    // replace the old activeTab effect with this:
    useEffect(() => {
        if (!Array.isArray(formvalue?.section)) return;

        // Build allowed tabs from the form config (only visible ones)
        const initialTabs = formvalue.section
            .filter(s => s.isVisible)
            .map(s => s.SectionName);

        setTabArray(initialTabs);

        // Ensure activeTab is valid — fallback to first visible section if not
        if (!initialTabs.includes(activeTab)) {
            const firstVisible = initialTabs[0] || null;
            if (firstVisible) setActiveTab(firstVisible);
        }
    }, [formvalue]);

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
    const [departOptions, setDepartOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);

    const [expenseOptions, setExpenseOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                    params: { isFor: 'departments' }
                });

                const optionsData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                }));
                setDepartOptions(optionsData);
            } catch (error) {
                console.error('Error fetching options:', error);

            }
        };
        const fetchTaskOptions = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { params: { "isFor": "Expense_Type" } })

                const optionsData = response.data.data.map((item) => ({ // Access response.data.data
                    label: item.name,
                    value: item.id
                }));

                setExpenseOptions(optionsData);
            } catch (error) {
                console.error('Error fetching options:', error);

            }
        };
        fetchOptions();
        fetchTaskOptions();
    }, []);


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
        selectableRows: 'none', // Hide checkbox for selecting rows
    };


    const [dataOpportunity, setDataOpportunity] = useState([]);
    const [dataEffort, setDataEffort] = useState([]);

    const [dataOtherCost, setDataOtherCost] = useState([]);
    const [summaryCost, setSummaryCost] = useState({});

    const getRoleOptionsForUnit = async (unit, rowIndex) => {
        const roleArray = dataEffort.map(item => item.role).filter(role => role); // filter out empty or null roles
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                params: { isFor: 'roles', id: unit }
            });

            if (response) {
                const fetchedRoleOptions = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                }));

                // Remove any roles from fetchedRoleOptions where the id matches a role in roleArray
                const filteredRoleOptions = fetchedRoleOptions.filter(option => !roleArray.includes(option.value));

                // Update the role options in the state
                if (activeTab === "Effort Details") {
                    setRoleOptions(prevData => {
                        // Create a new array to hold updated role options
                        const updatedData = [...prevData];

                        // Ensure the updatedData has enough rows
                        while (updatedData.length <= rowIndex) {
                            updatedData.push({ roleOptions: [] }); // Initialize empty roleOptions for new rows
                        }

                        // Set the roleOptions for the specific row
                        updatedData[rowIndex].roleOptions = filteredRoleOptions;

                        return updatedData;
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching role options:", error);
        }
    };

    // Initialize data for the active tab

    const initializeDataForTab = (tab) => {

        const selectedSection = formvalue.section.find(section => section.SectionName === tab);

        if (selectedSection && selectedSection.Subsection.length > 0) {

            const initialRow = mergeDataWithFields(selectedSection.Subsection[0].fields, []);

            // Ensure document rows have a fileKey placeholder so uploadedFiles can be mapped
            if (tab === "Documents") {
                // keep fileKey empty until user selects a file
                initialRow.fileKey = initialRow.fileKey || '';
            }
            return [initialRow]; // Return an array with the initial row

        }

        return [];

    };


    // const handleTabClick = (tab) => {
    //     if (tabArray.includes(tab)) {
    //         if (activeTab !== tab) {
    //             setActiveTab(tab);
    //             setfields(formvalue.section.find(section => section.SectionName === tab).Subsection[0].fields);
    //             if (tab === "Opportunity Details" && dataOpportunity.length === 0) {
    //                 setDataOpportunity(initializeDataForTab(tab));
    //             } else if (tab === "Effort Details" && dataEffort.length === 0) {
    //                 setDataEffort(initializeDataForTab(tab));
    //             } else if (tab === "Other Cost" && dataOtherCost.length === 0) {
    //                 setDataOtherCost(initializeDataForTab(tab));
    //             }else if (tab === "Documents" && dataDocuments.length === 0) {
    //             setDataDocuments(initializeDataForTab(tab));
    //         }

    //         }
    //     } else {
    //         console.log(`${tab} is not in the tabArray`);
    //     }

    // };


    // replace handleTabClick with this simpler version
    const handleTabClick = (tab) => {
        // allow switching to any visible tab (no strict tabArray guard)
        const section = formvalue.section.find(section => section.SectionName === tab);
        if (!section || !section.isVisible) {
            console.warn(`${tab} is not available or not visible`);
            return;
        }

        if (activeTab !== tab) {
            setActiveTab(tab);
            setfields(section.Subsection[0].fields);

            if (tab === "Opportunity Details" && dataOpportunity.length === 0) {
                setDataOpportunity(initializeDataForTab(tab));
            } else if (tab === "Effort Details" && dataEffort.length === 0) {
                setDataEffort(initializeDataForTab(tab));
            } else if (tab === "Other Cost" && dataOtherCost.length === 0) {
                setDataOtherCost(initializeDataForTab(tab));
            } else if (tab === "Documents" && dataDocuments.length === 0) {
                setDataDocuments(initializeDataForTab(tab));
            }
        }
    };

    const addRow = () => {

        const newRow = mergeDataWithFields(fields, existingData);

        if (activeTab === "Opportunity Details") {

            //setDataOpportunity([...dataOpportunity, newRow]);

        } else if (activeTab === "Effort Details") {

            setDataEffort([...dataEffort, newRow]);

        } else if (activeTab === "Other Cost") {

            setDataOtherCost([...dataOtherCost, newRow]);

        } else if (activeTab === "Documents") {
            // add a documents row — fileKey left empty until file selected
            const rowWithKey = { ...newRow, fileKey: '' };
            setDataDocuments(prev => [...prev, rowWithKey]);
        }

    };


    useEffect(() => {

        const initialSection = formvalue.section.find(section => section.SectionName === activeTab);

        if (initialSection && initialSection.Subsection.length > 0) {

            setfields(initialSection.Subsection[0].fields);

            // Initialize data for the active tab only if it's empty

            if (activeTab === "Opportunity Details" && dataOpportunity.length === 0) {

                setDataOpportunity(initializeDataForTab(activeTab));

            } else if (activeTab === "Effort Details" && dataEffort.length === 0) {

                setDataEffort(initializeDataForTab(activeTab));

            } else if (activeTab === "Other Cost" && dataOtherCost.length === 0) {

                setDataOtherCost(initializeDataForTab(activeTab));

            } else if (activeTab === "Documents" && dataDocuments.length === 0) {
                setDataDocuments(initializeDataForTab(activeTab));
            }

        }

    }, [activeTab]);







    const handleDeleteRow = (rowIndex) => {
        let updatedData;
        if (activeTab === "Opportunity Details") {
            updatedData = [...dataOpportunity];
            updatedData.splice(rowIndex, 1); // Remove the row at the specified index
            setDataOpportunity(updatedData);
        } else if (activeTab === "Effort Details") {
            updatedData = [...dataEffort];
            updatedData.splice(rowIndex, 1);
            setDataEffort(updatedData);
        } else if (activeTab === "Other Cost") {
            updatedData = [...dataOtherCost];
            updatedData.splice(rowIndex, 1);
            setDataOtherCost(updatedData);
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
                                    if (/^(\d+(\.\d*)?|\.\d*)?$/.test(newValue)) {
                                        updateValue(newValue);
                                        handleChangeValue(field.name, newValue, rowIndex);
                                    }
                                }}
                            />
                        </span>
                    );
                } if (field.type === 'AllText') {
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            <input
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
                        <span className={error ? "table_field_error" : ""}>
                            <input
                                className={`form-control sr-no-input`}
                                value={rowIndex + 1 || ""}
                                disabled={field.isDisabled || ""}
                                placeholder={field.placeholder}
                            />
                        </span>
                    );
                } else if (field.type === 'Expense') {
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            <Select
                                value={expenseOptions.find(option => option.value === value)}
                                options={expenseOptions}
                                isDisabled={field.isDisabled || ""}
                                onChange={(selectedOption) => {
                                    const newValue = selectedOption ? selectedOption.value : '';
                                    updateValue(newValue);
                                    handleChangeValue(field.name, newValue, rowIndex); // Update the local state
                                }}
                                isClearable={true}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                className="oxyem-custom-dropdown"
                                placeholder="Search and Select"
                                styles={customDropdownStyles}
                            />
                        </span>
                    );
                } else if (field.type === 'File') {
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleChangeValue(field.name, file, rowIndex);
                                    }
                                }}
                            />
                        </span>
                    );
                } else if (field.type === 'Client') {
                    return (
                        <span className={error ? "table_field_error" : ""}>
                            <Select
                                value={departOptions.find(option => option.value === value)}
                                options={departOptions}
                                isDisabled={field.isDisabled || ""}
                                onChange={(selectedOption) => {
                                    const newValue = selectedOption ? selectedOption.value : '';
                                    updateValue(newValue);
                                    handleChangeValue(field.name, newValue, rowIndex); // Update the local state
                                }}
                                isClearable={true}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                className="oxyem-custom-dropdown"
                                placeholder="Search and Select"
                                styles={customDropdownStyles}
                            />
                        </span>
                    );
                } else if (field.type === 'Role') {
                    const options = roleOptions[rowIndex]?.roleOptions || [];
                    return (
                        <span className={error ? "table_field_error" : ""}>

                            <Select

                                value={options.find(option => option.value === value)}

                                options={options}

                                isDisabled={field.isDisabled || ""}

                                onChange={(selectedOption) => {

                                    const newValue = selectedOption ? selectedOption.value : '';
                                    updateValue(newValue);
                                    handleChangeValue(field.name, newValue, rowIndex); // Update the local state
                                    // additionalFunction(field.name, newValue, rowIndex);
                                }}

                                isClearable={true}

                                getOptionLabel={(option) => option.label}

                                getOptionValue={(option) => option.value}

                                className="oxyem-custom-dropdown"

                                placeholder="Search and Select"

                                styles={customDropdownStyles}
                            />

                        </span>
                    );
                } else if (field.type === 'action') {
                    const rowCount = activeTab === "Opportunity Details" ? dataOpportunity.length :
                        activeTab === "Effort Details" ? dataEffort.length :
                            activeTab === "Other Cost" ? dataOtherCost.length : 0;

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
            }
        }
    }));


    const [errors, setErrors] = useState({});
    const handleChangeValue = async (fieldName, value, rowIndex) => {
        let updatedData;
        if (activeTab === "Opportunity Details") {
            updatedData = [dataOpportunity];
        } else if (activeTab === "Effort Details") {
            updatedData = [...dataEffort];
        } else if (activeTab === "Other Cost") {
            updatedData = [...dataOtherCost];
        } else if (activeTab === "Documents") {
            updatedData = [...dataDocuments];
        }
        // Handle file uploads
        if (fieldName === "documentFile") {
            const file = value;
            if (file) {
                const fileKey = `${rowIndex}_${Date.now()}`;
                setUploadedFiles(prev => ({
                    ...prev,
                    [fileKey]: file
                }));
                updatedData[rowIndex] = {
                    ...updatedData[rowIndex],
                    [fieldName]: file.name,
                    fileKey: fileKey
                };
            }
        }

        if (activeTab === "Opportunity Details") {
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
        if (fieldName === "role") {
            const role = updatedData[rowIndex].role;

            if (role) {
                const totalCost = await fetchTotalCostForRole(role);
                updatedData[rowIndex].rateCard = totalCost;
            }
        }
        if (fieldName === "monthlyPerson" || fieldName === "rateCard" || fieldName === "totalEffort") {
            const monthlyPerson = updatedData[rowIndex].monthlyPerson;
            const rateCard = updatedData[rowIndex].rateCard;
            const totalEffort = updatedData[rowIndex].totalEffort;
            const overideRate = updatedData[rowIndex].overideRate;
            // Check if all the required fields have values (and are numeric)
            if (
                monthlyPerson &&
                rateCard &&
                totalEffort &&
                !isNaN(monthlyPerson) &&
                !isNaN(rateCard) &&
                !isNaN(totalEffort)
            ) {
                const totalCost = Number(monthlyPerson) * Number(rateCard) * Number(totalEffort) * 8;
                updatedData[rowIndex].totalCost = totalCost.toFixed(2); // You can adjust the number of decimals if needed
                if (overideRate === "") {
                    updatedData[rowIndex].overrideTotalCost = totalCost.toFixed(2); // You can adjust the number of decimals if needed
                }
            }
        }
        if (fieldName === "monthlyPerson" || fieldName === "overideRate" || fieldName === "totalEffort") {
            const monthlyPerson = updatedData[rowIndex].monthlyPerson;
            const overideRate = updatedData[rowIndex].overideRate;
            const totalEffort = updatedData[rowIndex].totalEffort;
            const totalCostm = updatedData[rowIndex].totalCost;
            if (overideRate === "") {
                updatedData[rowIndex].overrideTotalCost = totalCostm;
            }
            // Check if all the required fields have values (and are numeric)
            if (
                monthlyPerson &&
                overideRate &&
                totalEffort &&
                !isNaN(monthlyPerson) &&
                !isNaN(overideRate) &&
                !isNaN(totalEffort)
            ) {
                const totalCost = Number(monthlyPerson) * Number(overideRate) * Number(totalEffort) * 8;
                updatedData[rowIndex].overrideTotalCost = totalCost.toFixed(2); // You can adjust the number of decimals if needed
            }
        }
        if (fieldName === "quantity" || fieldName === "amountPerUnit") {
            const quantity = updatedData[rowIndex].quantity;
            const amountPerUnit = updatedData[rowIndex].amountPerUnit;

            // Check if all the required fields have values (and are numeric)
            if (
                quantity &&
                amountPerUnit &&
                !isNaN(quantity) &&
                !isNaN(amountPerUnit)
            ) {
                const totalCost = Number(quantity) * Number(amountPerUnit);
                updatedData[rowIndex].totalAmount = totalCost.toFixed(2); // You can adjust the number of decimals if needed
            }
        }
        if (activeTab === "Opportunity Details") {
            setDataOpportunity(updatedData);
        } else if (activeTab === "Effort Details") {
            setDataEffort(updatedData);
        } else if (activeTab === "Other Cost") {
            setDataOtherCost(updatedData);
        } else if (activeTab === "Documents") {
            setDataDocuments(updatedData);
        }
        if (fieldName === "Unit") {
            const selectedUnit = value;
            getRoleOptionsForUnit(selectedUnit, rowIndex);
        }
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            if (newErrors[fieldName]) {
                newErrors[fieldName][rowIndex] = undefined; // Clear the error for the specific row
            }
            return newErrors;
        });

        const existingClientField = formvalue.section[0].Subsection[0].fields.find(
            field => field.name === "existingClient"
        );
        const clientNameField = formvalue.section[0].Subsection[0].fields.find(
            field => field.name === "clientName"
        );
        setFormvalue({ ...formvalue });
    };

    useEffect(() => {
        if (calculate) {
            const updatedData = dataEffort.map(row => {
                const monthlyPerson = parseFloat(row.monthlyPerson); // Ensure it's treated as a number
                const rateCard = parseFloat(row.rateCard);           // Ensure it's treated as a number
                const overideRate = parseFloat(row.overideRate);     // Ensure it's treated as a number
                const totalEffort = parseFloat(row.totalEffort);     // Ensure it's treated as a number

                // Calculate totalCost and overrideTotalCost
                const totalCost = isNaN(monthlyPerson * rateCard * totalEffort * 8)
                    ? 0
                    : (monthlyPerson * rateCard * totalEffort * 8).toFixed(2);

                const overrideTotalCost = isNaN(monthlyPerson * overideRate * totalEffort * 8)
                    ? 0
                    : (monthlyPerson * overideRate * totalEffort * 8).toFixed(2);

                return {
                    ...row,
                    totalCost: totalCost,
                    overrideTotalCost: overrideTotalCost
                };
            });
            setDataEffort(updatedData);
        }

    }, [calculate]);


    const validateFields = (fields) => {
        const errors = {};
        let currentData;
        if (activeTab === "Opportunity Details") {
            currentData = dataOpportunity;
        } else if (activeTab === "Effort Details") {
            currentData = dataEffort;
        } else if (activeTab === "Other Cost") {
            currentData = dataOtherCost;
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
    const [opportunityId, setOpportunityId] = useState("");
    // const submitformdata = async (value) => {
    //     const inputData = value
    //     const transformedData = {
    //         opportunityName: inputData.opportunityName,
    //         existingClient: inputData.existingClient,
    //         clientName: inputData.clientName.value,
    //         startDate: inputData.startDate,
    //         endDate: inputData.endDate,
    //         location: inputData.location.value,
    //         currencyType: inputData.currencyType.value
    //     };
    //     setDataOpportunity(transformedData)
    //     const startDate = new Date(value.startDate);
    //     const endDate = new Date(value.endDate);
    //     const errors = {};

    //     if (startDate >= endDate) {
    //         errors.dateRange = 'Start date must be before end date.';
    //     }

    //     if (Object.keys(errors).length > 0) {
    //         setSectionErrors(errors);
    //         return;
    //     }

    //        // Prepare FormData to include files
    // const formData = new FormData();
    // formData.append('status', 'Draft');
    // formData.append('opportunityId', opportunityId || '');
    // formData.append('dataOpportunity', JSON.stringify(transformedData));
    // formData.append('dataEffort', JSON.stringify(dataEffort));
    // formData.append('dataOtherCost', JSON.stringify(dataOtherCost));
    // formData.append('summaryCost', JSON.stringify(summaryCost));

    // // Include documents rows metadata (file names + fileKey) so server can map files -> rows
    // formData.append('dataDocuments', JSON.stringify(dataDocuments || []));

    // // Append each uploaded File object. server should accept multiple files under same field (e.g. 'files')
    // Object.entries(uploadedFiles || {}).forEach(([fileKey, file]) => {
    //     // append file with its fileKey so backend can correlate
    //     formData.append('files', file); // multiple files under 'files'
    //     formData.append('fileKeys', fileKey); // optional: send parallel list of keys (or backend can read from dataDocuments)
    // });
    // try {
    //     const response = await axiosJWT.post(`${apiUrl}/opportunity/add`, formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     });

    //     } catch (error) {
    //         console.log("Error submitting form data:", error);
    //     }
    //     if (response) {
    //         setActiveTab("Effort Details");
    //         const tab = "Effort Details"
    //         setDataEffort(initializeDataForTab(tab));
    //         setOpportunityId(response.data.moduleId)
    //         setCurrencyId(response.data.currencyType)

    //         const updatedFormvalue = JSON.parse(JSON.stringify(formvalue));

    //         const clientNameField = updatedFormvalue.section[1].Subsection[0].fields.find(
    //             field => field.name === "totalEffort"
    //         );

    //         if (clientNameField) {
    //             clientNameField.value = response.data.totalDays;
    //             clientNameField.isDisabled = true;
    //         }
    //         setFormvalue(updatedFormvalue);
    //         setisTabclick(true);
    //         settableSection("show");
    //         const totalDays = response.data.totalDays;

    //         const updatedData = dataEffort.map(row => ({
    //             ...row, // Spread the existing row data
    //             totalEffort: totalDays // Set totalEffort to the value of totalDays
    //         }));

    //         setDataEffort(updatedData);

    //         setTimeout(() => {
    //             setcalculate(true)
    //         }, 1000);
    //         setTimeout(() => {
    //             setcalculate(false)
    //         }, 2000);


    //     }
    // };


    const submitformdata = async (value) => {
        const inputData = value;
        const transformedData = {
            opportunityName: inputData.opportunityName,
            existingClient: inputData.existingClient,
            clientName: inputData.clientName.value,
            startDate: inputData.startDate,
            endDate: inputData.endDate,
            location: inputData.location.value,
            currencyType: inputData.currencyType.value
        };
        setDataOpportunity(transformedData);

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
            opportunityId: opportunityId,
            dataOpportunity: transformedData,
            dataEffort: dataEffort,
            dataOtherCost: dataOtherCost,
            summaryCost: summaryCost,
            dataDocuments: dataDocuments || []
        };

        // Prepare FormData with payload and files
        const formData = new FormData();
        formData.append('formData', JSON.stringify(payload));

        // Handle document files
        // const documentFiles = Object.values(uploadedFiles || {});
        // if (Array.isArray(documentFiles) && documentFiles.length > 0) {
        //     documentFiles.forEach((file) => {
        //         formData.append('file', file);
        //     });
        // }

        const rawFiles =
            value.opportunityDocuments ||
            value.opportunityDoccument ||   // keep old spelling if used in form
            value.documents ||
            value.documentFile ||
            [];

        const files = Array.isArray(rawFiles)
            ? rawFiles
            : (rawFiles instanceof FileList ? Array.from(rawFiles) : []);

        if (files.length > 0) {
            files.forEach(file => {
                formData.append('file', file); // backend expects multiple 'file' entries
            });
        }


        try {
            const response = await axiosJWT.post(`${apiUrl}/opportunity/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response) {
                // setActiveTab("Effort Details");
                setActiveTab("Documents");
                const tab = "Effort Details";
                setDataEffort(initializeDataForTab(tab));
                setOpportunityId(response.data.moduleId);
                setCurrencyId(response.data.currencyType);

                const updatedFormvalue = JSON.parse(JSON.stringify(formvalue));

                const clientNameField = updatedFormvalue.section[1].Subsection[0].fields.find(
                    field => field.name === "totalEffort"
                );

                if (clientNameField) {
                    clientNameField.value = response.data.totalDays;
                    clientNameField.isDisabled = true;
                }
                setFormvalue(updatedFormvalue);
                setisTabclick(true);
                settableSection("show");
                const totalDays = response.data.totalDays;

                const updatedData = dataEffort.map(row => ({
                    ...row,
                    totalEffort: totalDays
                }));

                setDataEffort(updatedData);

                setTimeout(() => {
                    setcalculate(true);
                }, 1000);
                setTimeout(() => {
                    setcalculate(false);
                }, 2000);
            }
        } catch (error) {
            console.log("Error submitting form data:", error);
        }
    };
    const handleSubmit = async () => {

        if (activeTab !== "Summary") {
            const fieldErrors = validateFields(fields);
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
                return;
            }
        }
        const status = activeTab === "Summary" ? "open" : "Draft";
        const isfor = activeTab === "Other Cost" ? "Summary" : "";
        const payload = {
            status: status,
            isfor: isfor,
            opportunityId: opportunityId,
            dataOpportunity: dataOpportunity,
            dataEffort: dataEffort,
            dataOtherCost: dataOtherCost,
            summaryCost: summaryCost
        }
        try {
            const response = await axiosJWT.post(`${apiUrl}/opportunity/add`, payload);

            if (response) {
                if (activeTab === "Effort Details") {
                    setActiveTab("Other Cost");
                } else if (activeTab === "Other Cost") {
                    setSummaryCost(response.data.data.summaryInfo);
                    setActiveTab("Summary");
                } else if (activeTab === "Summary") {

                    const message = 'You have successfully created <strong>New Opportunity</strong>!';
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
                        router.push(`/opportunity/view`);
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
        router.push(`/opportunity/view`);
    }
    const handleDraftSubmit = async () => {
        router.push(`/opportunity/view`);
    }

    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
    const openNotesModal = async () => {
        setIsNotesModalOpen(true)
    }
    const closeNotesModal = async () => {
        setIsNotesModalOpen(false)
    }
    return (
        <>
            <Head>
                <title>Create Opportunity</title>
                <meta name="description" content={"Create Opportunity"} />
            </Head>
            {isNotesModalOpen ? (
                <Notes isOpen={isNotesModalOpen} closeModal={closeNotesModal} id={opportunityId} type={"opportunity"} />
            ) : (null)}
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Create Opportunity"} />
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

                                                                {activeTab !== "Opportunity Details" ? (
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

                                                                                {section.name === "effortD" || section.name === "otherCost" ? (
                                                                                    <>
                                                                                        {tableSection === "show" ? (
                                                                                            <div className='oxyem-time-mang-format'>
                                                                                                <h5 className="mb-5">{section.SectionName}</h5>
                                                                                                <div className="col-12 text-end">
                                                                                                    <span className='btn btn-primary breadcrum-btn' onClick={addRow}><FaPlus /></span>
                                                                                                </div>
                                                                                                { section.name === "effortD" ? (
                                                                                                    <div className="opp_box_info">
                                                                                                        <div className='icon_box_perform'>
                                                                                                            <FaInfoCircle />
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <p>Please Note:</p>
                                                                                                            <ul>
                                                                                                                <li>All rate cards are displayed in USD.</li>
                                                                                                                <li> During Opportunity creation, the cost will be automatically converted from USD into the selected currency.</li>
                                                                                                                <li>If the rate card is overridden, the updated value will be displayed on the Summary screen.</li>
                                                                                                            </ul>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ) : (null)}
                                                                                                <MUIDataTable
                                                                                                    title={""}
                                                                                                    data={activeTab === "Other Cost" ? dataOtherCost : activeTab === "Effort Details" ? dataEffort : []}
                                                                                                    columns={columns}
                                                                                                    options={options}
                                                                                                />
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
                                                                                ): section.name === "Documents" ? (
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
                                                                                                                    documentId={opportunityId}
                                                                                                                    documentFor="opportunity"
                                                                                                                    onDocumentsChange={(docs) => setDataDocuments(docs)}
                                                                                                                />

                                                                                                                <div className="justify-content-end d-flex w-100 mt-4">                                                   <button className="btn btn-secondary" onClick={handleBackClick}>Cancel</button>
                                                                                                                    <button
                                                                                                                        className="btn btn-primary ms-2"
                                                                                                                        onClick={() => {
                                                                                                                            // If any tab has validation errors, jump to its first error tab
                                                                                                                            const errorTab = findFirstErrorTab();
                                                                                                                            if (errorTab) {
                                                                                                                                setActiveTab(errorTab);
                                                                                                                                return;
                                                                                                                            }
                                                                                                                            // otherwise move to next visible tab
                                                                                                                            const idx = formvalue.section.findIndex(s => s.SectionName === activeTab);
                                                                                                                            if (idx >= 0) {
                                                                                                                                for (let i = idx + 1; i < formvalue.section.length; i++) {
                                                                                                                                    if (formvalue.section[i].isVisible) {
                                                                                                                                        setActiveTab(formvalue.section[i].SectionName);
                                                                                                                                        break;
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Next
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )  : section.name === "summary" ? (
                                                                                    <>
                                                                                        <div className="row justify-content-center">
                                                                                            <div className="col-xxl-10">
                                                                                                <div className="opp_box_info">
                                                                                                    <div className='icon_box_perform'>
                                                                                                        <FaInfoCircle />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p>Please Note:</p>
                                                                                                        <ul>
                                                                                                            <li>All rate cards are displayed in USD.</li>
                                                                                                            <li> During Opportunity creation, the cost will be automatically converted from USD into the selected currency.</li>
                                                                                                            <li>If the rate card is overridden, the updated value will be displayed on the Summary screen.</li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="row_design_view">
                                                                                                    {Object.entries(summaryCost).map(([sectionTitle, sectionData]) => {

                                                                                                        // Conditional rendering based on sectionTitle

                                                                                                        if (sectionTitle === "Opportunity  Information") {

                                                                                                            return (

                                                                                                                <div className="card oppor_cards" key={sectionTitle}>

                                                                                                                    <div className="card-body card_inform">

                                                                                                                        <h5 className="card-title">{sectionTitle}</h5>

                                                                                                                        {Object.entries(sectionData).map(([key, value]) => (

                                                                                                                            <p key={key} className="card-text">

                                                                                                                                <span className='card-text-left'>{key}</span>

                                                                                                                                <span className='card-text-center'>:</span>

                                                                                                                                <span className='card-text-right'>{value}</span>

                                                                                                                            </p>

                                                                                                                        ))}

                                                                                                                    </div>

                                                                                                                </div>

                                                                                                            );

                                                                                                        } else if (sectionTitle === "Resource  Information") {

                                                                                                            return (
                                                                                                                <div className="card oppor_cards" key={sectionTitle}>
                                                                                                                    <div className="card-body card_resources">
                                                                                                                        <h5 className="card-title">Resource Information</h5>
                                                                                                                        <div className='res_opp'>
                                                                                                                            {Object.entries(sectionData).map(([key, value], index) => (
                                                                                                                                <div key={key} className={index % 2 === 0 ? 'res_opp_left' : 'res_opp_right'}>
                                                                                                                                    <p className="card-title">{key}</p>
                                                                                                                                    <p className="card-text-cus">
                                                                                                                                        {value}
                                                                                                                                    </p>
                                                                                                                                </div>
                                                                                                                            ))}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            );

                                                                                                        } else if (sectionTitle === "Financial  Information") {

                                                                                                            return (
                                                                                                                <div className="card oppor_cards bg_light_green" key={sectionTitle}>
                                                                                                                    <div className="card-body card_financial">
                                                                                                                        <div className="card_financial_top">
                                                                                                                            <h5 className="card-title">{sectionTitle}</h5>
                                                                                                                            <p className="card-text-cus">
                                                                                                                                {Object.entries(sectionData).map(([key, value], index) => {
                                                                                                                                    if (key === "total") {
                                                                                                                                        return <>{value}</>;
                                                                                                                                    }
                                                                                                                                    return null;
                                                                                                                                })}
                                                                                                                            </p>
                                                                                                                        </div>
                                                                                                                        <div className="row">
                                                                                                                            {Object.entries(sectionData).map(([key, value]) => (
                                                                                                                                key === "total" ? null : (
                                                                                                                                    <div key={key} className="card_oppor_cards">
                                                                                                                                        <p className="card-text">
                                                                                                                                            <span className='card-text-left'>{key}</span>
                                                                                                                                            <span className='card-text-center'>:</span>
                                                                                                                                            <span className='card-text-right'>
                                                                                                                                                {value}
                                                                                                                                            </span>
                                                                                                                                        </p>
                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                            ))}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            );

                                                                                                        } else if (sectionTitle === "Financial  Information USD") {

                                                                                                            return (
                                                                                                                <div className="card oppor_cards" key={sectionTitle}>
                                                                                                                    <div className="card-body card_financial">
                                                                                                                        <div className="card_financial_top">
                                                                                                                            <h5 className="card-title">{sectionTitle}</h5>
                                                                                                                            <p className="card-text-cus">
                                                                                                                                {Object.entries(sectionData).map(([key, value], index) => {
                                                                                                                                    if (key === "total") {
                                                                                                                                        return <>{value}</>;
                                                                                                                                    }
                                                                                                                                    return null;
                                                                                                                                })}
                                                                                                                            </p>
                                                                                                                        </div>
                                                                                                                        <div className="row">
                                                                                                                            {Object.entries(sectionData).map(([key, value]) => (
                                                                                                                                key === "total" ? null : (
                                                                                                                                    <div key={key} className="card_oppor_cards">
                                                                                                                                        <p className="card-text">
                                                                                                                                            <span className='card-text-left'>{key}</span>
                                                                                                                                            <span className='card-text-center'>:</span>
                                                                                                                                            <span className='card-text-right'>
                                                                                                                                                {value}
                                                                                                                                            </span>
                                                                                                                                        </p>
                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                            ))}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            );

                                                                                                        } else if (sectionTitle === "Profit Margin") {

                                                                                                            return (
                                                                                                                <div className="card oppor_cards" key={sectionTitle}>
                                                                                                                    <div className="card-body card_profit_o">
                                                                                                                        <div className="card_financial_top">
                                                                                                                            <h5 className="card-title">{sectionTitle}</h5>
                                                                                                                            <p className="card-text-cus">
                                                                                                                                {Object.entries(sectionData).map(([key, value], index) => {
                                                                                                                                    if (key === "total") {
                                                                                                                                        return <>{value}</>;
                                                                                                                                    }
                                                                                                                                    return null;
                                                                                                                                })}
                                                                                                                            </p>
                                                                                                                        </div>
                                                                                                                        <div className="row">
                                                                                                                            {Object.entries(sectionData).map(([key, value]) => (
                                                                                                                                key === "total" ? null : (
                                                                                                                                    <div key={key} className="card_oppor_cards">
                                                                                                                                        <p className="card-text">
                                                                                                                                            <span className='card-text-left'>{key}</span>
                                                                                                                                            <span className='card-text-center'>:</span>
                                                                                                                                            <span className='card-text-right'>
                                                                                                                                                {value}
                                                                                                                                            </span>
                                                                                                                                        </p>
                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                            ))}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            );

                                                                                                        } else {

                                                                                                            return null;

                                                                                                        }

                                                                                                    })}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="justify-content-end d-flex w-100 mt-4">
                                                                                            {formsubmitbuttons.map((btn, index) => (
                                                                                                <React.Fragment key={index}>
                                                                                                    {btn.buttontype === "submit" ? (
                                                                                                        <button className={`btn ${btn.class}`} onClick={handleSubmit}>
                                                                                                            {btn.label}
                                                                                                        </button>
                                                                                                    ) : (
                                                                                                        <button className={`btn ${btn.class}`} onClick={btn.buttontype === "Cancel" ? handleBackClick : handleDraftSubmit}>
                                                                                                            {btn.label}
                                                                                                        </button>
                                                                                                    )}
                                                                                                </React.Fragment>
                                                                                            ))}
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
            params: { formType: 'Opportunity' },
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
