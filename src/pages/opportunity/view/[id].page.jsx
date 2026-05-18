import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import { FaTimes } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import OpportunityRender from './opportunityRender.js';
import InsightRender from "./InsightRender";
import { LuBrainCircuit } from "react-icons/lu";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Tooltip } from "react-tooltip";
import { IoArrowBackOutline } from "react-icons/io5";

const Notes = dynamic(() => import('../../Components/Popup/Notes'), {
    ssr: false
});

export default function opportunity() {

    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [allData, setAllData] = useState(null);
    const [dataStatus, setDataStatus] = useState("");
    const [opportunityId, setOpportunityId] = useState("");
    const [aiRisks, setAiRisks] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = router.query;
    const [rolesByUnit, setRolesByUnit] = useState({});
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ) {
                setShowPopup(false);
            }
        };

        if (showPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup]);
    const fetchOpportunityInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/opportunity/view`, { params: { id: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setAllData(fetchedData)
                    setDataStatus(fetchedData.status)
                }
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        const { id } = router.query;
        fetchOpportunityInfo(id);
        setOpportunityId(id)
    }, [id]);

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const openNotesModal = async () => {
        setIsNotesModalOpen(true)
    }
    const closeNotesModal = async () => {
        setIsNotesModalOpen(false)
    }
    const handleWonClick = async () => {
        const payload = {
            status: "won",
            id: id
        }
        const response = await axiosJWT.post(`${apiUrl}/opportunity/update`, payload);
        if (response) {
            const message = 'You have successfully Change Status <strong>Won</strong>!';
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <FaRegCheckCircle style={{
                        fontSize: '35px',
                        marginRight: '10px',
                        color: '#4caf50'
                    }} />
                    <span dangerouslySetInnerHTML={{ __html: message }}></span>
                    <button
                        onClick={() => toast.dismiss(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#4caf50',
                            marginLeft: 'auto',
                            cursor: 'pointer',
                            fontSize: '20px',
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            ), {
                icon: null, // Disable default icon
                duration: 7000,
                style: {
                    border: '1px solid #4caf50',
                    padding: '8px',
                    color: '#4caf50',
                },
            });
            router.push(`/opportunity/view`);
        }
    }
    const handleLossClick = async () => {
        const payload = {
            status: "loss",
            id: id
        }
        const response = await axiosJWT.post(`${apiUrl}/opportunity/update`, payload);
        if (response) {
            const message = 'You have successfully Change Status <strong>Loss</strong>!';
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <FaRegCheckCircle style={{
                        fontSize: '35px',
                        marginRight: '10px',
                        color: '#4caf50'
                    }} />
                    <span dangerouslySetInnerHTML={{ __html: message }}></span>
                    <button
                        onClick={() => toast.dismiss(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#4caf50',
                            marginLeft: 'auto',
                            cursor: 'pointer',
                            fontSize: '20px',
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            ), {
                icon: null, // Disable default icon
                duration: 7000,
                style: {
                    border: '1px solid #4caf50',
                    padding: '8px',
                    color: '#4caf50',
                },
            });
            router.push(`/opportunity/view`);
        }
    }

    if (!allData) return null;
    const { summaryInfo, status } = allData;
    const buildAIContext = (data) => {
        if (!data) return "";

        const oppInfo = data.summaryInfo?.["Opportunity  Information"] || {};
        const resourceInfo = data.summaryInfo?.["Resource  Information"] || {};
        const costInfo = data.summaryInfo?.["Financial  Information USD"] || {};
        const totalCost = data.summaryInfo?.total?.totalCost || "0";
        const roleAssign = data.dataEffort || [];
        const roleNames = [
            ...new Set(
                roleAssign
                    .map(item => rolesByUnit[item.Unit]?.[item.role])
                    .filter(Boolean)
            )
        ];
        const startDate = oppInfo["Start Date"];
        const endDate = oppInfo["End Date"];
        const location = oppInfo["Location"];

        const durationText =
            startDate && endDate
                ? `${startDate} to ${endDate}`
                : "Multiple months";

        const effort = resourceInfo["Person Days"] || "Unknown";
        const resources = resourceInfo["Resource  Information"] || "Unknown";
        const OtherCost = costInfo["Others"] + costInfo["Travel"] || "Unknown";
        const status = data.status || "Unknown";

        const costFlag =
            Number(totalCost) < effort * 50
                ? "Very low compared to effort"
                : "Aligned with effort";

        return `
IMPORTANT CONTEXT:
- Opportunity Name: ${oppInfo["Opportunity Name"] || "N/A"}
- Region / Location: ${location}
- Stage: ${status}
- Duration: ${durationText}
- Resources involved: ${resources}
- Total effort: ${effort} person-days
- Total cost: ${totalCost}
- Cost assessment: ${costFlag}
- Deal Amount (Revenue): ${totalCost}
-Total Effort Cost: ${totalCost}
-Other Costs: ${OtherCost}
-Resources role Assigned: ${roleNames}
`;
    };

    const context = buildAIContext(allData);

    const prompt = `Deep Analyze the following opportunity details and generate AI-powered insights. each point in max 8-12 words: Instructions:
