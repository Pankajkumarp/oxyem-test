'use client';
import React, { useState } from 'react';
import { FaRegFileAlt, FaHashtag, FaCalendarAlt, FaStar, FaListUl, FaCheckSquare } from 'react-icons/fa';
import { IoArrowUpOutline, IoArrowDownOutline } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import FormPreview from './FormPreview';
import ShareSection from './ShareSection';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { axiosJWT } from '../Auth/AddAuthorization';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { ToastNotification } from '../Components/EmployeeDashboard/Alert/ToastNotification';


const typeMap = {
  text: { icon: <FaRegFileAlt />, label: 'Text' },
  number: { icon: <FaHashtag />, label: 'Number' },
  date: { icon: <FaCalendarAlt />, label: 'Date' },
  rating: { icon: <FaStar />, label: 'Rating' },
  select: { icon: <FaListUl />, label: 'Select' },
  singleCheckbox: { icon: <FaCheckSquare />, label: 'Checkbox' },
  textarea: { icon: <FaCheckSquare />, label: 'Textarea' },
};

export default function Index() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [jsonString, setJsonString] = useState('');
  const [errors, setErrors] = useState({ title: false, fields: [] });
  const [roleid, setRoleid] = useState(null);

  const router = useRouter();

  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: '',
      required: false,
      options: (type === 'select' || type === 'singleCheckbox') ? [''] : [],
      max: type === 'rating' ? 5 : undefined,
      selected: null,
      value: ""
    };
    setFields((prev) => [...prev, newField]);
  };

  const updateLabel = (i, v) => {
    const u = [...fields];
    u[i].label = v;
    setFields(u);

    // 🔹 Clear error for this specific field when fixed
    if (errors.fields[i] && v.trim()) {
      const newErrors = { ...errors };
      newErrors.fields[i] = false;
      setErrors(newErrors);
    }
  };

  const toggleRequired = (i) => {
    const u = [...fields];
    u[i].required = !u[i].required;
    setFields(u);
  };

  const removeField = (i) => {
    const u = [...fields];
    u.splice(i, 1);
    setFields(u);
  };

  const moveField = (from, to) => {
    if (to < 0 || to >= fields.length) return;
    const u = [...fields];
    const [mv] = u.splice(from, 1);
    u.splice(to, 0, mv);
    setFields(u);
  };

  const updateOption = (fi, oi, v) => {
    const u = [...fields];
    u[fi].options[oi] = v;
    setFields(u);
  };

  const addOption = (fi) => {
    const u = [...fields];
    u[fi].options.push('');
    setFields(u);
  };

  const removeOption = (fi, oi) => {
    const u = [...fields];
    u[fi].options.splice(oi, 1);
    setFields(u);
  };

  const generateJson = () => {
    const payload = {
      title,
      fields: fields.map((f) => ({
        id: f.id,
        type: f.type,
        label: f.label,
        required: f.required,
        options: f.options,
        value:
          f.type === 'singleCheckbox'
            ? f.selected != null
              ? f.options[f.selected]
              : null
            : null,
      })),
    };
    setJsonString(JSON.stringify(payload, null, 2));
  };

  const handelRoleChange = (selectedOption) => {
    setRoleid(selectedOption.value);
  };

  const hendelSubmit = async () => {
    if (!roleid) return;

    generateJson();

    try {
      const payload = {
        role: roleid,
        formData: JSON.parse(jsonString)
      };
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.post(`${apiUrl}/feedback/add`, payload);

      if (response.status === 200) {
        if(response){
          ToastNotification({ message: 'Feedback form created successfully' });
        }
        router.push('/feedback');
      }
    } catch (error) {
      ToastNotification({ message: 'Error submitting form' });
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs maintext={"Create Form"} />
          <div className="container py-2">
            <div className="bg-light p-4 rounded shadow-sm">

              {/* 🔹 Step Indicator */}
              <div className="d-flex justify-content-between mb-4">
                {['Create Form', 'Preview', 'Share'].map((label, index) => (
                  <div key={index} className="text-center flex-fill">
                    <div
                      className={`rounded-circle mx-auto mb-2 ${
                        currentStep >= index + 1
                          ? 'btn-primary text-white'
                          : 'bg-secondary text-light'
                      }`}
                      style={{
                        width: 40,
                        height: 40,
                        lineHeight: '40px',
                        fontWeight: 'bold'
                      }}
                    >
                      {index + 1}
                    </div>
                    <small>{label}</small>
                  </div>
                ))}
              </div>

              {/* 🔹 Step 1: Builder */}
              {currentStep === 1 && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Form Title</label>
                    <input
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        // Clear error for title when fixed
                        if (errors.title && e.target.value.trim()) {
                          setErrors(prev => ({ ...prev, title: false }));
                        }
                      }}
                    />
                    {errors.title && <div className="text-danger">Form title is required</div>}
                  </div>

                  {/* Fields */}
                  <form>
                    {fields.map((f, i) => (
                      <div key={i} className="mb-4 p-3 border rounded bg-white shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold">{typeMap[f.type]?.label}</span>
                          <div className="d-flex gap-2">
                            <span onClick={() => moveField(i, i - 1)}>
                              <IoArrowUpOutline size={22} style={{ cursor: 'pointer' }} />
                            </span>
                            <span onClick={() => moveField(i, i + 1)}>
                              <IoArrowDownOutline size={22} style={{ cursor: 'pointer' }} />
                            </span>
                            <span onClick={() => removeField(i)}>
                              <RiDeleteBin6Line size={22} style={{ cursor: 'pointer' }} />
                            </span>
                          </div>
                        </div>


                        <input
                          className={`form-control mb-2 ${errors.fields[i] ? 'is-invalid' : ''}`}
                          placeholder="Enter label"
                          value={f.label}
                          onChange={(e) => updateLabel(i, e.target.value)}
                        />
                        {errors.fields[i] && <div className="text-danger">Label is required</div>}

                        {(f.type === 'select' || f.type === 'singleCheckbox') && (
                          <div className="mb-2">
                            {f.options.map((o, j) => (
                              <div key={j} className="d-flex align-items-center gap-2 mb-1">
                                <input
                                  className="form-control"
                                  placeholder={`Option ${j + 1}`}
                                  value={o}
                                  onChange={(e) => updateOption(i, j, e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => removeOption(i, j)}
                                >
                                  −
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => addOption(i)}
                            >
                              ＋ Add Option
                            </button>
                          </div>
                        )}

                        <div className="text-end mb-4">
                          <label htmlFor={`switch-${i}`} className="me-2">
                            Required
                          </label>
                          <span className="form-switch d-inline-block">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              role="switch"
                              id={`switch-${i}`}
                              checked={f.required}
                              onChange={() => toggleRequired(i)}
                            />
                          </span>
                        </div>
                      </div>
                    ))}
                  </form>

                  {/* Add Fields */}
                  <div className="mb-4">
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {['text', 'number', 'rating', 'select', 'singleCheckbox', 'date' ,'textarea'].map(
                        (type) => (
                          <button
                            key={type}
                            className="btn btn-outline-secondary"
                            onClick={() => addField(type)}
                          >
                            {type === 'singleCheckbox'
                              ? 'Checkbox'
                              : type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && <FormPreview data={{ title, fields }} />}
              {currentStep === 3 && <ShareSection handelRoleChange={handelRoleChange} />}

              {/* 🔹 Step Footer Buttons */}
              <div className="mt-4 text-end">
                {currentStep === 1 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      let hasError = false;
                      const newErrors = { title: false, fields: [] };

                      if (!title.trim()) {
                        newErrors.title = true;
                        hasError = true;
                      }

                      newErrors.fields = fields.map(f => {
                        if (!f.label.trim()) {
                          hasError = true;
                          return true;
                        }
                        return false;
                      });

                      setErrors(newErrors);

                      if (hasError) return;
                      setCurrentStep(2);
                    }}
                    disabled={fields.length === 0}
                  >
                    Preview
                  </button>
                )}

                {currentStep === 2 && (
                  <>
                    <button className="btn btn-secondary me-2" onClick={() => setCurrentStep(1)}>
                      Back to Builder
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        generateJson();
                        setCurrentStep(3);
                      }}
                    >
                      Share
                    </button>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <button className="btn btn-secondary me-2" onClick={() => setCurrentStep(2)}>
                      Back to Preview
                    </button>
                    <button className="btn btn-success" onClick={hendelSubmit} disabled={!roleid}>
                      Submit
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
