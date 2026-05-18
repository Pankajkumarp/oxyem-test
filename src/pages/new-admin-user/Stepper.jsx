import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

export default function Stepper({
    isCompanyIdentityDone,
    isLegalAddressDone,
    isLeaveDone,
    isAsssignModule,
    issummary,
    activeTab,
}) {

    return (
        <div className="stepper">
            <div style={{ width: "100px", maxWidth: "100px" }} className={`line ${isCompanyIdentityDone ? "active" : ""}`}></div>
            <div className={`step ${isCompanyIdentityDone ? "active" : ""} `}>
                <div className="circle">
                    {isCompanyIdentityDone && (
                        <span className="icon"><FaCheck /></span>
                    )}
                </div>
                <div className="label">Step 1: Company Identity<span className='error'>*</span></div>
            </div>
            <div className={`line ${isCompanyIdentityDone ? "active" : ""}`}></div>
            <div className={`step ${isLegalAddressDone ? "active" : ""}`}>
                <div className="circle">
                    {isLegalAddressDone && (
                        <span className="icon"><FaCheck /></span>
                    )}
                </div>
                <div className="label">Step 2: Legal & Address<span className='error'>*</span></div>
            </div>
            <div className={`line ${isLegalAddressDone ? "active" : ""}`}></div>
            <div className={`step ${isLeaveDone ? "active" : ""}`}>
                <div className="circle">
                    {isLeaveDone && (
                        <span className="icon"><FaCheck /></span>
                    )}
                </div>
                <div className="label">Step 3: Leave Configuration<span className='error'>*</span></div>
            </div>
            <div className={`line ${isLeaveDone ? "active" : ""}`}></div>
            <div className={`step ${isAsssignModule ? "active" : ""}`}>
                <div className="circle">
                    {isAsssignModule && (
                        <span className="icon">
                            <FaCheck />
                        </span>
                    )}
                </div>
                <div className="label">Step 4: Modules & Roles<span className='error'>*</span></div>
            </div>
            <div className={`line ${isAsssignModule ? "active" : ""}`}></div>
            <div className={`step ${issummary ? "active" : ""} ${!issummary && activeTab === "summary" ? "error-p" : ""}`}>
                <div className="circle">
                    {issummary ? (
                        <span className="icon"><FaCheck /></span>
                    ) : !issummary && activeTab  === "summary" ? (
                        <span className="icon"><IoMdClose /></span>
                    ) : null}
                </div>
                <div className="label">Step 5: Summary<span className='error'>*</span></div>
            </div>
            <div style={{ width: "100px", maxWidth: "100px" }} className={`line ${issummary ? "active" : ""} ${!issummary && activeTab === "summary" ? "error-p" : ""}`}></div>
        </div>
    );
}
