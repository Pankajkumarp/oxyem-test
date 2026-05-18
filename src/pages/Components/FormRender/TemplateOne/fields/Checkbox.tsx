import { getValidationRules } from "./validation";

export default function Checkbox({ field, register, errors }: any) {
  return (
    <div className={`single-field col-md-${field.col}`}>
      <div className="template-chekbox-field">
        <input
          type="checkbox"
          value={field.options?.[0]?.value}
          {...register(field.name, getValidationRules(field))}
          className="mt-1"
        />

        <label className="text-sm leading-5">
          {field.options?.[0]?.label || field.options?.[0]?.name}
        </label>
      </div>

      {errors[field.name] && (
        <p className="template-one-form-error-maessage">
          {errors[field.name].message}
        </p>
      )}
    </div>
  );
}
