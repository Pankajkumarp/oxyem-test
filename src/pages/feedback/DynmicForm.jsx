import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaStar } from "react-icons/fa";
import { axiosJWT } from '../Auth/AddAuthorization';
import { useRouter } from 'next/router';
import { ToastNotification } from '../Components/EmployeeDashboard/Alert/ToastNotification';
export default function DynamicForm({ formData, shareId, onlyView }) {
  const router = useRouter();
  if (!formData || !formData.fields) return <p>Loading form...</p>;

  // ✅ Build Yup schema dynamically
  const shape = {};
  formData.fields.forEach((f, idx) => {
    let rule = yup.string();

    // ✅ Type-based validation
    if (f.type === "number") {
      rule = yup.number()
        .nullable()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .typeError(`${f.label} must be a number`);
    }
    if (f.type === "rating") {
      rule = yup.number().typeError(`${f.label} must be selected`);
    }
   

    // ✅ Required check
    if (f.type === "singleCheckbox") {
    // Store selected option (string)
    rule = yup.string();
  }

  // ✅ Required check
  if (f.required) {
    rule = rule.required(`${f.label} is required`);
  }

  shape[`field_${idx}`] = rule;

    
  });

  const schema = yup.object().shape(shape);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const updatedFormData = {
        ...formData,
        idShare: shareId,
        fields: formData.fields.map((field, idx) => ({
          ...field,
          value: data[`field_${idx}`] ?? null
        }))
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.post(`${apiUrl}/feedback/submit`, updatedFormData);

      if (response.status === 200) {
        router.push('/feedback');
        ToastNotification({ message: 'Feedback submitted successfully' });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="container py-3">
            <h3 className="mb-4">{formData.title}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
              
              {formData.fields.map((field, idx) => {
                const fieldName = `field_${idx}`;

                // ⭐ RATING FIELD
                if (field.type === "rating") {
                  return (
                    <div className="mb-3" key={idx}>
                      <label className="form-label">{field.label}</label>
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <div style={{ display: "flex", gap: "5px", cursor: onlyView ? "default" : "pointer" }}>
                            {[1, 2, 3, 4, 5].map(i => (
                              <FaStar
                                key={i}
                                size={28}
                                color={i <= (value || 0) ? "#ffc107" : "#ddd"}
                                onClick={!onlyView ? () => onChange(i) : undefined}
                                style={{ cursor: onlyView ? "not-allowed" : "pointer" }}
                              />
                            ))}
                          </div>
                        )}
                      />
                      {errors[fieldName] && (
                        <div className="text-danger small">{errors[fieldName]?.message}</div>
                      )}
                    </div>
                  );
                }

                // 🔽 SELECT FIELD
                if (field.type === "select") {
                  return (
                    <div className="mb-3" key={idx}>
                      <label className="form-label">{field.label}</label>
                      <select
                        className="form-select"
                        {...register(fieldName)}
                        disabled={onlyView} // ✅ disable select
                      >
                        <option value="">Select...</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {errors[fieldName] && (
                        <div className="text-danger small">{errors[fieldName]?.message}</div>
                      )}
                    </div>
                  );
                }

                // 🔽 CHECKBOX FIELD
                // 🔽 SINGLE CHECKBOX (only one option selectable)
if (field.type === "singleCheckbox") {
  return (
    <div className="mb-3" key={idx}>
      <label className="form-label">{field.label}</label>
      <Controller
        name={fieldName}
        control={control}
        rules={{ required: field.required ? `${field.label} is required` : false }}
        render={({ field: { onChange, value } }) => (
          <div>
            {field.options.map((opt, optIdx) => (
              <div className="form-check" key={optIdx}>
                <input
                  className="form-check-input"
                  type="radio"  // ✅ Acts like single selection
                  id={`${fieldName}_${opt}`}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  disabled={onlyView}
                />
                <label className="form-check-label" htmlFor={`${fieldName}_${opt}`}>
                  {opt}
                </label>
              </div>
            ))}
          </div>
        )}
      />
      {errors[fieldName] && (
        <div className="text-danger small">{errors[fieldName]?.message}</div>
      )}
    </div>
  );
}


                // 🔽 TEXT, NUMBER, DATE FIELDS
                return (
                  <div className="mb-3" key={idx}>
                    <label className="form-label">{field.label}</label>
                    <input
                      type={field.type}
                      className="form-control"
                      {...register(fieldName)}
                      disabled={onlyView} // ✅ disable input
                    />
                    {errors[fieldName] && (
                      <div className="text-danger small">{errors[fieldName]?.message}</div>
                    )}
                  </div>
                );
              })}

              {/* ✅ Submit button hidden if onlyView */}
              {!onlyView && (
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
