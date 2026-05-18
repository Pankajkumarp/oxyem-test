"use client";

import { useState , useRef, useEffect} from "react";
import FieldRenderer from "./FieldRenderer";
import { FaRegCircle } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";


export default function StepForm({ formFieldData }) {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [formJason, setFormjason] = useState(formFieldData);
    const [step, setStep] = useState(0);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const currentStep = formJason.section[step];
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

    const isTabCompleted = (section: any) => {
        const requiredFields = section.fields.filter((f: any) => f.required);

        // --------------------------------------------------
        // CASE 1: TAB HAS REQUIRED FIELDS
        // --------------------------------------------------
        if (requiredFields.length > 0) {
            return requiredFields.every((field: any) => {
                // radio with subfields
                if (field.type === "radiowithField") {
                    if (!field.value) return false;

                    return field.subfields?.every((sub: any) => {
                        if (!sub.required) return true;
                        return sub.value !== "" && sub.value !== undefined;
                    });
                }

                // checkbox
                if (field.type === "checkbox") {
                    return Boolean(field.value);
                }

                // normal input
                return field.value !== "" && field.value !== undefined;
            });
        }
        return section.fields.some((field: any) => {
            // radio with subfields
            if (field.type === "radiowithField") {
                if (!field.value) return false;

                return field.subfields?.some((sub: any) => {
                    return sub.value !== "" && sub.value !== undefined;
                });
            }

            // checkbox
            if (field.type === "checkbox") {
                return Boolean(field.value);
            }

            // normal input
            return field.value !== "" && field.value !== undefined;
        });
    };





    const setValue = (name: string, value: any) => {
        setFormjason((prev: any) => {
            const updated = structuredClone(prev);

            updated.section.forEach((section: any) => {
                section.fields.forEach((field: any) => {
                    if (field.name === name) {
                        field.value = value;
                    }

                    // NEW: handle subfields
                    if (field.subfields) {
                        field.subfields.forEach((sub: any) => {
                            if (sub.name === name) {
                                sub.value = value;
                            }
                        });
                    }
                });
            });


            return updated;
        });
        setFormErrors((prev) => {
            const errors = { ...prev };
            if (name === "companyEmail") {
                if (!value) errors[name] = "Email is required";
                else if (!validateEmail(value))
                    errors[name] = "Enter a valid email address";
                else delete errors[name];
                return errors;
            }
            if (name === "companyWebsite") {
                if (value && !validateUrl(value))
                    errors[name] = "Enter a valid website URL";
                else delete errors[name];
                return errors;
            }
            if (
                value !== undefined &&
                value !== "" &&
                !(Array.isArray(value) && value.length === 0)
            ) {
                delete errors[name];
            }

            return errors;
        });
    };


    console.log("formJason", formJason)
    const validateStep = () => {
        const errors: Record<string, any> = {};

        currentStep.fields.forEach((field: any) => {

            const value = field.value;
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

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleNext = () => {
        const errors = validateStep();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors); // store in state to display
            return;
        }
        setFormErrors({});
        setStep(step + 1);
    };

    const validateSection = (section: any) => {
        const errors: Record<string, any> = {};

        section.fields.forEach((field: any) => {
            const value = field.value;

            if (field.type === "email") {
                if (!value) {
                    errors[field.name] =
                        field.errorMessage || "Email is required";
                } else if (!validateEmail(value)) {
                    errors[field.name] = "Enter a valid email address";
                }
                return;
            }

            if (field.type === "url") {
                if (value && !validateUrl(value)) {
                    errors[field.name] = "Enter a valid website URL";
                }
                return;
            }
            if (field.type === "radiowithField") {
                if (field.required && !field.value) {
                    errors[field.name] = field.errorMessage;
                }

                if (field.value && field.subfields) {
                    field.subfields.forEach((sub: any) => {
                        if (sub.required && !sub.value) {
                            errors[sub.name] =
                                sub.errorMessage || "This field is required";
                        }
                    });
                }

                return;
            }


            if (field.required) {
                if (field.type === "checkbokwithInput") {
                    if (!value || Object.keys(value).length === 0) {
                        errors[field.name] =
                            field.errorMessage || "Select at least one option";
                    }
                    return;
                }

                if (field.type === "checkbox") {
                    if (
                        (field.selectionType === "single" && !value) ||
                        (field.selectionType === "multiple" &&
                            (!value || value.length === 0))
                    ) {
                        errors[field.name] =
                            field.errorMessage || "This field is required";
                    }
                    return;
                }

                if (value === undefined || value === "") {
                    errors[field.name] =
                        field.errorMessage || "This field is required";
                }
            }
        });

        return errors;
    };

    const handleSubmit = () => {
        setHasSubmitted(true);

        let allErrors: Record<string, any> = {};

        formJason.section.forEach((section: any) => {
            const sectionErrors = validateSection(section);
            allErrors = { ...allErrors, ...sectionErrors };
        });

        if (Object.keys(allErrors).length > 0) {
            setFormErrors(allErrors);

            // Optional: jump to first invalid tab
            const firstErrorIndex = formJason.section.findIndex((section: any) =>
                section.fields.some((field: any) => {
                    // parent field error
                    if (allErrors[field.name]) return true;

                    // 🔥 subfield errors
                    if (field.subfields) {
                        return field.subfields.some(
                            (sub: any) => allErrors[sub.name]
                        );
                    }

                    return false;
                })
            );


            if (firstErrorIndex !== -1) {
                setStep(firstErrorIndex);
            }

            return;
        }

        console.log("Form Submitted", formJason);
    };


    const hasRequiredFields = (section: any) => {
        return section.fields.some((field: any) => field.required);
    };
    const hasTabErrors = (section: any) => {
        return section.fields.some((field: any) => {
            if (formErrors[field.name]) return true;

            if (field.subfields) {
                return field.subfields.some(
                    (sub: any) => formErrors[sub.name]
                );
            }

            return false;
        });
    };
useEffect(() => {
  const activeTab = tabRefs.current[step];
  if (activeTab) {
    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}, [step]);


    return (
        <div className="card flex-fill comman-shadow oxyem-index">
            <div className="center-part">
                <div className="card-body">
                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                        <div className="row">
                            <div className="col-md-4 col-xxl-3">
                                <div className="oxyem-form-step-tabs">
                                    {formJason.section.map((sec: any, index: number) => {
                                        const isLastTab = index === formJason.section.length - 1;

                                        return (
                                            <button
                                                key={sec.stepId}
                                                ref={(el) => {
    tabRefs.current[index] = el;
  }}
                                                type="button"
                                                onClick={() => setStep(index)}
                                                className={`step-tab 
        ${step === index ? "active" : ""} 
        ${!isLastTab && isTabCompleted(sec) ? "step-form-q-completed" : ""} 
        ${!isLastTab && hasSubmitted && hasTabErrors(sec) && !isTabCompleted(sec)
                                                        ? "step-form-q-required"
                                                        : ""
                                                    }`}
                                            >
                                                {!isLastTab && (
                                                    hasSubmitted && hasTabErrors(sec) && !isTabCompleted(sec)
                                                        ? <FaRegTimesCircle />
                                                        : isTabCompleted(sec)
                                                            ? <FaRegCheckCircle />
                                                            : <FaRegCircle />
                                                )}
                                                {isLastTab && (
                                                    <FaRegCircle />
                                                )}


                                                {sec.tabname || `Step ${index + 1}`}

                                                {hasRequiredFields(sec) && (
                                                    <span className="text-red-btn-tab">*</span>
                                                )}
                                            </button>
                                        );
                                    })}

                                </div>
                            </div>
                            <div className="col-md-8 col-xxl-9 stepform-oxyem-question">
                                <h2 className="text-xl font-semibold mb-4">
                                    {currentStep.title}
                                </h2>

                                {currentStep.fields.map((field: any) => (
                                    <div key={field.name} className={`step-form-field field-type-${field.type}`}>
                                        {!(
                                            (field.type === "checkbox" && !field.options) ||
                                            field.type === "simplecheckbox"
                                        ) && (
                                                <label className="block step-form-label">
                                                    {field.label}
                                                    {field.required && <span className="error">*</span>}
                                                </label>
                                            )}
                                        <FieldRenderer
                                            field={field}
                                            value={field.value}
                                            setValue={setValue}
                                            isDisable={field.isDisable || false}
                                            errors={formErrors[field.name]}
                                            formErrors={formErrors}
                                            previewJson={formJason}
                                        />
                                        {formErrors[field.name] && typeof formErrors[field.name] === "string" && (
                                            <p className="error">{formErrors[field.name]}</p>
                                        )}


                                    </div>
                                ))}
                                <div className="flex justify-between mt-0 text-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        disabled={step === 0}
                                        className={`btn btn-cancel mx-2 ${step === 0 ? "bg-gray-300 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        Back
                                    </button>
                                    {step === formJason.section.length - 1 ? (
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
            </div>
        </div>
    );
}
