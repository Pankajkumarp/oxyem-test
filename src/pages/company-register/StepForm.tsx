"use client";

import { useState } from "react";
import FieldRenderer from "./FieldRenderer";

export default function StepForm({formFieldData}) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const currentStep = formFieldData.section[step];
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const validateUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };


    const setValue = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));

        setFormErrors((prev) => {
            const newErrors = { ...prev };

            /* 🔥 EMAIL LIVE VALIDATION */
            if (name === "companyEmail") {
                if (!value) {
                    newErrors[name] = "Email is required";
                } else if (!validateEmail(value)) {
                    newErrors[name] = "Enter a valid email address";
                } else {
                    delete newErrors[name];
                }
                return newErrors;
            }

            /* 🔥 URL LIVE VALIDATION */
            if (name === "companyWebsite") {
                if (!value) {
                    delete newErrors[name]; // URL is optional
                } else if (!validateUrl(value)) {
                    newErrors[name] = "Enter a valid website URL";
                } else {
                    delete newErrors[name];
                }
                return newErrors;
            }

            // default behavior
            if (prev[name]) {
                delete newErrors[name];
            }

            return newErrors;
        });
    };


    const validateStep = () => {
        const errors: Record<string, any> = {};

        currentStep.fields.forEach((field: any) => {
            const value = formData[field.name];

            /* ---------------- EMAIL VALIDATION ---------------- */
            if (field.type === "email") {
                if (!value) {
                    errors[field.name] =
                        field.errorMessage || "Email is required";
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (!emailRegex.test(value)) {
                        errors[field.name] = "Enter a valid email address";
                    }
                }
                return; // stop further validation for email
            }
            /* ---------------- URL VALIDATION ---------------- */
            if (field.type === "url") {
                if (!value) return; // optional URL

                if (!validateUrl(value)) {
                    errors[field.name] = "Enter a valid website URL";
                }
                return;
            }


            /* ---------------- REQUIRED FIELD VALIDATION ---------------- */
            if (field.required) {

                // checkbokwithInput (nested object)
                if (field.type === "checkbokwithInput") {
                    if (!value || Object.keys(value).length === 0) {
                        errors[field.name] =
                            field.errorMessage || "Select at least one option";
                    } else {
                        const optionErrors: Record<string, string> = {};

                        Object.entries(value).forEach(([key, val]) => {
                            const numVal = Number(val);
                            if (numVal <= 0) {
                                optionErrors[key] = "Value must be greater than 0";
                            }
                        });

                        if (Object.keys(optionErrors).length > 0) {
                            errors[field.name] = optionErrors;
                        }
                    }
                }

                // checkbox validation
                else if (field.type === "checkbox") {
                    if (
                        (field.selectionType === "single" && !value) ||
                        (field.selectionType === "multiple" &&
                            (!value || value.length === 0))
                    ) {
                        errors[field.name] =
                            field.errorMessage || "This field is required";
                    }
                }

                // radio / text / number / textarea / etc
                else if (value === undefined || value === "") {
                    errors[field.name] =
                        field.errorMessage || "This field is required";
                }
            }
        });

        return errors;
    };



    const handleNext = () => {
        const errors = validateStep();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors); // store in state to display
            return;
        }
        setFormErrors({});
        setStep(step + 1);
    };

    const handleSubmit = () => {
        const errors = validateStep();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        console.log("Form Submitted", formData);
    };


    return (
        <div className="card flex-fill comman-shadow oxyem-index">
            <div className="center-part">
                <div className="card-body">
                    <div
                        className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border stepform-oxyem-question"
                        id="sk-create-page"
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {currentStep.title}
                        </h2>

                        {currentStep.fields.map((field: any) => (
                            <div key={field.name} className="step-form-field">
                                {!(field.type === "checkbox" && !field.options) && (
                                    <label className="block step-form-label">{field.label} {field.required ? <span className="error">*</span>:""}</label>
                                )}
                                <FieldRenderer
                                    field={field}
                                    value={formData[field.name]}
                                    setValue={setValue}
                                    errors={formErrors[field.name]}
                                />
                                {formErrors[field.name] && typeof formErrors[field.name] === "string" && (
                                    <p className="error">{formErrors[field.name]}</p>
                                )}

                            </div>
                        ))}
                        <div className="flex justify-between mt-4 text-end">
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                disabled={step === 0}
                                className={`btn btn-cancel mx-2 ${step === 0 ? "bg-gray-300 cursor-not-allowed" : ""
                                    }`}
                            >
                                Back
                            </button>
                            {step === formFieldData.section.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-submit mx-2"
                                >
                                    Submit
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="btn btn-primary mx-2"
                                >
                                    Next
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
