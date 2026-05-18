import React from 'react'
import currencySymbolMap from 'currency-symbol-map';
import numberToWords from 'number-to-words';
import { format } from "date-fns";

export default function TemplateFourInvoice({ InvoiceAllData }: any) {
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
    const mappedInvoiceEntity = InvoiceAllData?.mappedInvoiceEntity;

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
            <div className="container my-5 invoice2-wrapper">
                <div className="card shadow-three p-4">

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start border-bottom pb-3">
                        <div className="template_two_logo_section px-0">
                            <h1 className='invoice_logo'><span>O</span>XYTAL</h1>
                            <p className='invoice_logo_bottom'>Trusted Digital Partner</p>
                        </div>

                        <div className="text-end">
                            <h2 className="fw-semibold">INVOICE</h2>

                            <div className="mb-1">
                                <div
                                    dangerouslySetInnerHTML={{ __html: entity }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bill + Meta */}
                    <div className="row mt-4">
                        <div className="col-md-7 ">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="text-muted">BILL TO</h6>
                                    <p className='mb-1'>{customerName}</p>
                                    <p>{BTP}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-muted">SHIP TO</h6>
                                    <p className='mb-1'>{customerName}</p>
                                    <p>{STP}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5 text-md-end ps-0">
                            <p className='mb-2'><strong>Service Period:</strong> {formatDayDate(invoiceStartDate)} To {formatDate(invoiceEndDate)}</p>
                            <p className='mb-2'><strong>Invoice Number:</strong> {invoiceNumber}</p>
                            {purchaseNumber ? (<p className='mb-2'><strong>Purchase Number:</strong> {purchaseNumber}</p>) : null}
                            {country?.toLowerCase() === "india" && (<p className='mb-2'><strong> HSN/SAC:</strong> 9983</p>)}
                            <p className='mb-2'><strong>Invoice Month:</strong> {formatMDate(invoiceMonth)}</p>
                            <p className='mb-2'><strong>Invoice Date:</strong> {formatDate(invoiceStartDate)}</p>

                            <div className="amount-box p-2 px-3 mt-1 d-inline-block">
                                <strong>Amount Due : <span className='fs-6'>{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.totalAmount}</span></strong>
                                {invoiceDueDate ? (<div><strong>Due Date: <span style={{ fontSize: '.8rem' }}>{formatDate(invoiceDueDate)}</span></strong></div>) : null}

                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mt-4">
                        <table className="table table-borderless">
                            <thead className="table-head">
                                <tr>
                                    <th style={{ width: '80px' }}>Item No.</th>
                                    <th className="text-center">Description</th>
                                    <th className="text-end" style={{ width: '110px' }}>Amount</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {InvoiceAllData?.tableData?.inlineItemsData?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-left py-2 ps-3">{index + 1}</td>
                                        <td className="py-2 ps-3">{item.description}</td>
                                        <td className="text-end py-2 ps-3 pe-3" style={{ width: '110px' }}>{symbol} {item.totalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="row justify-content-end">
                        <div className="col-md-7">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span className='pe-3'>{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.untaxedAmount}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-1">
                                <span>Tax:</span>
                                <span className='pe-3'>{InvoiceAllData?.tableData?.totaltaxdata?.tax}%</span>
                            </div>

                            <hr className='my-2' />

                            <div className="d-flex justify-content-between align-items-center fw-bold">
                                <span>Payment on  {formatDate(invoiceEndDate)} (Total):</span>
                                <span className='pe-3 fs-6'>{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mt-4">
                        <h6 className='fw-bold'>Notes / Terms</h6>
                        <div className="row mt-3">
                            {mappedInvoiceEntity?.map((item) => (
                                <div key={item.id} className="col-md-6">
                                    <span
                                        dangerouslySetInnerHTML={{ __html: item.name }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-1 py-2 pb-3 mt-1">
                            <div className="fw-bold mb-2">Declaration:</div>
                            <ol className='ps-3 mb-0'>
                                <li>We declare that this invoice shows the actual price of the services described and that particulars are true & correct.</li>
                                <li>This is a system-generated document. No signature is required.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
