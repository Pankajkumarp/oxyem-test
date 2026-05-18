"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import { FiInfo } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { useLeaveSummary } from "./hooks/useLeaveSummary";
import LeavePopup from "../../Popup/Leavepmodal";
import { calculateWorkingHours, getDayType } from "./utils/time";
import { axiosJWT } from "../../../Auth/AddAuthorization";
import { fetchEmployeeAttendance } from "./utils/attendance";

export default function FormRenderer({ schema, handeSubmit, sumbitStart, isFor, isPage, onClickGetEmployeeId, handleCancelClick, onClickGetDateInfo }: any) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false
  });

  const idEmployee = useWatch({ control, name: "idEmployee" });
  const leaveType = useWatch({ control, name: "leaveType" });
  const fromDate = useWatch({ control, name: "fromDate" });
  const toDate = useWatch({ control, name: "toDate" });
  const startTime = useWatch({ control, name: "startTime" });
  const endTime = useWatch({ control, name: "endTime" });
  const attendancedate = useWatch({ control, name: "attendancedate" });
  const [startDate, setStartDate] = useState("");
  useEffect(() => {
    setStartDate(fromDate);
  }, [fromDate]);
  useEffect(() => {
    if (isFor === "applyLeave") {
      onClickGetDateInfo(fromDate, toDate)
    }
  }, [fromDate, toDate]);
  useEffect(() => {
    if (isPage === "admin") {
      onClickGetEmployeeId(idEmployee)
    }
    if (isFor === "applyAttandance") {
      onClickGetEmployeeId(idEmployee)
    }

  }, [idEmployee]);

  
  const {
    apiMessage,
    clearApiMessage,
    popupdata,
    isModalOpeninput,
    handleApplyLossOfPay,
    handleCancelLossOfPay
  } = useLeaveSummary({
    isFor,
    isPage,
    idEmployee,
    leaveType,
    fromDate,
    toDate,
    setValue
  });
useEffect(() => {

  if (startTime && endTime) {

    const totalHours =
      calculateWorkingHours(
        startTime,
        endTime
      );
    setValue(
      "numberOfHrsworked",
      totalHours,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      }
    );
  }

}, [startTime, endTime, setValue]);

useEffect(() => {

  if (startTime && endTime) {

    const totalHours =
      calculateWorkingHours(
        startTime,
        endTime
      );
    setValue(
      "numberOfHrsworked",
      totalHours,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      }
    );
  }

}, [startTime, endTime, setValue]);
useEffect(() => {

  if (attendancedate) {

    const cheakDate =
      getDayType(
        attendancedate
      );
    setValue(
      "weekdayOrWeekend",
      cheakDate,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      }
    );
  }

}, [attendancedate, setValue]);

useEffect(() => {

  const loadAttendance = async () => {

    if (
      idEmployee &&
      attendancedate
    ) {

      const attendanceData =
        await fetchEmployeeAttendance({
          idEmployee,
          attendancedate,
        });

      if (attendanceData) {

        setValue(
          "startTime",
          attendanceData.startTime,
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          }
        );

        setValue(
          "endTime",
          attendanceData.endTime,
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          }
        );
        setValue(
          "numberOfHrsworked",
          attendanceData.totalHours,
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          }
        );
        setValue(
          "remarks",
          attendanceData.remarks,
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          }
        );
        setValue(
          "reason",
          attendanceData.reason,
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          }
        );
      }
    }
  };

  loadAttendance();

}, [
  idEmployee,
  attendancedate,
  setValue,
]);

  const onSubmit = (data: any) => {
    handeSubmit(data)
  };
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
  const lastSection = schema.section[schema.section.length - 1];
  return (
    <>
      <LeavePopup
        open={isModalOpeninput}
        popupdata={popupdata}
        conformRequest={handleApplyLossOfPay}
        handleCancel={handleCancelLossOfPay}
      />
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="form-template-one"
      >
        {apiMessage && (
          <div className="alert alert-danger alert-dismissible fade show mt-3 mb-3" role="alert">
            {apiMessage}

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={clearApiMessage}
            ></button>
          </div>
        )}



        <h1 className="template-main-heading">{schema.pageTitle}</h1>

        {schema.section.map((section: any) => (
          <div key={section.step} className="form-template-one-main-box">
            <div
              className="form-template-one-top-head cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={`form-template-one-badge ${isSectionComplete(section) ? "form-template-badge-dark" : "form-template-badge-light"}`}>
                  {section.step}
                </span>
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
                      leaveType={leaveType}
                      startDate={startDate}
                      startTime={startTime}
                      endTime={endTime}
                      isPage={isPage}
                      idEmployee={idEmployee}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

        ))}

        {/* Buttons */}
        <div className="template-one-bottom-section">
          {lastSection?.buttons?.map((btn: any) => {
            // 🔹 RESET BUTTON
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

            const isSubmit = btn.type === "Submit";

            return (
              <button
                key={btn.label}
                type={isSubmit ? "submit" : "button"}
                className={
                  isSubmit ? "btn btn-primary" : "btn btn-oxyem"
                }
                disabled={isSubmit && sumbitStart}
              >
                {isSubmit && sumbitStart ? (
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
          })}
        </div>
      </form>
    </>
  );
}
