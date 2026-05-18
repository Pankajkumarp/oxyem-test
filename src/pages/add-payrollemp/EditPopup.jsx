import React, { useState, useEffect } from 'react';
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

export default function EditPopup({
    openTdsDrawer,
    setOpenTdsDrawer,
    tdsValue,
    tdsReason,
    onSubmit
}) {

    const [value, setValue] = useState(0);
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setValue(tdsValue || 0);
        setReason(tdsReason || "");
        setErrors({});
    }, [tdsValue, tdsReason, openTdsDrawer]);

    const validate = () => {
        const newErrors = {};

        if (!value || Number(value) <= 0) {
            newErrors.value = "Please enter a valid TDS amount";
        }

        if (!reason || reason.trim().length < 3) {
            newErrors.reason = "Override reason is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSubmit(value, reason);
    };

    return (
        <Drawer
            open={openTdsDrawer}
            onClose={() => setOpenTdsDrawer(false)}
            direction='right'
            className='custom-drawer'
        >
            <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold">Override TDS</h5>
                    <MdClose style={{ cursor: "pointer", fontSize: '1.2rem' }} onClick={() => setOpenTdsDrawer(false)} />
                </div>

                {/* TDS INPUT */}
                <div className="mb-3">
                    <label className="form-label">TDS Amount <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        className={`form-control`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    {errors.value && (
                        <div className="error mt-1">{errors.value}</div>
                    )}
                </div>

                {/* REASON INPUT */}
                <div className="mb-3">
                    <label className="form-label">Override Reason <span className="text-danger">*</span></label>
                    <textarea
                        className={`form-control`}
                        rows={4}
                        value={reason}
                        style={{ minHeight: '80px' }}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    {errors.reason && (
                        <div className="error mt-1">{errors.reason}</div>
                    )}
                </div>

                <button className="btn btn-primary w-100" onClick={handleSubmit}>
                    Submit Override
                </button>
            </div>
        </Drawer>
    );
}
