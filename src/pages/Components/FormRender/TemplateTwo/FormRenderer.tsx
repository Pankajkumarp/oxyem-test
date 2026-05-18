"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import { FiInfo } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Tooltip } from "react-tooltip";

export default function FormRenderer({ schema, handeSubmit, sumbitStart, isFor, isPage, handleCancelClick, getAllData, submitHalfForm, InvoiceAllData }: any) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false
  });
  const extractDefaultValues = (schema) => {
  const defaults = {};

  schema.section.forEach(tab => {
    tab.sectionMain.forEach(section => {
      section.Subsection.forEach(sub => {
        sub.fields.forEach(field => {
          if (field.value !== undefined) {
            defaults[field.name] = field.value;
          }
        });
      });
    });
  });

  return defaults;
};
useEffect(() => {
  if (!schema) return;

  const defaults = extractDefaultValues(schema);

  reset(defaults);
}, [schema]);

  const allValues = useWatch({ control });
  useEffect(() => {
    getAllData(allValues);
  }, [allValues]);
  const [dynamicId, setDynamicId] = useState(null);
  const customerName = useWatch({ control, name: "customerName" });
  const fromDate = useWatch({ control, name: "invoiceStartDate" });
  const [startDate, setStartDate] = useState("");
  useEffect(() => {
    setStartDate(fromDate);
  }, [fromDate]);
  useEffect(() => {
    if (!customerName) return;
    const id =
      typeof customerName === "object"
        ? customerName.value
        : customerName;
    setDynamicId(id);
  }, [customerName]);




  const [activeTab, setActiveTab] = useState(0);



  const isSectionComplete = (section: any) => {
    const requiredFields: string[] = [];

    section.Subsection.forEach((sub: any) => {
      sub.fields.forEach((field: any) => {
        const isRequired =
          field.required ||
          field.validations?.some((v: any) => v.type === "required");

        if (isRequired) {
          requiredFields.push(field.name);
        }
      });
    });

    const values = useWatch({
      control,
      name: requiredFields
    });

    return requiredFields.every((fieldName, index) => {
      const value = values?.[index];

      const hasValue =
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0);

      const hasError = !!errors[fieldName];

      return hasValue && !hasError;
    });
  };

  const [collapsedSections, setCollapsedSections] = useState<number[]>([]);
  const getSectionStepByFieldName = (fieldName: string) => {
    for (const section of schema.section) {
      for (const sub of section.Subsection) {
        if (sub.fields.some((f: any) => f.name === fieldName)) {
          return section.step;
        }
      }
    }
    return null;
  };

  const toggleSection = (step: number) => {
    setCollapsedSections(prev =>
      prev.includes(step)
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  };

  const isCollapsed = (step: number) =>
    collapsedSections.includes(step);
  const onError = (formErrors: any) => {
    const errorSections = new Set<number>();

    Object.keys(formErrors).forEach((fieldName) => {
      const step = getSectionStepByFieldName(fieldName);
      if (step !== null) {
        errorSections.add(step);
      }
    });

    // Uncollapse sections that have errors
    setCollapsedSections((prev) =>
      prev.filter((step) => !errorSections.has(step))
    );
  };
  const handleReset = () => {
    reset();
    setCollapsedSections([]);
  };
  const currentTab = schema.section[activeTab];
    const onSubmit = (data: any) => {
    handeSubmit(data)
  };
  const getCurrentTabFieldNames = () => {
    const names: string[] = [];

    currentTab.sectionMain.forEach((section: any) => {
      section.Subsection.forEach((sub: any) => {
        sub.fields.forEach((field: any) => {
          names.push(field.name);
        });
      });
    });

    return names;
  };
  const getAllFieldNames = () => {
    const names: string[] = [];

    schema.section.forEach((tab: any) => {
      tab.sectionMain.forEach((section: any) => {
        section.Subsection.forEach((sub: any) => {
          sub.fields.forEach((field: any) => {
            names.push(field.name);
          });
        });
      });
    });

    return names;
  };

  const isTabComplete = (tabIndex: number) => {
    const tab = schema.section[tabIndex];

    // ⭐ CASE 1 — No fields (Preview tab)
    if (!tab.sectionMain || tab.sectionMain.length === 0) {

      // Check all previous tabs
      for (let i = 0; i < tabIndex; i++) {
        if (!isTabComplete(i)) return false;
      }

      return true;
    }

    // ⭐ CASE 2 — Normal Tabs
    for (const section of tab.sectionMain) {
      for (const sub of section.Subsection) {
        for (const field of sub.fields) {

          // ---------- NORMAL REQUIRED ----------
          const isRequired =
            field.required ||
            field.validations?.some((v: any) => v.type === "required");

          if (isRequired) {
            const value = allValues?.[field.name];

            const hasValue =
              value !== undefined &&
              value !== null &&
              value !== "" &&
              !(Array.isArray(value) && value.length === 0);

            const hasError = !!errors[field.name];

            if (!hasValue || hasError) return false;
          }

          // ---------- DYNAMIC LIST ----------
          if (field.type === "DynamicList") {
            const list = allValues?.[field.name];

            if (!list || list.length === 0) return false;

            for (const row of list) {
              for (const col of field.columns) {

                const colRequired =
                  col.validations?.some((v: any) => v.type === "required");

                if (!colRequired) continue;

                const val = row[col.name];

                if (
                  val === undefined ||
                  val === null ||
                  val === ""
                ) {
                  return false;
                }
              }
            }
          }

        }
      }
    }

    return true;
  };



  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="form-template-one h-100"
      >
        <div className="flex gap-2 mb-3">
          <ul className="nav-tabs nav nav-tabs-bottom nav-justified template-tab">
            {schema.section.map((tab: any, index: number) => (
              <li className="nav-item">
                                <a className={`nav-link ${activeTab === index ? "active" : ""}`}
                  onClick={async () => {
                    if (index < activeTab) {
                      setActiveTab(index);
                      return;
                    }
                    for (let i = activeTab; i < index; i++) {

                      const names: string[] = [];

                      schema.section[i].sectionMain.forEach((section: any) => {
                        section.Subsection.forEach((sub: any) => {
                          sub.fields.forEach((field: any) => {
                            names.push(field.name);
                          });
                        });
                      });
                      const valid = await trigger(names);
                      if (!valid) {
                        setActiveTab(i);
                        return;
                      }
                    }
                    setActiveTab(index);
                  }}
                >
                  <div className="skolrup-profile-tab-link">{tab.tabName}{isTabComplete(index) && (
                    <span className="tab-check">✔</span>
                  )}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {schema.section[activeTab].sectionMain.map((section: any) => (
          <div key={section.step} className="form-template-one-main-box">
            <div
              className="form-template-one-top-head cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {section.SectionName}
              </div>

              <div className="flex items-center gap-3">
                <FiInfo className="info-icon" data-tooltip-id={`form-info-${section.step}`} />

                <span className="icon-coll-template" onClick={() => toggleSection(section.step)}>
                  {isCollapsed(section.step) ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </span>
                <Tooltip
                  id={`form-info-${section.step}`}
                  className="form-section-tooltip"
                  place="top"
                  positionStrategy="fixed"
                >
                  <div>
                    <h3><strong>{section.SectionName}</strong></h3>
                    <p>{section.description}</p>
                  </div>
                </Tooltip>
              </div>
            </div>

            <div
              className={`form-template-one-input-box transition-all duration-300 overflow-hidden ${isCollapsed(section.step)
                ? "template-input-box-hide"
                : "max-h-[5000px] opacity-100"
                }`}
            >
              {section.Subsection.map((sub: any) => (
                <div key={sub.SubsectionName} className="row">
                  {sub.fields.map((field: any) => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      register={register}
                      errors={errors}
                      control={control}
                      startDate={startDate}
                      isPage={isPage}
                      dynamicId={dynamicId}
                      allValues={allValues}
                      InvoiceAllData={InvoiceAllData}
                      setValue={setValue}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

        ))}

        {/* Buttons */}
        <div className="template-one-bottom-section">
          {currentTab?.buttons?.map((btn: any) => {
            if (btn.type === "Reset") {
              return (
                <button
                  key={btn.label}
                  type="button"
                  onClick={handleReset}
                  className="btn btn-oxyem"
                >
                  {btn.label}
                </button>
              );
            }
            if (btn.type === "Next") {
              return (
                <button
                  key={btn.label}
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {

                    const fields = getCurrentTabFieldNames();
                    const valid = await trigger(fields);
                    if (!valid) return;

                    if (currentTab?.tabId === "customerInformation" || currentTab?.tabId === "lineItems") {
                      await handleSubmit((data) => {
                        submitHalfForm(data, currentTab.tabName);
                      })();
                    }

                    setActiveTab(prev =>
                      Math.min(prev + 1, schema.section.length - 1)
                    );
                  }}
                >
                  {btn.label}
                </button>
              );
            }


            if (btn.type === "Cancel") {
              return (
                <button
                  key={btn.label}
                  type="button"
                  onClick={handleCancelClick}
                  className="btn btn-oxyem"
                >
                  {btn.label}
                </button>
              );
            }

            if (btn.type === "Submit") {
              return (
                <button
                  key={btn.label}
                  type="submit"
                  className="btn btn-primary"
                  disabled={sumbitStart}

                  onClick={async () => {

                    const valid = await trigger(getAllFieldNames());

                    if (!valid) {
                      return;
                    }
                  }}
                >
                  {sumbitStart ? (
                    <div className="spinner">
                      <div className="bounce1"></div>
                      <div className="bounce2"></div>
                      <div className="bounce3"></div>
                    </div>
                  ) : (
                    btn.label
                  )}
                </button>
              );
            }
          })}
        </div>
      </form>
    </>
  );
}
