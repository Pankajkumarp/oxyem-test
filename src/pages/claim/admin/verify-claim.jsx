'use client'
import { FaCheck } from "react-icons/fa6";
import DocumentsEvidence from "./DocumentsEvidence";
import ClaimlistComponent from '../../Components/Claim/Education';
import FileUpload from './FileUpload';
import Select from 'react-select';
import React, { useEffect, useState } from 'react'
import { BiError, BiCheckCircle } from "react-icons/bi";
import { VscError } from "react-icons/vsc";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { Card } from "react-bootstrap";
import { useRouter } from 'next/router';
import { format } from "date-fns";

export default function VerifyClaimPage({ claimDetails, claimAdmin, claimid, handleSubmit, isfor }) {
        const formatDate = (dateStr) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return isNaN(d) ? "" : format(d, "MMM yyyy");
        };
    const [reasonOptions, setReasonOptions] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                    params: { isFor: 'Claim_Reason' }
                });
                const optionsData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                }));

                setReasonOptions(optionsData);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);
    const currentstatus = claimDetails?.status
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\s+/g, '_');


    const stepOrder = {
        submitted: 1,
        info_req: 1,
        verified: 2,
        approved: 3,
        paid: 4,
    };

    const currentStep = stepOrder[currentstatus] || 0;

    const formdata = claimAdmin?.formdata || [];
    const getFieldValue = (row, fieldName) =>
        row.find(item => item.name === fieldName)?.value;

    let totalClaims = formdata.length;
    let paidCount = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let rejectedCount = 0;
    let pendingCount = 0;
    formdata.forEach(row => {
        const status = getFieldValue(row, 'status')?.toLowerCase();

        // Paid
        if (status === 'paid') {
            paidCount++;
        }

        // Rejected
        if (status === 'rejected') {
            rejectedCount++;
        }

        // Pending (submitted + verified)
        if (['submitted', 'verified'].includes(status)) {
            pendingCount++;
        }
    });
    const [reason, setReason] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});
    const validateForm = (actionType) => {
        const newErrors = {};

        // Comment required for ALL actions
        if (!comment.trim()) {
            newErrors.comment = 'Comment is required';
        }

        // Reason required ONLY for addnlinfo & reject
        if (['addnlinfo', 'reject'].includes(actionType) && !reason) {
            newErrors.reason = 'Reason is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const [verifyAmount, setVerifyAmount] = useState(500);
    const handleAction = (actionType) => {
        if (!validateForm(actionType)) return;

        const payload = {
            ...(actionType === 'addnlinfo'
                ? { actionFor: actionType }
                : { action: actionType }
            ),
            idClaim:
                actionType === 'addnlinfo'
                    ? claimid
                    : [claimid],

            ...(actionType === 'verified' && {
                verifiedAmount: verifyAmount,
            }),

            ...(actionType === 'addnlinfo' && {
                status: "RequiredAddInfo",
            }),
        };
        if (['addnlinfo', 'reject'].includes(actionType)) {
            payload.reason = reason?.value;
        }
        if (comment?.trim()) {
            payload.comment = comment;
        }
        handleSubmit(payload)
    };
    const validateRecallForm = () => {
        const newErrors = {};

        // Comment required for ALL actions
        if (!comment.trim()) {
            newErrors.comment = 'Comment is required';
        }
        if (documents.length === 0) {
            newErrors.documents = 'Document is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleRecallAction = (actionType) => {
        if (!validateRecallForm(actionType)) return;

        const payload = {
            actionFor: actionType,
            idClaim: claimid,
            status: "infoprovided",
            documents
        };
        if (comment?.trim()) {
            payload.comment = comment;
        }
        handleSubmit(payload)
    };
    const handleActionCancel = () => {
        if (isfor === "employee") {
            router.push(`/claim`);
        } else {
            router.push(`/claim/admin`);
        }
    };







    const handleReasonChange = (selectedOption) => {
        setReason(selectedOption);
        setErrors(prev => ({ ...prev, reason: null }));
    };
    const handleCommentChange = (e) => {
        setComment(e.target.value);
        setErrors(prev => ({ ...prev, comment: null }));
    };
    const handleVerifyAmountChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, '');
        if (value === '') {
            setVerifyAmount(1);
            return;
        }

        const numericValue = Number(value);
        if (numericValue < 1) {
            setVerifyAmount(1);
            return;
        }

        setVerifyAmount(numericValue);
    };
    return (
        <div className="verfiy-view-container" >

            <div className="row">
                {/* Left Column */}
                <div className="col-lg-8">
                    <div className="verify-claim-view-card verify-claim-stepper">
                        <div className="card-body d-flex align-items-center">
                            <div className="stepper">
                                <div className={`line ${currentStep >= 1 ? "active" : ""}`} style={{ maxWidth: 85 }} />

                                <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                                    <div className="circle">
                                        {currentStep >= 1 && <FaCheck />}
                                    </div>
                                    <div className="label">Step 1: Submitted</div>
                                </div>

                                <div className={`line ${currentStep >= 2 ? "active" : ""}`} />

                                <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                                    <div className="circle">
                                        {currentStep >= 2 && <FaCheck />}
                                    </div>
                                    <div className="label">Step 2: Verified</div>
                                </div>

                                <div className={`line ${currentStep >= 3 ? "active" : ""}`} />

                                <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                                    <div className="circle">
                                        {currentStep >= 3 && <FaCheck />}
                                    </div>
                                    <div className="label">Step 3: Approved</div>
                                </div>

                                <div className={`line ${currentStep >= 4 ? "active" : ""}`} />

                                <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
                                    <div className="circle">
                                        {currentStep >= 4 && <FaCheck />}
                                    </div>
                                    <div className="label">Step 4: Paid</div>
                                </div>

                                <div className={`line ${currentStep >= 4 ? "active" : ""}`} style={{ maxWidth: 85 }} />
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="verfiy-claim-main-box h-100">
                                <h6 className="verfiy-claim-box-heading">Claim Summary</h6>
                                <div className="verify-claim-view-card view-card-summary">
                                    <div className="card-body">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-flex justify-content-between"><span className="verfiy-claim-color-b">Claim Number</span><span className="verfiy-claim-color-b">{claimDetails?.claimNumber}</span></li>
                                            <li className="d-flex justify-content-between"><span>Claim Month</span><span>{formatDate(claimDetails?.submittedDate)}</span></li>
                                            <li className="d-flex justify-content-between"><span>Claim Date</span><span>{claimDetails?.submittedDate}</span></li>
                                            <li className="d-flex justify-content-between"><span>Submitted By</span><span className="text-capitalize">{claimDetails?.submittedBy}</span></li>
                                            <li className="d-flex justify-content-between"><span>Claim Type</span><span>{claimDetails?.claimName}</span></li>
                                            <li className="d-flex justify-content-between"><span>Claimed Amount</span><span className="verfiy-claim-color-b">{claimDetails?.currsymbol} {claimDetails?.claimAmount}</span></li>
                                            <li className="d-flex justify-content-between"><span>Approved Amount</span><span className="verfiy-claim-color-g">{claimDetails?.currsymbol} {claimDetails?.verifiedAmount || 0}</span></li>
                                            <li className="d-flex justify-content-between"><span>Status</span><span className={`oxyem-mark-${claimDetails?.status}`}>{claimDetails?.status}</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <h6 className="verfiy-claim-box-heading">Documents & Evidence</h6>
                                <div className="verify-claim-view-card verify-claim-view-docc">
                                    <DocumentsEvidence documents={claimDetails?.documents || []} />

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="verfiy-claim-main-box h-100">
                                <h6 className="verfiy-claim-box-heading">Verification & Decision</h6>
                                <div className="verify-claim-view-card">
                                    <div className="card-body">

                                        <p className={"top-verify-amount-section"}><span><strong>Verify Amount:</strong></span>{currentstatus === "submitted" && isfor !== "employee" ? (
                                            <input
                                                type="number"
                                                className="input-claim-add"
                                                value={verifyAmount}
                                                min={1}
                                                step="1"
                                                onChange={handleVerifyAmountChange}
                                                onKeyDown={(e) => {
                                                    if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />

                                        ) : (<span className="verfiy-claim-color-g">{claimDetails?.currsymbol} {claimDetails?.verifiedAmount || 0}</span>)}</p>
                                        {currentstatus === "paid" && (
                                            <div className="alert alert-success py-2 small class-for-icon di d-flex">
                                                <BiCheckCircle style={{ fontSize: '1.6rem' }} /> This claim has been successfully reviewed, processed, and settled in accordance with company policy.
                                            </div>
                                        )}
                                        {currentstatus === "paid" ? (null) : (
                                            <>
                                                {currentstatus === "approved" ? (
                                                    <div className="alert alert-success py-2 small class-for-icon di d-flex">
                                                        <BiCheckCircle style={{ fontSize: '1.6rem' }} />
                                                        {isfor === "employee" ? (<>The claim has been successfully approved. Payment will be processed shortly.</>) : (<>This claim has completed verification and approval. It is ready for payment settlement.</>)}
                                                    </div>
                                                ) : (
                                                    <>
                                                        {claimDetails?.isDuplicateInvoice ? (
                                                            <div className="alert alert-warning py-2 small class-for-icon">
                                                                <BiError /> Duplicate claim detected
                                                            </div>) : null}
                                                        {claimDetails?.claimInfo === "" || claimDetails?.claimInfo === undefined  ? (null):(
                                                            <div className="alert alert-danger py-2 small class-for-icon d-flex">
                                                                <VscError className="me-2" />  <div
                                                                    dangerouslySetInnerHTML={{ __html: claimDetails?.claimInfo }}
                                                                />
                                                            </div>
                                                            ) }
                                                    </>
                                                )}
                                                {currentstatus === "approved" ? (null) : (
                                                    <>
                                                        {isfor === "employee" ? (null) : (
                                                            <div className="mb-3">
                                                                <label className="form-label">Reason</label>
                                                                <Select
                                                                    options={reasonOptions}
                                                                    value={reason}
                                                                    onChange={handleReasonChange}
                                                                    placeholder="Select reason"
                                                                    classNamePrefix="react-select"
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

                                                                {errors.reason && (
                                                                    <small className="text-danger">{errors.reason}</small>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {isfor === "employee" &&
                                                    (currentstatus === "recalled" || currentstatus === "info_req") && (
                                                        <div className="input-claim-file-field">
                                                            <FileUpload
                                                                field={{
                                                                    name: "documents",
                                                                    label: "Upload Documents",
                                                                    required: true,
                                                                    col: 12,
                                                                }}
                                                                isfor={isfor}
                                                                error={errors.documents}
                                                                onChange={(files) => {
                                                                    setDocuments(files);
                                                                    if (files.length > 0) {
                                                                        setErrors((prev) => ({ ...prev, documents: null }));
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                {isfor === "employee" && currentstatus === "approved" ? (null) : (
                                                    <>
                                                        <div className="mb-3">
                                                            <label className="form-label">Additional Comments</label>

                                                            <textarea
                                                                className={`form-control form-control-sm ${errors.comment ? 'is-invalid-r' : ''
                                                                    }`}
                                                                value={comment}
                                                                onChange={handleCommentChange}
                                                            />

                                                            {errors.comment && (
                                                                <small className="text-danger">{errors.comment}</small>
                                                            )}
                                                        </div>

                                                        <div className="d-flex justify-content-end gap-2">
                                                            <div className="d-flex gap-2">
                                                                {claimDetails?.buttons
                                                                    ?.filter(btn => btn.isEnable)
                                                                    ?.map((btn, index) => {
                                                                        const type = btn.type.toLowerCase();

                                                                        if (type === 'cancel') {
                                                                            return (
                                                                                <button key={index} className="btn btn-oxyem" onClick={() => handleActionCancel('cancel')}>
                                                                                    {btn.type}
                                                                                </button>
                                                                            );
                                                                        }

                                                                        if (type === 'verify') {
                                                                            return (
                                                                                <button key={index} className="btn btn-primary" onClick={() => handleAction('verified')}>
                                                                                    {btn.type}
                                                                                </button>
                                                                            );
                                                                        }
                                                                        if (type === 'reject') {
                                                                            return (
                                                                                <button key={index} className="btn btn-oxyem" onClick={() => handleAction('rejected')}>
                                                                                    {btn.type}
                                                                                </button>
                                                                            );
                                                                        }
                                                                        if (type === 'approve') {
                                                                            return (
                                                                                <button key={index} className="btn btn-primary" onClick={() => handleAction('approved')}>
                                                                                    {btn.type}
                                                                                </button>
                                                                            );
                                                                        }
                                                                        if (type === "paid") {
                                                                            return (
                                                                                <button key={index} className="btn btn-primary" onClick={() => handleAction('paid')}>
                                                                                    {btn.type}
                                                                                </button>
                                                                            );
                                                                        }
                                                                        if (type === "recalled") {
                                                                            return (
                                                                                <button key={index} className="btn btn-primary" onClick={() => handleAction('recalled')}>
                                                                                    {btn.type}
                                                                                </button>
                                                                            );
                                                                        }
                                                                        if (type === "submit") {
                                                                            return (
                                                                                <button key={index} className="btn btn-primary" onClick={() => handleRecallAction('addnlinfo')}>
                                                                                    {btn.type}
                                                                                </button>
                                                                            );
                                                                        }
                                                                        if (type === "add. info provided") {
                                                                            return (
                                                                                <button key={index} className="btn btn-primary" onClick={() => handleRecallAction('addnlinfo')}>
                                                                                    {btn.type}
                                                                                </button>
                                                                            );
                                                                        }

                                                                        return (
                                                                            <button key={index} className="btn btn-oxyem" onClick={() => handleAction("addnlinfo")}>
                                                                                {btn.type}
                                                                            </button>
                                                                        );
                                                                    })}
                                                            </div>


                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <h6 className="verfiy-claim-box-heading">History & Comments</h6>
                                {claimDetails?.actionDetails?.length > 0 ? (
                                    <div className="verify-claim-view-card verify-claim-view-histroy">
                                        <div className="card-body">
                                            {claimDetails.actionDetails.map((action, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-light-histroy"
                                                >
                                                    <p className="top-head-of-comment"> <strong>{action.actionBy}</strong>{' '}
                                                        <span>{action.status} on {action.actionOn}</span>
                                                    </p>
                                                    <p className="bottom-of-comment">{action.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="verify-claim-view-card">
                                        <div className="card-body">
                                            No previous History Found.
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="verfiy-claim-main-box h-100">
                        <h6 className="verfiy-claim-box-heading">Claim Insights</h6>
                        <div className="verify-claim-view-card box-for-verfiy-mian-b">
                            <div className="card-body box-for-verfiy-mian">

                                <div className="box-for-verfiy total-claim-verfied-s">
                                    <p>{totalClaims || 0}</p>
                                    <h3>Total Claim</h3>

                                </div>
                                <div className="box-for-verfiy paid-claim-verfied-s">
                                    <p>{paidCount}</p>
                                    <h3>Paid</h3>

                                </div>
                                <div className="box-for-verfiy pending-claim-verfied-s">
                                    <p>{pendingCount}</p>
                                    <h3>Pending</h3>

                                </div>
                            </div>
                        </div>
                        <h6 className="verfiy-claim-box-heading">Recent Activity</h6>
                        <div className="verify-claim-view-card">
                            <ClaimlistComponent
                                allData={claimAdmin}
                                activeTab="claimAdmin"
                            />
                        </div>
                        <Card className="shadow-sm mb-0 border-0 cx-card-box">
                            <Card.Body>
                                <h6 className="fw-bold mb-3">Quick Tips</h6>

                                <ul className="list-unstyled ps-1">
                                    <li className="mb-2">
                                        <span className="li-icon">✅</span> <span className="li-text"><b>Submit original, legible receipts </b>showing vendor name, date, and amount.</span>
                                    </li>
                                    <li className="mb-2">
                                        <span className="li-icon">✅</span> <span className="li-text"><b>Claim only eligible expenses </b>as per company policy and approved categories.</span>
                                    </li>
                                    <li className="mb-2">
                                        <span className="li-icon">✅</span> <span className="li-text"><b>Submit claims within the allowed period </b>from the expense date.</span>
                                    </li>

                                    <li className="mb-2">
                                        <span className="li-icon">✅</span> <span className="li-text"><b>Duplicate or split claims are strictly prohibited</b> and will be rejected.</span>
                                    </li>
                                </ul>

                                <div className="alert alert-success p-2 small cx-alert">
                                    ✔ All entries must comply with the claim policy to avoid rejection.
                                    <div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
