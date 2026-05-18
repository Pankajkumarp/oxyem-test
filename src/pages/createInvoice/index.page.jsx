import React, { useState, useEffect } from 'react';
import Breadcrumbs from "../Components/Breadcrumbs/Breadcrumbsdiscription";
import { axiosJWT } from '../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import { FaTimes } from "react-icons/fa";
import currencySymbolMap from 'currency-symbol-map';
import pageTitles from '../../common/pageTitles.js';
import { FaRegCheckCircle } from "react-icons/fa";
import FormRenderer from "../Components/FormRender/TemplateTwo/FormRenderer";
import { format } from "date-fns";
export default function opportunity() {
    const formatDate = (dateStr) => {
                if (!dateStr) return "";
                const d = new Date(dateStr);
                return isNaN(d) ? "" : format(d, "dd MMM yyyy");
            };
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [Customerinfodata, setCustomerInfo] = useState([]);
    const [invoiceData, setInvoiceData] = useState({});
    const [InvoiceAllData, setInvoiceAllData] = useState({});
    const [idInvoice, setIdInvoice] = useState("");
    const [idInvoiceNo, setIdInvoiceNo] = useState("");
    const [invoice_entity, setInvoice_entity] = useState("");
    const [currencySymbol, setCurrencySymbol] = useState("");
    const [dataStatus, setDataStatus] = useState("");
    const [mappedInvoiceEntitys, setmappedInvoiceEntity] = useState([]);
    const submitHalfForm = async (value, tabName) => {
        const inputData = value
        const transformedData = {
            invoice_entity: typeof inputData.invoice_entity === 'object' && inputData.invoice_entity !== null
                ? inputData.invoice_entity.value
                : inputData.invoice_entity,
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
            invoiceDueDate: inputData.invoiceDueDate,
            invoiceNumber: inputData.invoiceNumber
        };
        const invoiceData = {
            invoice_entity: typeof inputData.invoice_entity === 'object' && inputData.invoice_entity !== null
                ? inputData.invoice_entity.label
                : inputData.invoice_entity,
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
            invoiceDueDate: inputData.invoiceDueDate,
            invoiceNumber: inputData.invoiceNumber
        };
        setCurrencySymbol(transformedData.currencyType)
        setInvoiceData(invoiceData)
        setCustomerInfo(transformedData)
        const payload = {
            status: "draft",
            sectionName: tabName,
            idInvoice: idInvoice,
            invoiceNumber: idInvoiceNo,
            currencyName: transformedData.currencyType,
            taxpercent: value?.taxValue,
            customerinfodata: transformedData,
            lineItemsData: value?.lineItemsData,
            invoicePreview: {
                invoiceData: invoiceData,
                tableData: {
                    inlineItemsData: value?.lineItemsData,
                    totaltaxdata: {
                        totalAmount: value?.totalAmount,
                        untaxedAmount: value?.untaxedAmount,
                        tax: value?.taxValue
                    }
                },
                invoice_entityName: invoice_entity,
                mappedInvoiceEntity: mappedInvoiceEntitys,
                idInvoice: idInvoice,
                invoiceNumber: idInvoiceNo
            }
        }
        const response = await axiosJWT.post(`${apiUrl}/opportunity/generateInvoice`, payload);
        if (response) {
            setDataStatus("draft")
            setInvoiceAllData({
                invoiceData,
                tableData: {
                    inlineItemsData: value?.lineItemsData || [],
                    totaltaxdata: {
                        totalAmount: Number(value?.totalAmount ?? 0),
                        untaxedAmount: Number(value?.untaxedAmount ?? 0),
                        tax: Number(value?.taxValue ?? 0)
                    }
                },
                idInvoice: response?.data?.data?.idInvoice,
                invoiceNumber: response?.data?.data?.invoiceNumber,
                invoice_entityName: response?.data?.data?.invoice_entity,
                mappedInvoiceEntity: response?.data?.data?.mappedInvoiceEntity
            });
            setmappedInvoiceEntity(response?.data?.data?.mappedInvoiceEntity)
            setIdInvoice(response.data.data.idInvoice)
            setIdInvoiceNo(response.data.data.invoiceNumber)
            setInvoice_entity(response.data.data.invoice_entity)

        }
    };
    const [SubmitLoading, setSubmitLoading] = useState(false);
    const handeSubmit = async (value, tabName) => {
        setSubmitLoading(true)
        const payload = {
            status: "generated",
            sectionName: tabName,
            idInvoice: idInvoice,
            invoiceNumber: idInvoiceNo,
            currencyName: currencySymbol,
            taxpercent: value?.taxValue,
            customerinfodata: Customerinfodata,
            lineItemsData: value?.lineItemsData,
            lineItemsData: value?.lineItemsData,
            template: typeof value.template === 'object' && value.template !== null
                ? value.template.value
                : value.template,
            invoicePreview: {
                invoiceData: invoiceData,
                tableData: {
                    inlineItemsData: value?.lineItemsData,
                    totaltaxdata: {
                        totalAmount: value?.totalAmount,
                        untaxedAmount: value?.untaxedAmount,
                        tax: value?.taxValue
                    }
                },
                invoice_entityName: invoice_entity,
                mappedInvoiceEntity: mappedInvoiceEntitys,
                idInvoice: idInvoice,
                invoiceNumber: idInvoiceNo
            }
        }

        try {
            const response = await axiosJWT.post(`${apiUrl}/opportunity/generateInvoice`, payload);
            if (response) {
                setDataStatus("generated")
                setSubmitLoading(false)
                const message = 'Your <strong>invoice have been generated successfully.</strong>';
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
        } catch (error) {
            setSubmitLoading(false)
        }
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
    const [content, setContent] = useState([]);
    const [formShow, setFormShow] = useState(false);
    useEffect(() => {
        fetchForm();
    }, []);
    const fetchForm = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, {
                params: { formType: "createInvoice" },
            });

            if (response.status === 200 && response.data.data) {
                setContent(response.data.data);
                setFormShow(true)
            }
        } catch (error) {
        }
    };
    const handleCancelClick = async () => {
        router.push(`/createInvoice/view`);
    };
    const [sideBarData, setSideBarData] = useState({});
    const getAllData = async (data) => {
        setSideBarData(data)
    };
    const currency = sideBarData?.currencyType?.label || "";
    const items = sideBarData?.lineItemsData || [];
    const formatMoney = (value) => {
        const formatted = Number(value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const symbol = currency ? currencySymbolMap(currency) : "";
        return symbol ? `${symbol} ${formatted}` : formatted;
    };
    return (
        <>
            <Head>
                <title>{pageTitles.CreateInvoice}</title>
                <meta name="description" content={"Create Invoice"} />
            </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Create Invoice"} discription={"Enter billing and customer details, add line items, and review the invoice before submitting."} />
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-8 form-template-two h-100">

                                            {formShow ? (
                                                <FormRenderer schema={content} sumbitStart={SubmitLoading} handleCancelClick={handleCancelClick} getAllData={getAllData} submitHalfForm={submitHalfForm} InvoiceAllData={InvoiceAllData} handeSubmit={handeSubmit} />
                                            ) : (null)}


                                        </div>
                                        <div className="col-lg-4">
                                            <div className="invoice-card-in h-100">
                                                <div className="invoice-header">
                                                    <div className="invoice-logo"><span className='icon-in'>📈</span> INVOICE</div>
                                                    <div className='d-flex align-items-center'>
                                                        <span className={`oxyem-mark-${dataStatus}`}>{dataStatus}</span>
                                                    </div>
                                                </div>

                                                <hr />

                                                {/* Parties */}
                                                <div className="invoice-parties">
                                                    {sideBarData?.invoice_entity?.label && (
                                                        <div>
                                                            <p className="label">Bill From</p>
                                                            <p className="value">
                                                                {sideBarData?.invoice_entity?.label}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        {sideBarData?.customerName?.label && (
                                                            <>
                                                                <p className="label">Bill To</p>
                                                                <p className="value bold">
                                                                    {sideBarData?.customerName?.label}
                                                                </p>
                                                            </>
                                                        )}
                                                        {sideBarData?.BTP?.label && (
                                                            <p className="muted">
                                                                {sideBarData?.BTP?.label}
                                                            </p>
                                                        )}
                                                        {sideBarData?.purchaseNumber && (
                                                            <>
                                                                <p className="label">Purchase Number</p>
                                                                <p className="value bold">
                                                                    {sideBarData?.purchaseNumber}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Dates */}
                                                <div className="invoice-dates">
                                                    {sideBarData?.invoiceStartDate && (
                                                        <div>
                                                            <p className="label">Invoice Date</p>
                                                            <p className="value">
                                                                {formatDate(sideBarData?.invoiceStartDate)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {sideBarData?.invoiceEndDate && (
                                                        <div>
                                                            <p className="label">Due Date</p>
                                                            <p className="value">
                                                                {formatDate(sideBarData?.invoiceEndDate)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {items && items.length > 0 && (
                                                    <table className="invoice-table">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ minWidth: '55px' }}>Sr No</th>
                                                                <th>Description</th>
                                                                <th style={{minWidth:'100px'}}>Total</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {items && items.length > 0 ? (
                                                                items.map((item, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{item.description}</td>
                                                                        <td>{formatMoney(item.totalAmount)}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={3} style={{ textAlign: "center", padding: "20px" }}>
                                                                        No items found
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>

                                                    </table>
                                                )}
                                                {items && items.length > 0 && (
                                                    <div className="invoice-summary">
                                                        <div className="row">
                                                            <span>Untaxed Amount : {formatMoney(sideBarData?.untaxedAmount)}</span>
                                                        </div>
                                                        <div className="row">
                                                            <span>Tax % : {sideBarData?.taxValue || 0}</span>
                                                        </div>

                                                        <div className="row total">
                                                            <span>Total: {formatMoney(sideBarData?.totalAmount)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {sideBarData?.invoiceDueDate && (
                                                    <div className="invoice-footer">
                                                        <div className="due-pill">
                                                            ⚠ Payment Due: {formatDate(sideBarData?.invoiceDueDate)}
                                                        </div>
                                                    </div>
                                                )}
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