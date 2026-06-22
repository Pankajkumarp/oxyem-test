import Input from "./fields/Input";
import Number from "./fields/Number";
import SelectField from "./fields/SelectField";
import Textarea from "./fields/Textarea";
import Checkbox from "./fields/Checkbox";
import FileUpload from "./fields/FileUpload";
import DatePickerField from "./fields/DatePickerField";
import DatePickerFieldWeek from "./fields/DatePickerFieldWeekay";
import Time from "./fields/time";
import PlainText from "./fields/PlainText";

export default function FieldRenderer({
    field,
    register,
    errors,
    control,
    leaveType,
    startDate,
    startTime,
    endTime,
    isPage,
    idEmployee
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
    const commonProps = { field, register, errors };
    switch (field.type) {
        case "Date":
            return (<DatePickerField field={field} control={control} errors={errors} leaveType={leaveType} startDate={startDate} isPage={isPage} idEmployee={idEmployee}/>);
        case "DateCheck":
            return (<DatePickerFieldWeek field={field} control={control} errors={errors} leaveType={leaveType} startDate={startDate} isPage={isPage} idEmployee={idEmployee}/>);
        case "Text":
            return <Input {...commonProps} />;
        case "PlainText":
            return <PlainText {...commonProps} />;
        case "Number":
            return <Number {...commonProps} />;
        case "Time":
            return <Time control={control} {...commonProps} idEmployee={idEmployee} startTime={startTime} endTime={endTime}/>;
        case "SelectOption":
            return <SelectField field={field} control={control} errors={errors} idEmployee={idEmployee}/>;
        case "Textarea":
            return <Textarea {...commonProps} />;
        case "Checkbox":
            return <Checkbox {...commonProps} />;
        case "FileUpload":
            return <FileUpload field={field} control={control} errors={errors} />;
        default:
            return null;
    }
}
