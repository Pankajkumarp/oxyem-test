import React from 'react'
import currencySymbolMap from 'currency-symbol-map';
import numberToWords from 'number-to-words';
import { format } from "date-fns";

export default function TemplateThreeInvoice({ InvoiceAllData }: any) {
    if (!InvoiceAllData || Object.keys(InvoiceAllData).length === 0) {
        return null;
    }
            const [country, setCountry] = React.useState<string | null>(null);
        
            React.useEffect(() => {
                const getCountry = async () => {
                    try {
                        const res = await fetch("https://ipapi.co/json/");
                        const data = await res.json();
                        setCountry(data.country_name);
                    } catch (err) {
                        console.error("Country fetch failed", err);
                    }
                };
        
                getCountry();
            }, []);
    const entity = InvoiceAllData?.invoice_entityName;
    const customerName = InvoiceAllData?.invoiceData?.customerName;
    const BTP = InvoiceAllData?.invoiceData?.BTP;
    const STP = InvoiceAllData?.invoiceData?.STP;
    const purchaseNumber = InvoiceAllData?.invoiceData?.purchaseNumber;
    const invoiceStartDate = InvoiceAllData?.invoiceData?.invoiceStartDate;
    const invoiceEndDate = InvoiceAllData?.invoiceData?.invoiceEndDate;
    const invoiceMonth = InvoiceAllData?.invoiceData?.invoiceMonth;
    const currencySymbol = InvoiceAllData?.invoiceData?.currencyType;
    const invoiceNumber = InvoiceAllData?.invoiceNumber;
    const invoiceDueDate = InvoiceAllData?.invoiceData?.invoiceDueDate;

    const convertNumberToWords = (number) => {
        return numberToWords.toWords(number);
    };
    const symbol = currencySymbolMap(currencySymbol);
    const formatDate = (dateStr: string | Date) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d.getTime())
            ? ""
            : format(d, "dd MMM yyyy");
    };
    const formatMDate = (dateStr: string | Date) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d.getTime())
            ? ""
            : format(d, "MMM yyyy");
    };
    const formatDayDate = (dateStr: string | Date) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d.getTime())
            ? ""
            : format(d, "dd MMM");
    };
    return (
        <>
            <div className="container my-5 invoice-wrapper-three">

                <div className="card shadow-three p-4">

                    {/* Header */}
                    <div className="row border-bottom pb-4">
                        <div className="col-md-7">
                            <div className="template_two_logo_section px-0">
                                <h1 className='invoice_logo'><span>O</span>XYTAL</h1>
                                <p className='invoice_logo_bottom'>Trusted Digital Partner</p>
                            </div>

                            <div className="text-muted  mt-3">
                                <div
                                    dangerouslySetInnerHTML={{ __html: entity }}
                                />
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <h6 className="fw-bold">Ship To</h6>
                                    <p className="mb-1">
                                        {customerName}
                                    </p>
                                    <p>
                                        {STP}
                                    </p>
                                </div>

                                <div className="col-md-6">
                                    <h6 className="fw-bold">Bill To</h6>
                                    <p className="mb-1">
                                        {customerName}
                                    </p>
                                    <p>
                                        {BTP}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5 ps-1 text-md-end">
                            <h2 className="fw-semibold mb-3">Invoice</h2>

                            <div className="invoice-summary p-3 px-0 d-inline-block text-start">
                                <h6 className="fw-bold top-head-invo">Invoice Summary</h6>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Service Period:</span>
                                    <span>{formatDayDate(invoiceStartDate)} To {formatDate(invoiceEndDate)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Invoice Number:</span>
                                    <span>{invoiceNumber}</span>
                                </div>
                                {purchaseNumber ? (
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Purchase Number:</span>
                                        <span>{purchaseNumber}</span>
                                    </div>) : null}
                                {country?.toLowerCase() === "india" && (<div className="d-flex justify-content-between mb-3">
                                    <span> HSN/SAC:</span>
                                    <span>9983</span>
                                </div>)}
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Invoice Month:</span>
                                    <span>{formatMDate(invoiceMonth)}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Invoice Date:</span>
                                    <span>{formatDate(invoiceStartDate)}</span>
                                </div>

                                <div className="highlight-total p-2 mt-3">
                                    <div className='d-flex justify-content-between'>
                                        <strong>Total Amount</strong>
                                        <strong>{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.totalAmount}</strong>
                                    </div>
                                    {invoiceDueDate ? (
                                        <div className='h-i fw-bold'>Due on {formatDate(invoiceDueDate)}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}

                    {/* Description */}
                    <div className="mt-4">
                        <h6 className="fw-bold">
                            Charges for services rendered on {formatDate(invoiceStartDate)}
                        </h6>

                        <p className="small text-muted">
                            Including subscriptions, renewals, recurring services, and consultancy fees.
                        </p>
                    </div>
                    <div className="mt-1">
                        <div className="table-header px-2 py-2 fw-bold">
                            Item List
                        </div>
                    </div>
                    <table className="table table-sm mb-0 w-100">
                        <thead>
                            <tr className="bg-light">
                                <td className="col-1 text-left py-2 ps-3">
                                    <strong>Item No.</strong>
                                </td>
                                <td className="col-6 py-2 ps-3">
                                    <strong>Description</strong>
                                </td>
                                <td className="col-1 py-2 ps-3 text-center">
                                    <strong>Amount</strong>
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            {InvoiceAllData?.tableData?.inlineItemsData?.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-left py-2 ps-3">{index + 1}</td>
                                    <td className="py-2 ps-3">{item.description}</td>
                                    <td className="text-end py-2 ps-3 pe-3">{symbol} {item.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Billing Table */}
                    <div className="mt-4">
                        <div className="table-header px-2 py-2 fw-bold">
                            Billing Summary
                        </div>

                        <table className="table table-bordered mb-0">
                            <tbody>
                                <tr>
                                    <td>Subtotal</td>
                                    <td className="text-end">{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.untaxedAmount}</td>
                                </tr>

                                <tr>
                                    <td>Tax</td>
                                    <td className="text-end">{InvoiceAllData?.tableData?.totaltaxdata?.tax}%</td>
                                </tr>

                                <tr className="total-row fw-bold">
                                    <td>Total (including Tax)</td>
                                    <td className="text-end">{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.totalAmount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="small mt-4">
                        <div className="fw-bold mb-2">Declaration:</div>
                        <ul className='px-2 text-muted'>
                            <li className='mb-1'>We declare that this invoice shows the actual price of the services described and that particulars are true & correct.</li>
                            <li>This is a system-generated document. No signature is required.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </>
    )
}
