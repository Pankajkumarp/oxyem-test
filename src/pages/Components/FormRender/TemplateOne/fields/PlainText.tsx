import { getValidationRules } from "./validation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Input({ field, register, errors }: any) {
  return (
    <div className={`single-field col-md-${field.col}`}>
      {field.viewType === "hidden"?null:(
      <label className="text-sm font-medium">
        {field.label} {field.validations?.length ? <span className="error-label-icon">*</span> : ""}
      </label>
      )}
      {field.additonalText ? (
        <div className="field-with-text">
          <input
            type={"text"}
            disabled={field.readOnly}
            placeholder={field.placeholder}
            {...register(field.name, getValidationRules(field))}
            className={`w-full border rounded px-3 py-2
          ${errors[field.name] ? "border-red-500" : ""}`}
          />
          <span className="highlight-text-add">{field.additonalText}</span>
        </div>
      ) : (
        <>
        {field.viewType === "hidden"? (<input
          type={"hidden"}
          disabled={field.readOnly}
          placeholder={field.placeholder}
          {...register(field.name, getValidationRules(field))}
          className={`w-full border rounded px-3 py-2
          ${errors[field.name] ? "border-red-500" : ""}`}
        />):(
        <input
          type={"text"}
          disabled={field.readOnly}
          placeholder={field.placeholder}
          {...register(field.name, getValidationRules(field))}
          className={`w-full border rounded px-3 py-2
          ${errors[field.name] ? "border-red-500" : ""}`}
        />
          )}
          </>
      )}
      {errors[field.name] && (
        <p className="template-one-form-error-maessage">
          {errors[field.name].message}
        </p>
      )}
      <style>{`.field-with-text{position: relative;}.field-with-text .highlight-text-add{position: absolute;right: 7px;top: 6.5px;background: #f0fdf4;border: 1px solid #0ebc6b;border-radius: 7px;align-items: center;font-size: 10px;padding: 4px 10px;color: #0ebc6b;font-weight: 700;text-transform: capitalize;}`}</style>
    </div>
  );
}
