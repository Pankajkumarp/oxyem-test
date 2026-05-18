import React from 'react'
import currencySymbolMap from 'currency-symbol-map';
import numberToWords from 'number-to-words';
import { format } from "date-fns";

export default function TemplateOneInvoice({ InvoiceAllData }: any) {
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
                            <div
                                dangerouslySetInnerHTML={{ __html: entity }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="invoice_middle_section">
                <div className="row">
                    <div className="col-md-4 invoice_middle_text">
                        <h2>Bill To</h2>
                        <p className='mb-1'>{customerName}</p>
                        <p>{BTP}</p>
                    </div>
                    <div className="col-md-4 invoice_middle_text">
                        <h2>Ship To</h2>
                        <p className='mb-1'>{customerName}</p>
                        <p>{STP}</p>
                    </div>
                    <div className="col-md-4 invoice_middle_text">
                        <p><span>Service Period:</span> {formatDate(invoiceStartDate)} To {formatDate(invoiceEndDate)}</p>
                        <p><span>Invoice No:</span> {invoiceNumber}</p>
                        <p><span>Invoice Date:</span> {formatMDate(invoiceMonth)}</p>
                        {country?.toLowerCase() === "india" && (<p><span>HSN/SAC:</span> 9983</p>)}
                        {
                            purchaseNumber ? (
                                <p><span>Purchase Number:</span> {purchaseNumber}</p>
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
                                {InvoiceAllData?.tableData?.inlineItemsData?.map((item, index) => (
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
                    <div className="col-md-7 invocie-declaration-text">
                        <h3>Declaration:</h3>
                        <p>We declare that this invoice shows the actual price of the services described and that particulars are true & correct.</p>
                        <p className='bt_d'>This is a system-generated document. No signature is required.</p>
                    </div>
                    <div className="col-md-5">
                        <div className="inviocie_price_section">
                            <div className="t_inviocie_price_section">
                                <div className='in_er_line'>
                                    <span className='start_text_f'>Untaxed Amount :</span>
                                    <span className='end_text_f'>{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.untaxedAmount}</span>
                                </div>
                                <div className='in_er_line'>
                                    <span className='start_text_f'>Tax % :</span>
                                    <span className='end_text_f'>{InvoiceAllData?.tableData?.totaltaxdata?.tax}%</span>
                                </div>
                                <div className='in_er_line'>
                                    <span className='start_text_f'>Total:</span>
                                    <span className='end_text_f'>{symbol} {InvoiceAllData?.tableData?.totaltaxdata?.totalAmount}</span>
                                </div>
                                <div className='in_er_line'>
                                    <span className='start_text_f'>{currencySymbol}</span>
                                    <span className='end_text_f current_word_con'>{convertNumberToWords(Math.round(InvoiceAllData?.tableData?.totaltaxdata?.totalAmount))} only</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
