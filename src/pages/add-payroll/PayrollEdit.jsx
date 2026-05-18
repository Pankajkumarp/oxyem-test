import React, { useEffect, useState } from "react";
import { axiosJWT } from "../Auth/AddAuthorization";
import { FaCheckCircle, FaClock, FaHistory, FaLock, FaMoneyBillWave, FaInfoCircle, FaEdit } from "react-icons/fa";
import dynamic from "next/dynamic";
import Profile from "../Components/commancomponents/profile";
import { RiDeleteBinLine } from "react-icons/ri";
import PreviewPopupComponent from './PreviewPopupComponent';
import EditPopup from "./EditPopup";
import { IoIosClose } from "react-icons/io";
import { useRouter } from "next/router";
import { Tooltip } from 'react-tooltip'
import { ToastNotification } from '../Components/EmployeeDashboard/Alert/ToastNotification';

const Employee = dynamic(
    () => import("../Components/common/SelectComponent/EmployeeComponent"),
    { ssr: false }
);
const MounthPicker = dynamic(
    () => import("../Components/common/Inputfiled/MonthDateComponent"),
    { ssr: false }
);
const SelectOption = dynamic(
    () => import("../Components/common/SelectComponent/SelectOptionComponent"),
    { ssr: false }
);
const NumberField = dynamic(
    () => import("../Components/common/Inputfiled/NumberComponent"),
    { ssr: false }
);
const TextField = dynamic(
    () => import("../Components/common/Inputfiled/TextComponent"),
    { ssr: false }
);


