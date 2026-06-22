/* eslint-disable @typescript-eslint/no-explicit-any */
import CheckbokwithInput from "./CheckbokwithInput";
import Select from "react-select";
import Files from "react-files";
import { FiUpload } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";


export default function FieldRenderer({ field, value, setValue, errors }: any) {
    switch (field.type) {
        case "text":
        case "number":
            return (
                <input
                    type={field.type}
                    value={value || ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    className="input form-control"
                />
            );
        case "email":
            return (
                <input
                    type="email"
                    value={value || ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    className={`input form-control ${errors ? "border-red-500" : ""}`}
                    placeholder="example@company.com"
                />
            );
        case "url":
            return (
                <input
                    type="url"
                    value={value || ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    placeholder="https://www.company.com"
                    className={`input form-control ${errors ? "border-red-500" : ""}`}
                />
            );


        case "textarea":
            return (
                <textarea
                    value={value || ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    className="input form-control"
                />
            );

        case "select":
            // eslint-disable-next-line no-case-declarations
            const options = field.options?.map((opt: any) => {
                if (typeof opt === 'string') {
                    return { label: opt, value: opt }; // fallback if it's a string
                } else {
                    return { label: opt.label, value: opt.value }; // if already object
                }
            }) || [];

            return (
                <Select
                    value={options.find((o) => o.value === value) || null}
                    onChange={(selected) => setValue(field.name, selected?.value)}
                    options={options}
                    placeholder="Select..."
                    isClearable={true}
                />
            );

        case "checkbox":
            // Multi-checkbox with options
            if (field.options?.length) {
                return (
                    <div className="step-form-checkbox-box-label">
                        {field.options.map((opt: string) => {
                            const isSingle = field.selectionType === "single";
                            const checked = isSingle ? value === opt : value?.includes(opt);
                            return (
                                <label key={opt} className={`step-form-checkbox-label ${checked ? "is-checked" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => {
                                            if (isSingle) {
                                                setValue(field.name, checked ? null : opt);
                                            } else {
                                                setValue(
                                                    field.name,
                                                    checked
                                                        ? value.filter((v: string) => v !== opt)
                                                        : [...(value || []), opt]
                                                );
                                            }
                                        }}
                                    />
                                    <span className="checkbox-custom"></span>
                                    {opt}
                                </label>
                            );
                        })}
                    </div>
                );
            }

            // Single checkbox without options (like agreeTerms)
            return (
                <div className="step-form-checkbox-box-label">
                    <label htmlFor={field.name} className={`step-form-checkbox-label ${value ? "is-checked" : ""}`}>
                        <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => setValue(field.name, e.target.checked)}
                        id={field.name}
                    />
                    <span className="checkbox-custom"></span>{field.label}
                    </label>
                </div>
            );

        case "radio":
            if (!field.options) return null;
            return (
                <div className="flex flex-col gap-2">
                    {field.options.map((opt: string) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={field.name}
                                value={opt}
                                checked={value === opt}
                                onChange={() => setValue(field.name, opt)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            );

        case "file":
            return (
                <Files
                    className="files-dropzone"
                    onChange={(files) => {
                        // react-files returns array
                        const file = files?.[0];
                        setValue(field.name, file);
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    onError={(error) => {
                        setValue(field.name, null);
                    }}
                    accepts={field.accept || []}
                    multiple={false}
                    maxFiles={1}
                    clickable
                >
                    <div className="custom-input-section">
                        {value ? (
                            <p className="uploaded-file-form">
                                <FaRegCheckCircle /> {value.name}
                            </p>
                        ) : (
                            <span className="ms-2">
                                <FiUpload /> Drag & Drop your logo or <span className="filepond--label-action">Browse</span>
                            </span>
                        )}
                    </div>
                </Files>
            );


        case "preview":
            return <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(value, null, 2)}</pre>;

        case "checkbokwithInput": // NEW CASE
            return <CheckbokwithInput field={field} value={value || {}} setValue={setValue} errors={errors} />;

        default:
            return null;
    }
}
