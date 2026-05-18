import Input from "./fields/Input";
import Number from "./fields/Number";
import SelectField from "./fields/SelectField";
import InvoiceField from "./fields/InvoiceField";
import Textarea from "./fields/Textarea";
import Checkbox from "./fields/Checkbox";
import FileUpload from "./fields/FileUpload";
import DatePickerField from "./fields/DatePickerField";
import DynamicList from "./fields/DynamicList";
import MonthYearPickerField from "./fields/MonthYearPickerField";


export default function FieldRenderer({
    field,
    register,
    errors,
    control,
    startDate,
    isPage,
    dynamicId,
    allValues,
    InvoiceAllData,
    setValue
}: any) {
    const commonProps = { field, register, errors };
    switch (field.type) {
        case "Date":
            return (<DatePickerField field={field} control={control} errors={errors} startDate={startDate} isPage={isPage} setValue={setValue}/>);
        case "MonthYear":
            return (
                <MonthYearPickerField
                    field={field}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                />
            );
        case "Text":
            return <Input {...commonProps} />;
        case "Number":
            return <Number {...commonProps} />;
        case "SelectOption":
            return <SelectField field={field} control={control} errors={errors} dynamicId={dynamicId} setValue={setValue}/>;
        case "Textarea":
            return <Textarea {...commonProps} />;
        case "Checkbox":
            return <Checkbox {...commonProps} />;
        case "FileUpload":
            return <FileUpload field={field} control={control} errors={errors} />;
        case "DynamicList":
            return (
                <DynamicList
                    field={field}
                    control={control}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    allValues={allValues}
                    InvoiceAllData={InvoiceAllData}
                />
            );
        case "InvoiceView":
            return (
                <InvoiceField field={field} control={control} errors={errors} dynamicId={dynamicId} allValues={allValues} InvoiceAllData={InvoiceAllData} setValue={setValue}/>
            );

        default:
            return null;
    }
}