export default function PayrollEdit() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [errorMessage, seterrorMessage] = useState("");
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const currentMonthYear = `${currentYear}-${currentMonth}`
    const [content, setContent] = useState(null);
    const [previewData, setPreviewData] = useState({});
    const [currency, setcurrency] = useState("");
    const [idEmployee, setidEmployee] = useState(null);
    const [applicableFrom, setApplicableFrom] = useState(currentMonthYear);
    const [previousMonthSalary, setPreviousMonthSalary] = useState(0);
    const [attendanceInfo, setAttendanceInfo] = useState({});
    const [showData, setShowData] = useState(false);
    const [idSalary, setIdSalary] = useState("");
    const [isWithoutActualTax, setIsWithoutActualTax] = useState(false);

    const formatMonthYear = (value) => {
        if (!value) return "";

        const [year, month] = value.split("-");

        const date = new Date(year, month - 1);

        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric"
        }).format(date);
    };

    const currencyMap = {
        "₹": { code: "INR", locale: "en-IN" },
        "$": { code: "USD", locale: "en-US" },
        "€": { code: "EUR", locale: "de-DE" },
        "£": { code: "GBP", locale: "en-GB" },
        "¥": { code: "JPY", locale: "ja-JP" }
    };
    const formatMoney = (amount) => {
        const currencyInfo = currencyMap[currency] || { code: "INR", locale: "en-IN" };

        return new Intl.NumberFormat(currencyInfo.locale, {
            style: "currency",
            currency: currencyInfo.code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(amount || 0));
    };
    const mergeSalaryValues = (form, salaryData) => {
        if (!form) return form;
        const newForm = JSON.parse(JSON.stringify(form)); // deep clone
        const section = newForm.section?.[0];
        const mergeFields = (fields) => {
            fields.forEach(field => {
                if (salaryData[field.name] !== undefined) {
                    field.value = salaryData[field.name];
                }
            });
        };

        // earnings
        section?.earningfield?.forEach(sub =>
            mergeFields(sub.fields)
        );

        // deductions
        section?.deductionsfield?.forEach(sub =>
            mergeFields(sub.fields)
        );

        // summary
        section?.summary?.fields?.forEach(field => {
            if (salaryData[field.name] !== undefined) {
                field.value = salaryData[field.name];
            }
        });

        return newForm;
    };



    useEffect(() => {
        if (idEmployee?.value && applicableFrom) {
            const getPrefilledData = async () => {
                setShowData(false)
                seterrorMessage("")
                setIdSalary("")
                try {
                    const response = await axiosJWT.get(`${apiUrl}/payroll/getBoaWithDeductionsForSalary`, {
                        params: {
                            "idEmployee": idEmployee.value,
                            "applicableMonth": applicableFrom
                        }
                    });
                    if (response) {
                        if (response.data.errorMessage) {
                            seterrorMessage(response.data.errorMessage)
                            window.scrollTo(0, 0);
                            return;
                        }
                        const responseData = response.data.data
                        setPreviewData(responseData)
                        setcurrency(responseData?.currency)
                        setIdSalary(responseData?.idSalary)
                        setPreviousMonthSalary(Number(responseData?.previousMonthNetSalary || 0));
                        setAttendanceInfo(responseData?.attendanceInfo);
                        setContent(prev => mergeSalaryValues(prev, responseData));
                        setShowData(true)
                    }
                } catch (error) { }
            };
            getPrefilledData();
        }
    }, [idEmployee?.value, applicableFrom]);
    useEffect(() => {
        fetchForm();
    }, []);

    const onChange = async (value) => {
        setidEmployee(value)
    };
    const onMonthChange = async (value) => {
        setApplicableFrom(value)
    };
    const fetchForm = async () => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, {
                params: { formType: "payrollEditor" },
            });

            if (response.status === 200 && response.data.data) {
                setContent(response.data.data);
            }
        } catch (error) {
        }
    };
    const onClose = async () => { seterrorMessage("") }
    const earningsFields =
        content?.section?.[0]?.earningfield?.[0]?.fields || [];

    const deductionsFields =
        content?.section?.[0]?.deductionsfield?.[0]?.fields || [];

    const buttons =
        content?.section?.[0]?.buttons || [];

    const payrollGroups = {
        basic: ["basicSalary"],
        medicalAllowances: ["medicalAllowances"],
        projectAllowances: ["projectAllowances"],
        specialAllowance: ["specialAllowance"],
        daHRA: ["daHRA"],
        conveyanceAllowance: ["conveyanceAllowance"],
        lop: ["lop"],
        tds: ["tds"],
        allowances: [
            "daHRA",
            "conveyanceAllowance",
            "projectAllowances",
            "specialAllowance",
            "medicalAllowances"
        ],
        employerContribution: ["providentFund", "esi"],
        deductions: ["tds", "lop"]
    };
    const sumExtra = (name) => {
        return (extraFields[name] || []).reduce(
            (sum, r) => sum + Number(r.amount || 0),
            0
        );
    };
    const [extraFields, setExtraFields] = useState({});

    const [draftEarnings, setDraftEarnings] = useState({});
    const [draftDeductions, setDraftDeductions] = useState({});
    const sumFields = (names, list) => {
        return names.reduce((sum, name) => {
            const field = list.find(f => f.name === name);
            return sum + Number(field?.value || 0);
        }, 0);
    };

    const basicSalary = sumFields(payrollGroups.basic, earningsFields);
    const fixedAllowances = sumFields(payrollGroups.allowances, earningsFields);
    const daHRA = sumFields(payrollGroups.daHRA, earningsFields);
    const specialAllowance = sumFields(payrollGroups.specialAllowance, earningsFields);
    const medicalAllowances = sumFields(payrollGroups.medicalAllowances, earningsFields);
    const conveyanceAllowance = sumFields(payrollGroups.conveyanceAllowance, earningsFields);
    const projectAllowances = sumFields(payrollGroups.projectAllowances, earningsFields);
    const lop = sumFields(payrollGroups.lop, deductionsFields);
    const tds = sumFields(payrollGroups.tds, deductionsFields);

    // 🔥 dynamic allowances
    const dynamicAllowances = Object.keys(extraFields)
        .filter(name => earningsFields.some(f => f.name === name))
        .reduce((sum, name) => sum + sumExtra(name), 0);

    // 🔥 dynamic deductions
    const dynamicDeductions = Object.keys(extraFields)
        .filter(name => deductionsFields.some(f => f.name === name))
        .reduce((sum, name) => sum + sumExtra(name), 0);

    const employerContribution = sumFields(payrollGroups.employerContribution, deductionsFields);
    const otherDeductions = sumFields(payrollGroups.deductions, deductionsFields);

    const totalEarnings = basicSalary + fixedAllowances + dynamicAllowances;
    const totalDeductions = employerContribution + otherDeductions + dynamicDeductions;

    const ctc = totalEarnings + employerContribution;




    const initializedRef = React.useRef(false);

    useEffect(() => {
        if (!content || initializedRef.current) return;

        const map = {};
        const all = [
            ...(content.section?.[0]?.earningfield?.[0]?.fields || []),
            ...(content.section?.[0]?.deductionsfield?.[0]?.fields || [])
        ];

        all.forEach(f => {
            if (f.type === "TextwithAdd") {
                map[f.name] = f.value?.length ? f.value : [];
            }
        });

        setExtraFields(map);
        initializedRef.current = true; // 🚀 prevent overwrite forever
    }, [content]);


    const buildPayrollPayload = () => {
        if (!content) return {};

        const payload = {};

        const section = content.section?.[0];

        // ===== Normal Fields (Earnings + Deductions) =====
        const allFields = [
            ...(section?.earningfield?.[0]?.fields || []),
            ...(section?.deductionsfield?.[0]?.fields || [])
        ];

        allFields.forEach(field => {
            if (field.type !== "TextwithAdd") {
                payload[field.name] = field.value ?? "0.00";
            }
        });

        // ===== Dynamic Rows (Other Allowance / Deduction) =====
        Object.keys(extraFields).forEach(fieldName => {
            payload[fieldName] = (extraFields[fieldName] || [])
                .filter(row => row.description || row.amount) // remove empty rows
                .map(row => ({
                    name: row.description || null,
                    attributeValue: row.amount || "0"
                }));
        });


        // ===== Extra Form Data =====
        payload.idEmployee = idEmployee?.value || "";
        payload.applicableFrom = applicableFrom;
        payload.currency = currency;
        payload.idSalary = idSalary;
        payload.isWithoutActualTax = isWithoutActualTax;

        return payload;
    };

    const submitformdata = async (value) => {

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        try {
            const response = await axiosJWT.post(`${apiUrl}/payroll/reCalculateTax`, value);
            if (response) {
                if (response.data.errorMessage) {
                    seterrorMessage(response.data.errorMessage)
                    window.scrollTo(0, 0);
                    return;
                }
                const responseData = response.data.data
                setPreviewData(prev => ({
                    ...prev,
                    ...responseData
                }));
                setContent(prev => mergeSalaryValues(prev, responseData));
            }
        } catch (error) {
            toast.error('Error connecting to the backend. Please try after Sometime.');
        }
    };
    const [draftErrors, setDraftErrors] = useState({});
    const validateDraftRows = (rows, fieldName) => {
        const errors = {};
        let isValid = true;

        rows.forEach((row, index) => {
            const rowErrors = {};

            // Description validation
            if (!row?.description || (row.description?.value === "" || row.description === "")) {
                rowErrors.description = "Description is required";
                isValid = false;
            }

            // Amount validation
            if (!row?.amount || Number(row.amount) <= 0) {
                rowErrors.amount = "Enter valid amount";
                isValid = false;
            }

            if (Object.keys(rowErrors).length > 0) {
                errors[index] = rowErrors;
            }
        });

        setDraftErrors(prev => ({
            ...prev,
            [fieldName]: errors
        }));

        return isValid;
    };

    const hasValidExtraFields = (fields) => {
        if (!fields) return false;

        return Object.values(fields).some(rows =>
            rows.some(row =>
                row &&
                row.description &&
                row.description.value &&   // selected option
                row.amount &&
                Number(row.amount) > 0
            )
        );
    };

    useEffect(() => {
        if (!hasValidExtraFields(extraFields)) return;
        const payload = buildPayrollPayload();
        submitformdata(payload)
    }, [extraFields]);
    const addRow = (name, type) => {
        if (type === "earnings") {
            setDraftEarnings(prev => ({
                ...prev,
                [name]: [...(prev[name] || []), { description: "", amount: "" }]
            }));
        } else {
            setDraftDeductions(prev => ({
                ...prev,
                [name]: [...(prev[name] || []), { description: "", amount: "" }]
            }));
        }
    };

    const updateDraft = (name, index, key, value, type) => {
        const setter = type === "earnings" ? setDraftEarnings : setDraftDeductions;

        // update value
        setter(prev => {
            const copy = [...(prev[name] || [])];
            copy[index] = { ...copy[index], [key]: value };
            return { ...prev, [name]: copy };
        });

        // 🔥 remove error for this field only
        setDraftErrors(prev => {
            if (!prev[name] || !prev[name][index]) return prev;

            const newErrors = { ...prev };

            if (newErrors[name][index]) {
                delete newErrors[name][index][key];

                // if row has no more errors → remove row error
                if (Object.keys(newErrors[name][index]).length === 0) {
                    delete newErrors[name][index];
                }

                // if field has no more row errors → remove field
                if (Object.keys(newErrors[name]).length === 0) {
                    delete newErrors[name];
                }
            }

            return newErrors;
        });
    };

    const saveEarnings = (name) => {

        const rows = draftEarnings[name] || [];

        if (!validateDraftRows(rows, name)) return;

        setExtraFields(prev => ({
            ...prev,
            [name]: [
                ...(prev[name] || []),
                ...rows
            ]
        }));

        setDraftEarnings(prev => ({ ...prev, [name]: [] }));
        setDraftErrors(prev => ({ ...prev, [name]: {} }));
    };


    const saveDeductions = (name) => {

        const rows = draftDeductions[name] || [];

        if (!validateDraftRows(rows, name)) return;

        setExtraFields(prev => ({
            ...prev,
            [name]: [
                ...(prev[name] || []),
                ...rows
            ]
        }));

        setDraftDeductions(prev => ({ ...prev, [name]: [] }));
        setDraftErrors(prev => ({ ...prev, [name]: {} }));
    };




    const removeRow = (name, index) => {
        setExtraFields(prev => ({
            ...prev,
            [name]: prev[name].filter((_, i) => i !== index)
        }));
    };
    const updateRow = (name, index, key, value) => {
        setExtraFields(prev => {
            const copy = [...prev[name]];
            copy[index][key] = value;
            return { ...prev, [name]: copy };
        });
    };
    const netPayable = totalEarnings - totalDeductions;

    const growthAmount = netPayable - previousMonthSalary;

    const growthPercent =
        previousMonthSalary > 0
            ? ((growthAmount / previousMonthSalary) * 100)
            : 0;

    const renderSavedAsField = (rows, label, name) => {
        if (!rows || rows.length === 0) return null;

        return rows.map((row, idx) => (
            <div className="col-md-6" key={`${name}-${idx}`}>
                <div className="earning-box saved-field b-g-h">

                    <div className="fw-semibold text-truncate">
                        {label} - {row?.description?.label || row?.description || "—"}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <span className="f-w-s">{formatMoney(row.amount)}</span>

                        <span
                            className="delete-saved"
                            onClick={() => deleteSavedRow(name, idx)}
                            data-tooltip-id="my-tooltip-tab" data-tooltip-content={"Delete"}
                        >
                            <IoIosClose />
                        </span>
                    </div>

                </div>
            </div>
        ));
    };

    const deleteSavedRow = (name, index) => {
        setExtraFields(prev => ({
            ...prev,
            [name]: prev[name].filter((_, i) => i !== index)
        }));
        const payload = buildPayrollPayload();
        submitformdata(payload)
    };

    const removeDraftRow = (name, index, type) => {
        const setter = type === "earnings" ? setDraftEarnings : setDraftDeductions;

        setter(prev => ({
            ...prev,
            [name]: prev[name].filter((_, i) => i !== index)
        }));
    };
    const [isModalOpen, SetIsModalOpen] = useState(false);
    const openPreviewpopup = async () => {
        SetIsModalOpen(true)
    }
    const closepopup = async () => {
        SetIsModalOpen(false)
    }

    const [openTdsDrawer, setOpenTdsDrawer] = useState(false);
    const [tdsValue, setTdsValue] = useState("");
    const [tdsReason, setTdsReason] = useState("");

    const EditRowField = (fieldName) => {
        if (fieldName !== "tds") return;

        const tdsField = deductionsFields.find(f => f.name === "tds");

        setTdsValue(tdsField?.value || "");
        setTdsReason(previewData?.tdsOverrideReason || "");
        setOpenTdsDrawer(true);
    };

    const submitTdsOverride = (value, reason) => {
        const numericValue = Number(value || 0);
        // update dynamic form value
        setContent(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            const fields = clone.section?.[0]?.deductionsfield?.[0]?.fields || [];

            const tdsField = fields.find(f => f.name === "tds");
            if (tdsField) {
                tdsField.value = Number(value || 0);
            }

            return clone;
        });

        // update preview data
        setPreviewData(prev => ({
            ...prev,
            tdsOverrideReason: reason,
            tds: Number(value || 0)
        }));

        setTdsValue(value);
        setTdsReason(reason);
        setOpenTdsDrawer(false);
        setTimeout(() => {
            const payload = buildPayrollPayload();
            payload.tdsReason = reason;
            payload.isWithoutActualTax = true;
            payload.tds = numericValue;
            submitformdata(payload);
        }, 0);
    };

    const handleButtonAction = (action) => {
        switch (action) {

            case "cancel":
                handleCancel();
                break;

            case "draft":
                handleSaveDraft();
                break;

            case "submit":
                handleSubmitPayroll();
                break;

            default:
                console.warn("Unknown action:", action);
        }
    };

    const handleCancel = () => {
        router.back();
    };
    const handleSaveDraft = async () => {
        const payload = buildPayrollPayload();
        payload.tdsReason = tdsReason;
        payload.status = "draft";

        try {
            const response = await axiosJWT.post(`${apiUrl}/payroll/generateSalaryDetails`, payload);
            if (response.status === 200) {
                ToastNotification({ message: response.data.message });
                router.push('/payrollManagement');
            }
        } catch (err) {
            alert("Error saving draft");
        }
    };
    const handleSubmitPayroll = async () => {
        const payload = buildPayrollPayload();
        payload.tdsReason = tdsReason;
        payload.status = "submit";

        try {
            const response = await axiosJWT.post(`${apiUrl}/payroll/generateSalaryDetails`, payload);
            if (response.status === 200) {
                ToastNotification({ message: response.data.message });
                router.push('/payrollManagement');
            }
        } catch (err) {
            alert("Error saving payroll");
        }
    };

    return (
        <div className="payroll-wrapper">
            <EditPopup openTdsDrawer={openTdsDrawer} setOpenTdsDrawer={setOpenTdsDrawer} tdsValue={tdsValue} tdsReason={tdsReason} onSubmit={submitTdsOverride} />
            <PreviewPopupComponent isOpen={isModalOpen} closeModal={closepopup} previewData={previewData} idEmployee={idEmployee} applicableFrom={applicableFrom} />
            <div className="row g-4">
                <div className="col-xl-8">
                    <div className="card main-card border-0 shadow-sm">
                        {errorMessage !== "" ? (<div className="row p-4 pb-0"><div className="alert alert-danger alert-dismissible fade show mb-0" role="alert">{errorMessage}  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></div></div>) : (null)}
                        <div className="row p-4 top-field-i">
                            <div className="col-md-6 top-field-add">
                                <Employee onChange={onChange} documentType={"permanent"} showImage="yes" label="Name" selectedAsset={idEmployee?.value} />
                            </div>
                            <div className="col-md-6 top-field-add">
                                <MounthPicker onChange={onMonthChange} label="Applicable Month/Year" value={applicableFrom} />
                            </div>
                        </div>
                        {idEmployee && (
                            <div className="employee-bar d-flex align-items-center gap-3 mx-4 mb-4">
                                <Profile name={idEmployee?.label} imageurl={idEmployee?.image} size={35} profilelink={idEmployee?.profileLink} />
                                <div>
                                    <div className="fw-semibold text-capitalize">{idEmployee?.label}</div>
                                    <div className="text-muted small">{idEmployee?.designation}</div>
                                </div>
                            </div>
                        )}
                        <div className="p-4 pt-0">
                            <h5 className="section-title-p">
                                {content?.section?.[0]?.earningfield?.[0]?.sectionHeading}
                            </h5>

                            <div className="row g-3">
                                {earningsFields.map((field, i) => {
                                    if (field.type === "TextwithAdd") {
                                        return (
                                            <div className="col-12" key={i}>
                                                {/* LABEL */}
                                                <div className="fw-semibold mb-3 d-flex align-items-center gap-2">
                                                    {field.label}
                                                    <span
                                                        className="btn add_icon_with_input"
                                                        onClick={() => addRow(field.name, "earnings")}
                                                    >
                                                        + Add More
                                                    </span>
                                                </div>
                                                {(draftEarnings[field.name] || []).map((row, idx) => (
                                                    <div className="row g-2 mt-2 mb-2" key={`draft-${idx}`}>
                                                        <div className="col-md-8 top-field-add">
                                                            <SelectOption
                                                                label="Description"
                                                                documentType="other_allowances"
                                                                value={row.description}
                                                                onChange={(option) =>
                                                                    updateDraft(field.name, idx, "description", option, "earnings")
                                                                }
                                                            />
                                                            {draftErrors[field.name]?.[idx]?.description && (
                                                                <small className="text-danger">
                                                                    {draftErrors[field.name][idx].description}
                                                                </small>
                                                            )}
                                                        </div>

                                                        <div className="col-md-4 top-field-add ">
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'auto 25px', alignItems: 'center' }}>
                                                                <NumberField
                                                                    label="Amount"
                                                                    otherAttributes={""}
                                                                    value={row.amount}
                                                                    onChange={(value) =>
                                                                        updateDraft(field.name, idx, "amount", value, "earnings")
                                                                    }
                                                                />
                                                                {(draftEarnings[field.name]?.length || 0) > 0 && (
                                                                    <div className="lign-items-center add_payroll_icon">
                                                                        <span
                                                                            className="del-icon ms-2"
                                                                            onClick={() => removeDraftRow(field.name, idx, "earnings")}
                                                                        >
                                                                            <RiDeleteBinLine />
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {draftErrors[field.name]?.[idx]?.amount && (
                                                                <small className="text-danger">
                                                                    {draftErrors[field.name][idx].amount}
                                                                </small>
                                                            )}
                                                        </div>

                                                    </div>
                                                ))}

                                                {(draftEarnings[field.name]?.length || 0) > 0 && (
                                                    <div className="text-end mt-2 mb-3">
                                                        <button className="btn btn-primary" onClick={() => saveEarnings(field.name)}>
                                                            Save Allowances
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="row g-3">
                                                    {renderSavedAsField(extraFields[field.name], field.label, field.name)}
                                                </div>

                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="col-md-6" key={i}>
                                            <div className="earning-box">
                                                <div className="fw-semibold">{field.label}</div>
                                                <span className="f-w-s">{formatMoney(field.value)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="p-4 pt-0">
                            <h5 className="section-title-p">
                                {content?.section?.[0]?.deductionsfield?.[0]?.sectionHeading}
                            </h5>

                            <div className="row g-3">
                                {deductionsFields.map((field, i) => {

                                    // ===== TEXT WITH ADD (OTHER DEDUCTION) =====
                                    if (field.type === "TextwithAdd") {
                                        return (
                                            <div className="col-12" key={i}>
                                                <div className="fw-semibold mb-3 d-flex align-items-center gap-2">
                                                    {field.label}
                                                    <span
                                                        className="btn add_icon_with_input"
                                                        onClick={() => addRow(field.name, "deductions")}
                                                    >
                                                        + Add More
                                                    </span>
                                                </div>
                                                {(draftDeductions[field.name] || []).map((row, idx) => (
                                                    <div className="row g-2 mt-2 mb-2" key={idx}>
                                                        <div className="col-md-8 top-field-add">
                                                            <TextField
                                                                label="Description"
                                                                value={row.description}
                                                                onChange={(value) =>
                                                                    updateDraft(field.name, idx, "description", value, "deductions")
                                                                }
                                                            />
                                                            {draftErrors[field.name]?.[idx]?.description && (
                                                                <small className="text-danger">
                                                                    {draftErrors[field.name][idx].description}
                                                                </small>
                                                            )}
                                                        </div>

                                                        <div className="col-md-4 top-field-add">
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'auto 25px', alignItems: 'center' }}>
                                                                <NumberField
                                                                    label="Amount"
                                                                    otherAttributes={""}
                                                                    value={row.amount}
                                                                    onChange={(value) =>
                                                                        updateDraft(field.name, idx, "amount", value, "deductions")
                                                                    }
                                                                />
                                                                {(draftDeductions[field.name]?.length || 0) > 0 && (
                                                                    <div className="add_payroll_icon">
                                                                        <span
                                                                            className="del-icon ms-2"
                                                                            onClick={() => removeDraftRow(field.name, idx, "deductions")}
                                                                        >
                                                                            <RiDeleteBinLine />
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {draftErrors[field.name]?.[idx]?.amount && (
                                                                <small className="text-danger">
                                                                    {draftErrors[field.name][idx].amount}
                                                                </small>
                                                            )}

                                                        </div>
                                                    </div>
                                                ))}
                                                {(draftDeductions[field.name]?.length || 0) > 0 && (
                                                    <div className="text-end mt-2 mb-3">
                                                        <button className="btn btn-primary" onClick={() => saveDeductions(field.name)}>
                                                            Save Deductions
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="row g-3">
                                                    {renderSavedAsField(extraFields[field.name], field.label, field.name)}
                                                </div>

                                            </div>
                                        );

                                    }
                                    if (field.type === "edit") {
                                        return (
                                            <div className="col-md-6" key={i}>
                                                <div className="earning-box">
                                                    <div className="fw-semibold">
                                                        {field.label}
                                                        {field.required && <span className="text-danger ms-1">*</span>}
                                                    </div>
                                                    <span className="f-w-s">{formatMoney(field.value)}</span>
                                                    {showData && (
                                                        <span
                                                            className="edit-saved"
                                                            onClick={() => EditRowField(field.name)}
                                                            data-tooltip-id="my-tooltip-tab" data-tooltip-content={"Edit TDS"}
                                                        >
                                                            Override
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );

                                    }

                                    // ===== NORMAL FIELD =====
                                    return (
                                        <div className="col-md-6" key={i}>
                                            <div className="earning-box">
                                                <div className="fw-semibold">
                                                    {field.label}
                                                    {field.required && <span className="text-danger ms-1">*</span>}
                                                </div>
                                                <span className="f-w-s">{formatMoney(field.value)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                        {showData && (
                            <div className="footer-actions mt-3 mb-3 px-4">
                                {buttons.map((btn, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`${btn.class} px-4`}
                                        onClick={() => handleButtonAction(btn.action)}
                                    >
                                        {btn.label}
                                    </button>
                                ))}

                            </div>
                        )}
                    </div>
                </div>
                <div className="col-xl-4 ">
                    <div className="card payroll-card border-0 shadow-sm p-0 overflow-hidden mb-4">
                        <div className="net-title">NET PAYABLE
                            {showData && (
                                <button className="btn btn-success preview-btn" onClick={openPreviewpopup}>
                                    <FaMoneyBillWave /> Preview Payslip
                                </button>
                            )}
                        </div>

                        <div className="p-4 pt-0">

                            <div className="net-amount">
                                {formatMoney(netPayable)}
                            </div>

                            <div className={`net-growth ${growthAmount >= 0 ? "text-success" : "text-danger"}`}>
                                {growthAmount >= 0 ? "↑" : "↓"} {formatMoney(Math.abs(growthAmount))}
                                ({growthPercent.toFixed(1)}%)

                                <span className="text-muted ms-2">
                                    vs Last Month
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card payroll-card border-0 shadow-sm p-0 overflow-hidden mb-4">
                        <div className="attendance-title">
                            <span className="calendar-icon">📅</span>
                            {formatMonthYear(applicableFrom)} Attendance
                        </div>

                        <div className="row text-center pb-4 pt-2 g-3">
                            <div className="col-6">
                                <div className="att-number">{attendanceInfo?.totalWorkingDays || 0}</div>
                                <div className="att-label">Working Days</div>
                            </div>

                            <div className="col-6">
                                <div className="att-number">{attendanceInfo?.lop || 0}</div>
                                <div className="att-label">Loss Of Pay</div>
                            </div>

                            <div className="col-6">
                                <div className="att-number">{attendanceInfo?.remainingLopsOfLastMonth || 0}</div>
                                <div className="att-label">Lop Of Last Month</div>
                            </div>

                            <div className="col-6">
                                <div className="att-number">{attendanceInfo?.leaves || 0}</div>
                                <div className="att-label">Leaves</div>
                            </div>
                        </div>

                    </div>

                    <div className="card summary-card border-0 shadow-sm p-0 overflow-hidden">
                        <div className="summary-header">Advanced Payroll Summary</div>

                        <div className="summary-body">

                            {/* Earnings */}
                            <div className="row-line">
                                <span>Earnings</span>
                                <strong>{formatMoney(totalEarnings)}</strong>
                            </div>

                            <div className="sub-line">
                                <span>Basic Salary</span>
                                <span>{formatMoney(basicSalary)}</span>
                            </div>
                            <div className="sub-line">
                                <span>HRA + DA</span>
                                <span>{formatMoney(daHRA)}</span>
                            </div>
                            <div className="sub-line">
                                <span>Medical Allowances</span>
                                <span>{formatMoney(medicalAllowances)}</span>
                            </div>
                            <div className="sub-line">
                                <span>Special Allowance</span>
                                <span>{formatMoney(specialAllowance)}</span>
                            </div>
                            <div className="sub-line">
                                <span>Conveyance Allowance</span>
                                <span>{formatMoney(conveyanceAllowance)}</span>
                            </div>
                            <div className="sub-line">
                                <span>Project Allowances</span>
                                <span>{formatMoney(projectAllowances)}</span>
                            </div>

                            <div className="sub-line">
                                <span>Other Allowances</span>
                                <span>{formatMoney(dynamicAllowances)}</span>
                            </div>

                            <hr />

                            {/* Deductions */}
                            <div className="row-line success">
                                <span>Deductions</span>
                                <strong>{formatMoney(totalDeductions)}</strong>
                            </div>

                            <div className="highlight-row">
                                <span>Employer Contribution</span>
                                <span>{formatMoney(employerContribution)}</span>
                            </div>

                            <div className="sub-line">
                                <span>TDS</span>
                                <span>{formatMoney(tds)}</span>
                            </div>

                            <div className="sub-line">
                                <span>ESI</span>
                                <span>{formatMoney(sumFields(["esi"], deductionsFields))}</span>
                            </div>

                            <div className="sub-line">
                                <span>Provident Fund</span>
                                <span>{formatMoney(sumFields(["providentFund"], deductionsFields))}</span>
                            </div>

                            <div className="sub-line">
                                <span>Loss Of Pay</span>
                                <span>{formatMoney(lop)}</span>
                            </div>

                            <div className="sub-line total-ded">
                                <span>Total Deductions</span>
                                <span>{formatMoney(totalDeductions)}</span>
                            </div>

                            {/* CTC */}
                            <div className="ctc-row">
                                <span>Net Payable</span>
                                <strong className="ctc-amount">{formatMoney(netPayable)}</strong>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .payroll-wrapper{background:#f4f6fb;min-height:100vh}
        .main-card{border-radius:.375rem}
        .b-g-h{background:#f9f9f9 !important;}
        .employee-bar{background:#eef2ff;padding:16px 20px;border-top:1px solid #e6e9f5;border-radius:.375rem}
        .emp-avatar{width:52px;height:52px;border-radius:50%;object-fit:cover}
        .approved-pill{background:#e6f6ed;color:#1f9d55;padding:6px 14px;border-radius:999px;font-weight:500}
        .section-title-p{font-weight:700;margin-bottom:14px;font-size:.95rem}
        .earning-box{position:relative;background:#fff;border:1px solid #e8ecf5;border-radius:.375rem;padding:16px;display:flex;justify-content:space-between;align-items:center;transition:.2s}
        span.delete-saved {color: red;position: absolute;top:-6px;right: 0px;cursor: pointer;font-size: 1.25rem;}
        span.edit-saved {background: #d2352a;color: #fff;position: absolute;top: -12px;right: 7px;cursor: pointer;padding: 4px 8px;border-radius: 15px;width: 68px;font-size: var(--theme-small-text60);text-align: center;}
        .earning-box:hover{box-shadow:0 8px 18px rgba(217, 186, 186, 0.06);background: #f2f2f3;}
        .amount{font-weight:700;color:#243145}
        .footer-actions{display:flex;gap:12px;justify-content:flex-end}
        .summary-card{border-radius:.375rem;background:#fff}
        .summary-header{padding:10px 15px;font-weight:700;border-bottom:1px solid #eef1f6;font-size:.95rem}
        .summary-body{padding:18px}
        .row-line{display:flex;justify-content:space-between;margin-bottom:8px;color:#344054,font-size:.75rem}
        .row-line.success{color:#1f9d55}
        .sub-line{display:flex;justify-content:space-between;color:#667085;font-size:.75rem;padding:6px 0}
        .highlight-row{background:#f2f4f7;padding:8px 10px;border-radius:8px;display:flex;justify-content:space-between;margin:8px 0;font-weight:500}
        .total-ded{border-top:1px dashed #e5e7eb;margin-top:6px;padding-top:8px;font-weight:600}
        .ctc-row{display:flex;justify-content:space-between;margin-top:12px;font-weight:600}
        .ctc-amount{color:#1f9d55;font-size:18px}
        .ctc-breakdown{background:#f9fafb;border:1px solid #eef1f6;border-radius:12px;padding:12px}
        .ctc-title{font-weight:700;margin-bottom:6px}
        .preview-btn{background:#1f7a4d;border:none;font-weight:600}
        .lock-btn{font-weight:600}
        .history-btn{border-radius:10px}
        .top-field-add{position: relative;}
        .payroll-card{border-radius: .375rem;background: #fff;}
        .net-title{padding: 10px 15px;font-weight: 700;border-bottom: 1px solid #eef1f6;font-size: .95rem;align-items: center;display: flex;justify-content: space-between;}
        .net-amount{font-size:1.75rem;font-weight:700;color:#18a873;margin-top:6px;}
        .net-growth{font-weight:500;color:#18a873;margin-top:6px;}
        .attendance-title{padding: 10px 15px;font-weight: 700;border-bottom: 1px solid #eef1f6;font-size: .95rem;}
        .calendar-icon{font-size:1.25rem;margin-right:5px}
        .att-number{font-size:1.5rem;font-weight:700;color:#5b6ee1;}
        .att-label{color:#6b7280;font-weight:500;}
        span.add_icon_with_input:hover{background: #045db1;color: var(--theme-white-color);}
        .f-w-s{font-size:.8rem;}
        .custom-drawer-w {width: 750px !important;}
        span.add_icon_with_input{width:85px}
        .top-field-i label, .top-field-add label{position: absolute;top:-12px;z-index: 9;background: #fff;padding: 2px 8px;font-size: .7rem;left: 17px;}
      `}</style>
            <Tooltip id="my-tooltip-tab" style={{ zIndex: 99999 }} />
        </div>
    );
}

