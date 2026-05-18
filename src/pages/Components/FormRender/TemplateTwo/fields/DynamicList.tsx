import { useFieldArray, useWatch } from "react-hook-form";
import { useEffect } from "react";
import FieldRenderer from "../FieldRenderer";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import currencySymbolMap from 'currency-symbol-map';


export default function DynamicList({ field, control, register, errors, setValue, allValues, InvoiceAllData }: any) {
    const currencyType = InvoiceAllData?.invoiceData?.currencyType
    const symbol = currencySymbolMap(currencyType);
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: field.name
    });
    useEffect(() => {
        if (field.value && field.value.length > 0) {
            replace(field.value);
        }
    }, [field.value]);

    const lineItems = useWatch({
        control,
        name: field.name
    }) || [];

    const taxPercent = useWatch({
        control,
        name: "taxValue"
    }) || 0;
    useEffect(() => {
        if (InvoiceAllData?.tableData?.totaltaxdata?.tax !== undefined) {
            setValue("taxValue", InvoiceAllData?.tableData?.totaltaxdata?.tax);
        }
    }, [InvoiceAllData]);

    const untaxedAmount = lineItems.reduce(
        (sum: number, row: any) =>
            sum + Number(row?.totalAmount || 0),
        0
    );

    const taxAmount = untaxedAmount * (Number(taxPercent) / 100);

    const grandTotal = untaxedAmount + taxAmount;


    useEffect(() => {
  const requiredRows = field.minRows || 0;

  // ✅ If we have API data — DO NOTHING
  if (field.value && field.value.length > 0) return;

  if (fields.length < requiredRows) {
    const emptyRow = createEmptyRow();

    for (let i = fields.length; i < requiredRows; i++) {
      append(emptyRow);
    }
  }
}, []);

    useEffect(() => {
        setValue("untaxedAmount", untaxedAmount);
        setValue("totalAmount", grandTotal);
    }, [untaxedAmount, grandTotal]);

    const createEmptyRow = () => {
        return field.columns.reduce((acc: any, col: any) => {
            if (
                col.name &&
                col.type !== "AutoNumber" &&
                col.type !== "RowAction"
            ) {
                acc[col.name] = "";
            }
            return acc;
        }, {});
    };

    return (
        <div className={`col-md-${field.col || 12} mb-3 multi-field-input`}>
            <span className='btn btn-primary breadcrum-btn' onClick={() => append(createEmptyRow())}
            ><FaPlus /></span>
            <table className="table-responsive custom-field-table">
                <thead>
                    <tr>
                        {field.columns.map((c: any) => {

                            let thClass = "";

                            if (c.name === "srno" || c.name === "action") {
                                thClass = "template-th-small";
                            } else if (c.name === "totalAmount") {
                                thClass = "template-th-medium";
                            }

                            return (
                                <th key={c.name} className={thClass} style={c.name === "totalAmount" ? { width: "120px" } : {}}>
                                    {c.label}
                                </th>
                            );
                        })}

                    </tr>
                </thead>

                <tbody>
                    {fields.map((item: any, index: number) => (
                        <tr key={item.id}>
                            {field.columns.map((col: any) => {

                                if (col.type === "AutoNumber")
                                    return <td key={col.name}>{index + 1}</td>;

                                if (col.type === "RowAction")
                                    return (
                                        <td key={col.name}>
                                            {fields.length > (field.minRows || 0) && (
                                                <button
                                                    type="button"
                                                    className="btn_cancal_tb"
                                                    onClick={() => remove(index)}
                                                >
                                                    <RiDeleteBinLine />
                                                </button>
                                            )}
                                        </td>

                                    );

                                return (
                                    <td key={col.name} className={`${col.name === "totalAmount" ? "small-td-in d-flex align-items-center" : ""}`}>
                                        {col.name === "totalAmount" ? (<span className="pe-1 mb-2 pb-1">{symbol}</span>):null}
                                        <FieldRenderer
                                            field={{
                                                ...col,
                                                name: `${field.name}.${index}.${col.name}`
                                            }}
                                            register={register}
                                            errors={errors}
                                            control={control}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="invoice-totals-box mt-3">
                <div>
                    <label>Untaxed Amount :</label>
                    <span>{symbol}{untaxedAmount}</span>
                </div>
                <div className="with-input-t">
                    <label>Tax Percentage:</label>
                    <input
                        type="number"
                        {...register("taxValue", {
                            valueAsNumber: true,
                            min: 0
                        })}
                        defaultValue={0}
                        className="form-control"
                    />
                </div>
                <div>
                    <label>Total Amount:</label>
                    <span>{symbol}{grandTotal}</span>
                </div>
            </div>

        </div>
    );
}
