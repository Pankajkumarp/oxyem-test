/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import Select from "react-select";
import { Controller } from "react-hook-form";
import { axiosJWT } from '../../../../Auth/AddAuthorization';
import Profile from '../../../commancomponents/profile';
import TemplateOneInvoice from './InvoiceTemplate/TemplateOneInvoice';
import TemplateTwoInvoice from './InvoiceTemplate/TemplateTwoInvoice';
import TemplateThreeInvoice from './InvoiceTemplate/TemplateThreeInvoice';
import TemplateFourInvoice from './InvoiceTemplate/TemplateFourInvoice';

export default function InvoiceField({ field, control, errors, dynamicId, InvoiceAllData, setValue }: any) {
  const [selectedTemplate, setSelectedTemplate] = useState(field.value || null);
  const [options, setOptions] = useState(field.option || []);
    useEffect(() => {
  if (!field.value || options.length === 0) return;

  const selectedOption = options.find(
    (opt) => opt.value === field.value
  );

  if (selectedOption) {
    setValue(field.name, selectedOption);
  }
}, [field.value, options]);
  const fetchOptions = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
        params: { isFor: value }
      });
      if (response.data.data) {
        const optionsData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setOptions(optionsData);
      }
    } catch (error) {
      console.error(error)
    }
  };
  useEffect(() => {
    if (field.documentType) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchOptions(field.documentType);
    }
  }, [field.documentType, dynamicId]);
  const Option = ({ innerProps, label, data }) => (
    <div {...innerProps} className='oxyem-react-select-custom position-relative'>
      <div className="oxyem-cus-select-section">
        <div style={{ borderRadius: '50%', margin: '4px 10px' }}>
          <Profile name={label} imageurl={data.image} size={"30"} profilelink={data.profileLink} />
        </div>
        <div className="oxyem-user-text">
          <h6><span className="main-text">{label}</span></h6>
          <p className="">
            <span className="sub-text">{data.designation}</span>
          </p>
        </div>
      </div>

    </div>
  );
  let customComponents = {};
  if (field.showImage === "yes") {
    customComponents = { Option };
  } else {
    customComponents = {};
  }
  return (
    <>
      <div className={`single-field mb-5 col-md-${field.col}`}>
        <label className="text-sm font-medium">
          {field.label} {field.validations?.length ? <span className="error-label-icon">*</span> : ""}
        </label>

        <Controller
          name={field.name}
          control={control}
          rules={{
            required: field.validations?.some((v: any) => v.type === "required")
              ? field.validations.find((v: any) => v.type === "required")?.message
              : false
          }}
          defaultValue={field.value || null}
          render={({ field: controllerField }) => (
            <Select
              {...controllerField}
              components={customComponents}
              options={options}
              placeholder={field.placeholder}
              isClearable
              classNamePrefix="react-select"
              value={
                options.find((opt: any) =>
                  opt.value ===
                  (typeof controllerField.value === "object"
                    ? controllerField.value?.value
                    : controllerField.value)
                ) || null
              }

              onChange={(selected) => {
                controllerField.onChange(selected);
                setSelectedTemplate(selected?.value);
              }}
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              styles={{
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
              }}
            />
          )}
        />

        {errors[field.name] && (
          <p className="template-one-form-error-maessage">
            {errors[field.name].message}
          </p>
        )}
      </div>
      {selectedTemplate === "classicCorporate" && (
        <TemplateOneInvoice InvoiceAllData={InvoiceAllData} />
      )}

      {selectedTemplate === "modernProfessional" && (
        <TemplateTwoInvoice InvoiceAllData={InvoiceAllData} />
      )}
      {selectedTemplate === "brandedExecutive" && (
        <TemplateThreeInvoice InvoiceAllData={InvoiceAllData} />
      )}
      {selectedTemplate === "modernCorporateGlobalRemittance" && (
        <TemplateFourInvoice InvoiceAllData={InvoiceAllData} />
      )}
    </>
  );
}
