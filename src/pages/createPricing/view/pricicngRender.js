/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import DocumentsEvidence from "../../Components/FileRender/DocumentsEvidence";
import { axiosJWT } from '../../Auth/AddAuthorization';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import RenderChart from "./RenderChart";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PricingRender({ data, pricingId, diffInDays, dataStatus }) {
    if (!data) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d) ? "" : format(d, "dd MMM yyyy");
    };
    const apiResponse = data || {};

    const opportunitySummary = apiResponse.OpportunitySummary || {};
    const opportunityInfo = opportunitySummary["Opportunity  Information"] || {};
    const financialInfoUSD = opportunitySummary["Financial  Information USD"] || {};
    const totalPricing =
        data?.summary?.["Milestone Total"]?.total || "$ 0";
    const resourceCost = financialInfoUSD?.["Resources Cost"] || "$ 0";
    const durationText = `${formatDate(opportunityInfo["Start Date"])} - ${formatDate(opportunityInfo["End Date"])}`;
    const parseAmount = (value = "") =>
        Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;
    const totalRevenue = parseAmount(
        financialInfoUSD?.total
    );

    const totalCost = parseAmount(
        financialInfoUSD?.["Resources Cost"]
    ) +
        parseAmount(financialInfoUSD?.["Per Diem"]) +
        parseAmount(financialInfoUSD?.["Travel"]) +
        parseAmount(financialInfoUSD?.["Accommodation"]);
    const profitValuePercent =
        totalRevenue > 0
            ? (((totalRevenue - totalCost) / totalRevenue) * 100).toFixed(2)
            : "0.00";

    const [documentData, setDocumentData] = useState([]);
    const getUploadList = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        try {
            const response = await axiosJWT.get(`${apiUrl}/getDocumentList`, {
                params: {
                    id: pricingId,
                    isFor: "pricing",
                },
            });
            if (response && response.data) {
                setDocumentData(response.data.data)
            }
        } catch (error) {
            console.error("Error occurred while fetching documents:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getUploadList(pricingId);
    }, [pricingId]);


    if (!data) return null;

    const { datapricinginfo, OpportunitySummary, milestoneDetails } = data;


    const hasValidOtherCost = (item) => {
        return (
            item?.description ||
            item?.date ||
            item?.totalAmount
        );
    };
    const validOtherCosts = (milestoneDetails || []).filter(hasValidOtherCost);

    const [openSection, setOpenSection] = useState("milestoneChart");

    const toggleSection = (section) => {
        setOpenSection(prev =>
            prev === section ? null : section
        );
    };


    const colors = [
        "#18aecc",
        "#fabf2d",
        "#3079bd",
        "#9156be",
        "#06B6D4",
        "#94A3B8",
        "#6366F1",
        "#10B981"
    ];
    // -------- state --------
    const [groupedMap, setGroupedMap] = useState({});
    const [showGraph, setShowGraph] = useState(false);

    useEffect(() => {
        if (!financialInfoUSD || !Object.keys(financialInfoUSD).length) return;

        const grouped = Object.entries(financialInfoUSD)
            .filter(([key]) => key !== "total") // ❌ exclude total
            .reduce((acc, [label, value]) => {
                acc[label] = parseAmount(value);
                return acc;
            }, {});

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGroupedMap(grouped);
        setShowGraph(true);
    }, [financialInfoUSD]);
    const labels = Object.keys(groupedMap);
    const series = Object.values(groupedMap);
    const totalCostGraph = series.reduce((a, b) => a + b, 0);

    const chartData = labels.map((label, i) => ({
        label,
        value: series[i]
    }));

    const safeMilestones = (milestoneDetails || []).filter(
        item => item?.date && item?.totalAmount
    );

    const categories = safeMilestones.map(item => String(item.date));
    const datagraph = safeMilestones.map(item =>
        Number(item.totalAmount) || 0
    );
    const descriptions = safeMilestones.map(
        item => item.description || ""
    );

    const colorsPrice = [
        '#316799', '#009688', '#8e24aa', '#00bcd4', '#795548',
        '#1e88e5'
    ];
    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350
        },
        colors: colorsPrice,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                const datagraphs = datagraph[opts.dataPointIndex];
                return datagraphs;
            },
            style: {
                colors: ['#fff'],
                fontSize: '12px',
                fontWeight: 'bold'
            }
        },
        legend: {
            show: false,
            labels: {
                formatter: function (seriesName, opts) {
                    return descriptions[opts.seriesIndex];
                }
            }
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 'normal'
                }
            }
        }
    };



    const chartSeries = [
        {
            name: 'Amount',
            data: datagraph
        }
    ];
    const PRICING_DISPLAY_ORDER = [
        { key: "opportunityNo", label: "Opportunity No" },
        { key: "clientName", label: "Client Name" },
        { key: "projectName", label: "Project Name" },
        { key: "opportunityName", label: "Opportunity Name" },
        { key: "currencyType", label: "Currency" },
        { key: "startDate", label: "Start Date" },
        { key: "endDate", label: "End Date" }
    ];


    return (
        <>
            <div className="status-bar-insight">
                <div className="status-item">
                    <span className="label">Status:</span>
                    <span className="status-pill">
                        {dataStatus?.toLowerCase() === "open" ? (
                            <span data-tooltip-content={"Sales has won the deal"} data-tooltip-id={`my-tooltip-p`}>Open - Won</span>
                        ) : dataStatus?.toLowerCase() === "approve" ? (
                            <span data-tooltip-content={"Deal is finalized and moving to delivery & invoicing"} data-tooltip-id={`my-tooltip-p`}>Closed - Won</span>
                        ) : dataStatus?.toLowerCase() === "closed" ? (
                            <span data-tooltip-content={"Deal is finalized and moving to delivery & invoicing"} data-tooltip-id={`my-tooltip-p`}> Won</span>
                        ) : (
                            null
                        )}

                        <span className="status-bars">
                            <span></span>
                            <span></span>
                        </span>
                    </span>
                </div>

                <span className="divider">|</span>

                <div className="status-item muted">
                    Last Updated: {
                        diffInDays === 0
                            ? 'Today'
                            : diffInDays === 1
                                ? '1 day ago'
                                : `${diffInDays} days ago`
                    }
                </div>
            </div>

            <div className="middle-section-opp">
                <div className="row g-3 mt-1">
                    <div className="col-md-3">
                        <div className={`card summary-card card-light-green`}>
                            <small className="text-muted">Total Cost</small>
                            <h5 className="fw-bold mt-2">{totalPricing}</h5>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={`card summary-card card-light-b`}>
                            <small className="text-muted">Resource Cost</small>
                            <h5 className="fw-bold mt-2">{resourceCost}</h5>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={`card summary-card card-light-b`}>
                            <small className="text-muted">Duration</small>
                            <h5 className="fw-bold mt-2">{durationText}</h5>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={`card summary-card card-light-blue`}>
                            <small className="text-muted">Profit Margin</small>
                            <h5 className="fw-bold mt-2">{profitValuePercent}%</h5>
                        </div>
                    </div>
                </div>

                {/* INFORMATION SECTIONS */}
                <div className="row mt-4">
                    <div className="col-md-4">
                        <div className="card card-opp-middle-s h-100">
                            <div className="card-header-middle-s"><p className='main-heading-opportunity'>Pricing Information</p></div>
                            <div className="card-body">
                                {PRICING_DISPLAY_ORDER.map(({ key, label }) => {
                                    const value = datapricinginfo?.[key];
                                    if (!value) return null;

                                    const isDateField = key === "startDate" || key === "endDate";
                                    const isopportunityField = key === "opportunityName";
                                    const isprojectField = key === "projectName";
                                    const isclientField = key === "clientName";

                                    return (
                                        <div className="d-flex card-opp-middle-s-row" key={key}>
                                            <span className="text-muted f-b">{label}:</span>
                                            {isopportunityField ? (
                                                <>
                                                    {data?.opportunityId ? (
                                                        <Link className="fw-medium" href={`/opportunity/view/${data.opportunityId}`}>
                                                            {value}
                                                        </Link>
                                                    ) : (
                                                        <span className="fw-medium">
                                                            {value}
                                                        </span>
                                                    )}
                                                </>
                                            ) : isprojectField ? (
                                                <>
                                                    {data?.idProject ? (
                                                        <Link className="fw-medium" href={`/projects/view/${data.idProject}`}>
                                                            {value}
                                                        </Link>
                                                    ) : (
                                                        <span className="fw-medium">
                                                            {value}
                                                        </span>
                                                    )}
                                                </>
                                            ) : isclientField ? (
                                                <>
                                                    {data?.idClient ? (
                                                        <Link className="fw-medium" href={`/clientManagement/view/${data.idClient}`}>
                                                            {value}
                                                        </Link>
                                                    ) : (
                                                        <span className="fw-medium">
                                                            {value}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="fw-medium">
                                                    {isDateField ? formatDate(value) : value}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card card-opp-middle-s h-100">
                            <div className="card-header-middle-s"><p className='main-heading-opportunity'>Milestone Financial Information</p></div>
                            <div className="card-body">
                                {Object.entries(OpportunitySummary?.["Financial  Information USD"] || {}).map(
                                    ([key, value]) => {
                                        const isTotal = key === "total";

                                        return (
                                            <div
                                                key={key}
                                                className={`d-flex card-opp-middle-s-row card-opp-middle-s-row-a ${isTotal ? "financial-total-row" : ""
                                                    }`}
                                            >
                                                <span className="text-muted f-b">{key}:</span>
                                                <span className="fw-medium f-w">{value}</span>
                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-opp-middle-s h-100">
                            <div className="card-header-middle-s"><p className='main-heading-opportunity'>Documents Information</p></div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card card-opp-middle-b">
                                        <DocumentsEvidence documents={documentData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* EFFORT DETAILS TABLE */}
                <div className="card-opp-middle-table mt-4">
                    <p className='main-heading-opportunity' onClick={() => toggleSection("milestoneChart")}>Financial Breakdown<span>{openSection === "effort" ? <FaChevronUp /> : <FaChevronDown />}</span></p>
                    {openSection === "milestoneChart" && (
                        <div className="row">
                            <div className="col-md-6">
                                <div className="graph-div-opp">
                                    <p className='main-heading-opportunity-c'>Milestone Revenue Breakdown</p>
                                    <Chart
                                        options={chartOptions}
                                        series={chartSeries}
                                        type="bar"
                                        height={225}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="graph-div-opp">
                                    <p className='main-heading-opportunity-c'>Cost Composition</p>
                                    <RenderChart showGraph={showGraph} chartData={chartData} totalCostGraph={totalCostGraph} colors={colors} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="card-opp-middle-table mt-4">
                    <p className='main-heading-opportunity' onClick={() => toggleSection("milestone")}>Milestone Details <span>{openSection === "effort" ? <FaChevronUp /> : <FaChevronDown />}</span></p>
                    {openSection === "milestone" && (
                        <div className="row">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Description</th>
                                                <th>Date</th>
                                                <th>Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {validOtherCosts.length > 0 ? (
                                                validOtherCosts.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.description}</td>
                                                        <td>{formatDate(item.date)}</td>
                                                        <td>${item.totalAmount}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="text-muted">
                                                        No effort details available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
<Tooltip id="my-tooltip-p" place="top" />
            </div>
        </>
    );
}