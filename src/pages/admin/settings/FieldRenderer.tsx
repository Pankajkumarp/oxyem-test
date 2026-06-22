/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import CheckbokwithInput from "./CheckbokwithInput";
import Select from "react-select";
import Files from "react-files";
import { FiUpload } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaCircleChevronUp, FaCircleChevronDown } from "react-icons/fa6";
const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : provided.borderColor,
    boxShadow: state.isFocused ? 'var(--dropdownfocusboxshadow)' : provided.boxShadow,
    '&:hover': {
      borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : 'var(--dropdownhoverbordercolor)',
    },
    backgroundColor: state.isFocused ? 'var(--dropdownfocusbgcolor)' : provided.backgroundColor,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'var(--dropdownhoverbg)',
    fontWeight: 'var(--dropdownfontweight)',
  }),
  option: (provided, state) => ({
    ...provided,
    padding: 'var(--dropdownpadding)',
    cursor: 'var(--dropdowncursorstyle)',
    fontWeight: 'var(--dropdownfontweight)',
    backgroundColor: state.isSelected
      ? 'var(--dropdownselectedbgcolor)'
      : state.isFocused
        ? 'var(--dropdowntransparentcolor)'
        : 'var(--dropdowntransparentcolor)',
    color: state.isSelected ? 'var(--dropdownselectedcolor)' : 'var(--dropdowninheritcolor)',
    ':hover': {
      backgroundColor: 'var(--dropdownhoverbg)',
      color: 'var(--dropdownhovercolor)',
      fontWeight: 'var(--dropdownfontweight)',
    },
  }),
};
export default function FieldRenderer({
  field,
  value,
  setValue,
  errors,
  formErrors,
  isDisable,
  previewJson
}: any) {



  const buildSectionPreviewData = (formJason: any) => {
    return formJason.section.map((section: any) => ({
      title: section.title || section.tabname || "Section",
      fields: section.fields.flatMap((field: any) => {
        // normal field
        if (field.type !== "radiowithField") {
          return [
            {
              label: field.label || field.name,
              value: field.value,
              isSub: false,
            },
          ];
        }

        // radiowithField
        const items = [
          {
            label: field.label || field.name,
            value: field.value,
            isSub: false,
          },
        ];

        field.subfields?.forEach((sub: any) => {
          items.push({
            label: sub.label || sub.name,
            value: sub.value,
            isSub: true,
          });
        });

        return items;
      }),
    }));
  };
  const previewSections =
  field?.type === "preview" && previewJson
    ? buildSectionPreviewData(previewJson)
    : [];
const [openSections, setOpenSections] = useState<Record<number, boolean>>(() => {
  const initial: Record<number, boolean> = {};
  previewSections.forEach((_, index) => {
    initial[index] = true; // all open by default
  });
  return initial;
});
const toggleSection = (index: number) => {
  setOpenSections((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};

  switch (field.type) {
    case "text":
    case "number":
      return (
        <input
          type={field.type}
          value={value || ""}
          disabled={isDisable}
          onChange={(e) => setValue(field.name, e.target.value)}
          className="input form-control"
        />
      );
    case "email":
      return (
        <input
          type="email"
          value={value || ""}
          disabled={isDisable}
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
          disabled={isDisable}
          onChange={(e) => setValue(field.name, e.target.value)}
          placeholder="https://www.company.com"
          className={`input form-control ${errors ? "border-red-500" : ""}`}
        />
      );

    case "textarea":
      return (
        <textarea
          value={value || ""}
          disabled={isDisable}
          onChange={(e) => setValue(field.name, e.target.value)}
          className="input form-control"
        />
      );

    case "select":
      // eslint-disable-next-line no-case-declarations
      const options =
        field.options?.map((opt: any) => {
          if (typeof opt === "string") {
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
          isDisabled={isDisable}
          styles={selectStyles}
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
                <label
                  key={opt}
                  className={`step-form-checkbox-label ${checked ? "is-checked" : ""
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={isDisable}
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
          <label
            htmlFor={field.name}
            className={`step-form-checkbox-label ${value ? "is-checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={!!value}
              disabled={isDisable}
              onChange={(e) => setValue(field.name, e.target.checked)}
              id={field.name}
            />
            <span className="checkbox-custom"></span>
            {field.label}
          </label>
        </div>
      );
    case "prechecked":
      // Multi-checkbox with options
      if (field.options?.length) {
        return (
          <div className="step-form-checkbox-box-label">
            {field.options.map((opt: string) => {
              const isSingle = field.selectionType === "single";
              const checked = true;
              return (
                <label
                  key={opt}
                  className={`step-form-checkbox-label ${checked ? "is-checked" : ""
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={true}
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
          <label
            htmlFor={field.name}
            className={`step-form-checkbox-label ${value ? "is-checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={true}
              disabled={true}
              onChange={(e) => setValue(field.name, e.target.checked)}
              id={field.name}
            />
            <span className="checkbox-custom"></span>
            {field.label}
          </label>
        </div>
      );

    case "radio":
      if (!field.options) return null;
      return (
        <div className="radio-group mt-3">
          {field.options.map((opt: string) => {
            const checked = value === opt;

            return (
              <label
                key={opt}
                className={`radio-card 
    ${checked ? "is-checked" : ""} 
    ${isDisable ? "is-disabled" : ""}
  `}
              >
                <input
                  type="radio"
                  name={field.name}
                  value={opt}
                  disabled={isDisable}
                  checked={checked}
                  onChange={() => setValue(field.name, opt)}
                />

                <span className="radio-indicator" />
                <span className="radio-label">{opt}</span>
              </label>
            );
          })}
        </div>
      );

    case "file":
      return (
        <Files
          className="files-dropzone"
          clickable={!isDisable}
          onChange={(files) => {
            // react-files returns array
            if (isDisable) return;
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
        >
          <div className="custom-input-section">
            {value ? (
              <p className="uploaded-file-form">
                <FaRegCheckCircle /> {value.name}
              </p>
            ) : (
              <span className="ms-2">
                <FiUpload /> Drag & Drop your logo or{" "}
                <span className="filepond--label-action">Browse</span>
              </span>
            )}
          </div>
        </Files>
      );

    case "preview":
      // eslint-disable-next-line no-case-declarations
      const previewSections = buildSectionPreviewData(previewJson);

      return (
        <div className="review-summary-form">
          {previewSections.map((section, sIndex) => {
  const isOpen = openSections[sIndex];

  return (
    <ul key={sIndex} className="review-section">
      {/* SECTION HEADER */}
      <h3
        className="review-section-title cursor-pointer flex justify-between items-center"
        onClick={() => toggleSection(sIndex)}
      >
        {section.title}
        <span className="ml-2">
          {isOpen ? <FaCircleChevronDown /> : <FaCircleChevronUp />}
        </span>
      </h3>

      {/* SECTION CONTENT */}
      {isOpen && (
        <>
          {section.fields.map((field, fIndex) => (
            <li
              key={fIndex}
              className={`review-item ${field.isSub ? "subfield" : ""}`}
            >
              <span className="review-key">{field.label}:</span>

              <span className="review-value">
                {Array.isArray(field.value)
                  ? field.value.join(", ")
                  : typeof field.value === "boolean"
                    ? field.value ? "Yes" : "No"
                    : typeof field.value === "object" && field.value !== null
                      ? Object.entries(field.value)
                          .map(([k, v]) => `${k}: ${v || "—"}`)
                          .join(", ")
                      : field.value || "—"}
              </span>
            </li>
          ))}
        </>
      )}
    </ul>
  );
})}

        </div>
      );


    case "checkbokwithInput": // NEW CASE
      return (
        <CheckbokwithInput
          field={field}
          value={value || {}}
          setValue={setValue}
          errors={errors}
          isDisable={isDisable}
        />
      );
    case "simplecheckbox":
      return (
        <div className="chekbox-box-simple">
          <label
            htmlFor={field.name}
            className={`step-form-simple-checkbox-label ${value ? "is-checked" : ""
              }`}
          >
            <input
              type="checkbox"
              id={field.name}
              disabled={isDisable}
              checked={!!value}
              onChange={(e) => setValue(field.name, e.target.checked)}
            />
            <span className="checkbox-custom"></span>
            <span className="chekbox-label-text">{field.label}</span>
          </label>

          {errors?.[field.name] && (
            <span className="text-red-500 text-sm">{errors[field.name]}</span>
          )}
        </div>
      );
    case "radiowithField":
      return (
        <div className="address-radio-group">
          {/* Radio buttons */}
          <div className="radio-group">
            {field.options.map((opt: string) => {
              const checked = value === opt;

              return (
                <label
                  key={opt}
                  className={`radio-card 
    ${checked ? "is-checked" : ""} 
    ${isDisable ? "is-disabled" : ""}
  `}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={opt}
                    disabled={isDisable}
                    checked={checked}
                    onChange={() => setValue(field.name, opt)}
                  />

                  <span className="radio-indicator" />
                  <span className="radio-label">{opt}</span>
                </label>
              );
            })}
          </div>

          <div className="address-subfields row">
            {field.subfields.map((sub: any) => (
              <div key={sub.name} className={`step-form-field col-md-${sub.columns || "6"}`}>

                {/* CHECKBOX */}
                {sub.type === "checkbox" ? (
                  <div className="chekbox-box-simple">
                    <label
                      htmlFor={sub.name}
                      className={`step-form-simple-checkbox-label ${sub.value ? "is-checked" : ""
                        }`}
                    >
                      <input
                        type="checkbox"
                        id={sub.name}
                        checked={!!sub.value}
                        onChange={(e) =>
                          setValue(sub.name, e.target.checked)
                        }
                      />
                      <span className="checkbox-custom"></span>
                      <span className="chekbox-label-text">
                        {sub.label}
                      </span>
                    </label>

                    {formErrors?.[sub.name] && (
                      <span className="error">
                        {formErrors[sub.name]}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    {/* NORMAL INPUT */}
                    <label>
                      {sub.label}
                      {sub.required && <span className="error">*</span>}
                    </label>

                    <input
                      type={sub.type === "number" ? "number" : "text"}
                      value={sub.value || ""}
                      onChange={(e) =>
                        setValue(sub.name, e.target.value)
                      }
                      className={`form-control ${errors?.[sub.name] ? "border-red-500" : ""
                        }`}
                    />
                    {formErrors?.[sub.name] && (
                      <span className="error">
                        {formErrors[sub.name]}
                      </span>
                    )}
                    {errors?.[sub.name] && (
                      <p className="error">{errors[sub.name]}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>


        </div>
      );

    default:
      return null;
  }
}
