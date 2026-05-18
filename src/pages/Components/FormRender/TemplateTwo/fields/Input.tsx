import { getValidationRules } from "./validation";

export default function Input({ field, register, errors }: any) {
  const getNestedError = (errors: any, name: string) => {
  return name.split(".").reduce((obj, key) => obj?.[key], errors);
};
const error = getNestedError(errors, field.name);
  return (
    <div className={`single-field col-md-${field.col}`}>
      <label className="text-sm font-medium">
        {field.label}
        {field.validations?.length ? (
          <span className="error-label-icon">*</span>
        ) : ""}
      </label>

      <input
        type="text"
        disabled={field.readOnly}
        placeholder={field.placeholder}
        {...register(field.name, getValidationRules(field))}
        className={`w-full border rounded px-3 py-2
          ${error ? "border-red-500" : ""}`}
      />

      {error && (
        <p className="template-one-form-error-maessage">
          {error.message}
        </p>
      )}
    </div>
  );
}