1. Summarize deal health in one paragraph.
2. List top 2 key risks and red flags.
3. Provide 2–3 actionable next steps, if any.
4. Highlight margin or pricing issues.
5. Highlight total cost vs man person assigned vs margin
5. Predict any additional point need to be considered
6. Deal Health %age status
7. Add icon for each risk point


Return ONLY valid JSON in this format:

{
"dealHealth": "number",
"summary":"string",
  "deliveryRisks": [
    {
      "title": "string",
      "risk": "string",
      "mitigation": "string",
      "severity": "High | Medium | Low"
    }
  ],
  "NextSteps": [
    {
      "title": "string",
      "risk": "string",
      "mitigation": "string",
      "severity": "High | Medium | Low"
    }
  ],
  "MarginPricing":"string",
  "CostAnalysis":"string",
   "PredictPoints": [
    {
      "title": "string",
      "risk": "string",
      "mitigation": "string",
      "severity": "High | Medium | Low"
    }
  ],
  "finalRecommendations":"String"
}
`;



    const STORAGE_KEY = "ai_insights:opportunity";

    const generateAIContent = async () => {
        if (!opportunityId) return;

        setLoading(true);

        const cachedData =
            JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

        // ✅ Cache hit
        if (cachedData[opportunityId]) {
            setAiRisks(cachedData[opportunityId]);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/generateinsights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    data: context
                })
            });

            const dataGet = await res.json();
            const parsed =
                typeof dataGet.result === "string"
                    ? JSON.parse(dataGet.result)
                    : dataGet.result;

            const updatedCache = {
                ...cachedData,
                [opportunityId]: parsed
            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedCache)
            );

            setAiRisks(parsed);
        } catch (error) {
            console.error("AI Insights Error:", error);
        } finally {
            setLoading(false);
        }
    };


    const openModal = () => {
        generateAIContent();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const updateDate = allData?.modifiedDate || allData?.createDate
    let diffInDays;
    if (updateDate) {
        const givenDate = new Date(updateDate);
        const today = new Date();

        givenDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffInMs = today - givenDate;
        diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    }
    const handleBack = () => {
        router.back();
    };
    return (
        <>
            <Head>
                <title>View opportunity</title>
                <meta name="description" content={"View opportunity"} />
            </Head>
            <Notes isOpen={isNotesModalOpen} closeModal={closeNotesModal} id={opportunityId} type={"opportunity"} />
            <InsightRender
                isOpen={isModalOpen}
                closeModal={closeModal}
                aiRisks={aiRisks}
                loading={loading}
            />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"View Opportunity"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index" id="oxyem_opportunity_page">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border opportunity-view-page" id="sk-create-page">
                                                         <div className="top-card-icon-b">
                                                        <span className='back-btn' onClick={handleBack}>
                                                            <IoArrowBackOutline />Back
                                                        </span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center opportunity-header mb-1">
                                                            <div className='oxyem-opportunity-header-left'>
                                                                <span className={`oxyem-mark-opp oxyem-mark-${status}`}>{status}</span> <p className='main-heading-opportunity'>{summaryInfo?.["Opportunity  Information"]?.["Opportunity Name"]}</p>
                                                            </div>
                                                            <div className='oxyem-opportunity-header-right'>
                                                                <div className="combo_btn_opp">
                                                                    {dataStatus === "open" && (
                                                                        <span className="won-loss-wrapper" ref={popupRef}>
                                                                            <span
                                                                                className={`btn-trigger ${showPopup ? "open" : ""}`}
                                                                                onClick={() => setShowPopup(!showPopup)}
                                                                                data-tooltip-content={"Click to change deal outcome or stage"}
                                                                                data-tooltip-id={`my-tooltip-p`}
                                                                            >
                                                                                <span className='blue-icon'></span>Proposal
                                                                                {showPopup ? (
                                                                                    <FaChevronUp className="chevron-icon" />
                                                                                ) : (
                                                                                    <FaChevronDown className="chevron-icon" />
                                                                                )}
                                                                            </span>

                                                                            {showPopup && (
                                                                                <div className="won-loss-popup">
                                                                                    <div
                                                                                        className="btn-opportunity-drop"
                                                                                        onClick={() => {
                                                                                            handleWonClick();
                                                                                            setShowPopup(false);
                                                                                        }}
                                                                                    >
                                                                                        Won
                                                                                    </div>

                                                                                    <div
                                                                                        className="btn-opportunity-drop"
                                                                                        onClick={() => {
                                                                                            handleLossClick();
                                                                                            setShowPopup(false);
                                                                                        }}
                                                                                    >
                                                                                        Loss
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                    <span className='btn-oxyem-insight' onClick={openModal}><LuBrainCircuit /> AI-Powered Insights</span>
                                                                    <span className='btn-notes-opp' onClick={openNotesModal}>Notes</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <OpportunityRender data={allData} opportunityId={opportunityId} rolesByUnit={rolesByUnit} setRolesByUnit={setRolesByUnit} diffInDays={diffInDays} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Tooltip id="my-tooltip-p" place="top" />
            <Toaster
                position="top-right"
                reverseOrder={false}
                autoClose={3000}
                closeOnClick
                pauseOnHover
                draggable
            />
        </>
    );
}
