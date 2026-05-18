import React from 'react'
import currencySymbolMap from 'currency-symbol-map';
import numberToWords from 'number-to-words';
import { format } from "date-fns";

export default function TemplateTwoInvoice({ InvoiceAllData }: any) {
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
    return (
        <div className="table-responsive">
            <table className="table table-bordered custom-invoice-border mb-0">
                <tbody>
                    <tr>
                        <td colSpan={2} className="bg-light text-center">
                            <div className="template_two_logo_section">
                                <h1 className='invoice_logo'><span>O</span>XYTAL</h1>
                                <p className='invoice_logo_bottom'>Trusted Digital Partner</p>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2} className="text-center p-4" style={{ lineHeight: "1.8" }}>
                            <span
                                dangerouslySetInnerHTML={{ __html: entity }}
                            />
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2} className="px-2 py-2">
                            <span className='fw-bold'>Service Period: </span>{formatDate(invoiceStartDate)} To {formatDate(invoiceEndDate)}
                        </td>
                    </tr>

                    <tr>
                        <td className="col-7 py-3">
                            <div className="row gx-2 gy-2 mb-3">
                                <div className="col-auto">
                                    <strong>Bill To :</strong>
                                </div>
                                <div className="col">
                                    <address className="mb-0">
                                        <p className='mb-0'>{customerName}</p>
                                        <p className='mb-0'><span>Bill to Party:</span> {BTP}</p>
                                    </address>
                                </div>
                            </div>
                            <div className="row gx-2 gy-2">
                                <div className="col-auto">
                                    <strong>Ship To :</strong>
                                </div>
                                <div className="col">
                                    <address className="mb-0">
                                        <p className='mb-0'>{customerName}</p>
                                        <p className='mb-0'>{STP}</p>
                                    </address>
                                </div>
                            </div>
                        </td>

                        <td className="col-5 bg-light py-3">
                            <div className="row gx-2 gy-2">
                                <div className="col-6">
                                    Invoice No: <span className="float-end">:</span>
                                </div>
                                <div className="col-6">{invoiceNumber}</div>

                                <div className="col-6">
                                    Invoice Date <span className="float-end">:</span>
                                </div>
                                <div className="col-6">{formatMDate(invoiceMonth)}</div>
                                {country?.toLowerCase() === "india" && (
                                    <>
                                        <div className="col-6">
                                            HSN/SAC: <span className="float-end">:</span>
                                        </div>
                                        <div className="col-6">9983</div>
                                    </>
                                )}
                                <div className="col-6">
                                    Purchase Number: <span className="float-end">:</span>
                                </div>
                                <div className="col-6">{purchaseNumber}</div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2} className="p-0">
                            <table className="table table-sm mb-0">
                                <thead>
                                    <tr className="bg-light">
                                        <td className="col-1 text-center py-2">
                                            <strong>Item No.</strong>
                                        </td>
                                        <td className="col-6 py-2">
                                            <strong>Description</strong>
                                        </td>
                                        <td className="col-1 py-2 text-center">
                                            <strong>Amount</strong>
                                        </td>
                                    </tr>
                                </thead>

                                <tbody>
                                    {InvoiceAllData?.tableData?.inlineItemsData?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-center py-2">{index + 1}</td>
                                            <td className="py-2">{item.description}</td>
                                            <td className="text-end py-2 pe-3">{symbol} {item.totalAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr className="bg-light fw-bold">
                        <td className="col-7 py-2">

                        </td>
                        <td className="col-5 py-2 pe-1">
                            Untaxed Total: <span className="float-end pe-2">{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.untaxedAmount}</span>
                        </td>
                    </tr>

                    <tr>
                        <td className="col-7 py-2 text-1">
                            <span className="fw-bold">Bill Amount:</span>{" "}
                            <i className='text-capitalize'>{convertNumberToWords(Math.round(InvoiceAllData?.tableData?.totaltaxdata?.totalAmount))} only</i>
                        </td>
                        <td className="col-5  py-2 pe-1">
                            Tax:
                            <span className="float-end pe-2">{InvoiceAllData?.tableData?.totaltaxdata?.tax}%</span>
                        </td>
                    </tr>

                    <tr>
                        <td className="col-7 py-2 text-1"></td>
                        <td className="col-5 py-2 pe-1 bg-light fw-bold">
                            Grand Total:
                            <span className="float-end pe-2" style={{ fontSize: "1rem" }}>{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.totalAmount}</span>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2} className="col-7 text-1 py-2 pb-3">
                            <div className="fw-bold mb-2">Declaration:</div>
                            <ol className='pe-3 mb-0'>
                                <li>We declare that this invoice shows the actual price of the services described and that particulars are true & correct.</li>
                                <li>This is a system-generated document. No signature is required.</li>
                            </ol>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
