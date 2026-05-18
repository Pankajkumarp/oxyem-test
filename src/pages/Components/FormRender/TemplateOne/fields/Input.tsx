import { getValidationRules } from "./validation";

export default function Input({ field, register, errors }: any) {
  return (
    <div className={`single-field col-md-${field.col}`}>
      <label className="text-sm font-medium">
        {field.label} {field.validations?.length ? <span className="error-label-icon">*</span> : ""}
      </label>

      <input
        type={field.type === "Number" ? "number" : "date"}
        disabled={field.readOnly}
        placeholder={field.placeholder}
        {...register(field.name, getValidationRules(field))}
        className={`w-full border rounded px-3 py-2
          ${errors[field.name] ? "border-red-500" : ""}`}
      />

      {errors[field.name] && (
        <p className="template-one-form-error-maessage">
          {errors[field.name].message}
        </p>
      )}
    </div>
  );
}
