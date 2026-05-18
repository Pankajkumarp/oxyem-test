// components/AttendanceForm/index.tsx
"use client";

import React, { useState, useRef } from "react";
import styles from "./AttendanceForm.module.css";
import {
  CalendarIcon, ClockIcon, CheckIcon, CheckCircleIcon,
  SaveIcon, UploadCloudIcon, InfoIcon, XIcon, ChevronDownIcon,
} from "../icons";

const MAX_REMARKS = 250;

const REASON_OPTIONS = [
  "Missed Checkout",
  "Early Leave",
  "Late Entry",
  "Absent – Regularization",
  "Other",
];

export interface AttendanceFormData {
  employee: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  remarks: string;
  markApproved: boolean;
  applyAnother: boolean;
  attachment: File | null;
}

interface AttendanceFormProps {
  onSubmit?: (data: AttendanceFormData) => void;
  onCancel?: () => void;
  onSaveDraft?: (data: AttendanceFormData) => void;
}

export default function AttendanceForm({ onSubmit, onCancel, onSaveDraft }: AttendanceFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState<AttendanceFormData>({
    employee: "Sandeep Bawalia (E0012)",
    date: "30-04-2026",
    startTime: "09:14 AM",
    endTime: "06:05 PM",
    reason: "Missed Checkout",
    remarks: "Employee forgot to checkout after work.",
    markApproved: false,
    applyAnother: false,
    attachment: null,
  });

  const hoursWorked = (() => {
    try {
      const parse = (t: string) => {
        const [time, period] = t.split(" ");
        let [h, m] = time.split(":").map(Number);
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return h * 60 + m;
      };
      const diff = (parse(form.endTime) - parse(form.startTime)) / 60;
      return diff > 0 ? diff.toFixed(2) + " hrs" : "--";
    } catch {
      return "--";
    }
  })();

  const setNow = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const period = h >= 12 ? "PM" : "AM";
    const hour = (h % 12 || 12).toString().padStart(2, "0");
    setForm((f) => ({ ...f, startTime: `${hour}:${m} ${period}` }));
  };

  const useShiftEnd = () => setForm((f) => ({ ...f, endTime: "06:00 PM" }));

  const handleSubmit = () => onSubmit?.(form);
  const handleSaveDraft = () => onSaveDraft?.(form);

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>Attendance Details</div>

      <div className={styles.formGrid}>
        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className={styles.leftCol}>

          {/* Row 1: Employee + Date + Day badge */}
          <div className={styles.row3}>
            {/* Employee */}
            <div className={`${styles.fieldGroup}`}>
              <label className={styles.label}>
                Employee <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={form.employee}
                  onChange={(e) => setForm((f) => ({ ...f, employee: e.target.value }))}
                  className={styles.groupInput}
                />
                <span className={styles.groupSep} />
                <button
                  className={styles.groupBtn}
                  onClick={() => setForm((f) => ({ ...f, employee: "" }))}
                  title="Clear"
                >
                  <XIcon />
                </button>
                <span className={styles.groupSep} />
                <button className={styles.groupBtn} title="Expand">
                  <ChevronDownIcon />
                </button>
              </div>
            </div>

            {/* Date */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Date <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  className={styles.input}
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
                <span className={styles.inputIcon}><CalendarIcon /></span>
              </div>
            </div>

            {/* Day badge */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>&nbsp;</label>
              <div className={styles.weekdayBadge}>
                <span className={styles.weekdayLabel}>Weekday</span>
                <span className={styles.weekdayDay}>Thursday</span>
              </div>
            </div>
          </div>

          {/* Row 2: Start Time + Now + End Time + Use Shift End */}
          <div className={styles.timeRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Start Time <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  className={styles.input}
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                />
                <span className={styles.inputIcon}><ClockIcon /></span>
              </div>
            </div>

            <div className={styles.btnAlignBottom}>
              <button className={styles.btnNow} onClick={setNow}>Now</button>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                End Time <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  className={styles.input}
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                />
                <span className={styles.inputIcon}><ClockIcon /></span>
              </div>
            </div>

            <div className={styles.btnAlignBottom}>
              <button className={styles.btnShiftEnd} onClick={useShiftEnd}>
                Use Shift End
              </button>
            </div>
          </div>

          {/* Row 3: Hours + Reason */}
          <div className={styles.row2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Number of Hours Worked</label>
              <div className={styles.hoursField}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.inputMuted}`}
                  value={hoursWorked}
                  readOnly
                />
                <span className={styles.badgeAuto}>Auto calculated</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Reason <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              >
                {REASON_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Remarks */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Remarks <span className={styles.required}>*</span>
            </label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={form.remarks}
              maxLength={MAX_REMARKS}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
            />
            <div className={styles.charCount}>
              {form.remarks.length}/{MAX_REMARKS}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────── */}
        <div className={styles.rightCol}>
        </div>
      </div>

      {/* Mark as Approved */}
      <div className={styles.approveRow}>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={form.markApproved}
            onChange={(e) => setForm((f) => ({ ...f, markApproved: e.target.checked }))}
          />
          <span className={styles.checkText}>Mark as Approved instantly</span>
          <InfoIcon />
          <span className={styles.checkSub}>(Admin override – no further approval required)</span>
        </label>
      </div>

      {/* Footer */}
      <div className={styles.formFooter}>
        <button className={styles.btnCancel} onClick={onCancel}>
          Cancel
        </button>

        <div className={styles.footerRight}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.applyAnother}
              onChange={(e) => setForm((f) => ({ ...f, applyAnother: e.target.checked }))}
            />
            <span style={{ fontSize: 13, color: "#6b7280" }}>Apply for another day</span>
          </label>

          <button className={styles.btnDraft} onClick={handleSaveDraft}>
            <SaveIcon />
            Save as Draft
          </button>

          <button className={styles.btnSubmit} onClick={handleSubmit}>
            <CheckIcon />
            Submit &amp; Approve
          </button>
        </div>
      </div>
    </div>
  );
}
