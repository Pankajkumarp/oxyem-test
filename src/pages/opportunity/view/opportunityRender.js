/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getCountryCode } from "./countryByContinent";
import DocumentsEvidence from "./DocumentsEvidence";
import { axiosJWT } from '../../Auth/AddAuthorization';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import RenderChart from "./RenderChart";

export default function Renders({ data, opportunityId, rolesByUnit, setRolesByUnit, diffInDays }) {
    const [documentData, setDocumentData] = useState([]);
    const getUploadList = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        try {
            const response = await axiosJWT.get(`${apiUrl}/getDocumentList`, {
                params: {
                    id: opportunityId,
                    isFor: "opportunity",
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
        getUploadList(opportunityId);
    }, [opportunityId]);
    const [departmentMap, setDepartmentMap] = useState({});
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                    params: { isFor: "departments" }
                });
                const map = {};
                response.data.data.forEach(dep => {
                    map[dep.id] = dep.name;
                });
                setDepartmentMap(map);
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };

        fetchDepartments();
    }, []);
    const [expenseTypeMap, setExpenseTypeMap] = useState({});
    useEffect(() => {
        const fetchExpenseTypes = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                    params: { isFor: "Expense_Type" }
                });

                const map = {};
                response.data.data.forEach(item => {
                    map[item.id] = item.name;
                });

                setExpenseTypeMap(map);
            } catch (err) {
                console.error("Failed to fetch expense types", err);
            }
        };

        fetchExpenseTypes();
    }, []);


    if (!data) return null;

    const { summaryInfo, dataEffort, dataOtherCost, dataOpportunity } = data;
    const totalCost = data?.dataEffort?.reduce(
        (sum, item) => sum + Number(item.totalCost || 0),
        0
    ) || 0;

    const totalRevenue = data?.dataEffort?.reduce(
        (sum, item) => sum + Number(item.overrideTotalCost || 0),
        0
    ) || 0;

    const profitPercent =
        totalRevenue > 0
            ? (((totalRevenue - totalCost) / totalRevenue) * 100).toFixed(2)
            : "0.00";

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d) ? "" : format(d, "dd MMM yyyy");
    };
    const location =
        summaryInfo?.["Opportunity  Information"]?.Location;

    const countryCode = getCountryCode(location);
    useEffect(() => {
        if (!dataEffort?.length) return;

        const fetchRoles = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const unitSet = new Set(dataEffort.map(item => item.Unit));

            const roleMap = {};

            for (const unit of unitSet) {
                try {
                    const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                        params: { isFor: "roles", id: unit }
                    });

                    response.data.data.forEach(role => {
                        if (!roleMap[unit]) roleMap[unit] = {};
                        roleMap[unit][role.id] = role.name;
                    });
                } catch (err) {
                    console.error("Failed to fetch roles for unit", unit, err);
                }
            }

            setRolesByUnit(roleMap);
        };

        fetchRoles();
    }, [dataEffort]);
    const hasValidOtherCost = (item) => {
        return (
            item?.nameOfExpense ||
            item?.expenseType ||
            item?.quantity ||
            item?.amountPerUnit ||
            item?.totalAmount
        );
    };
    const validOtherCosts = (dataOtherCost || []).filter(hasValidOtherCost);
    const [openSection, setOpenSection] = useState("effort");

    const toggleSection = (section) => {
        setOpenSection(prev =>
            prev === section ? null : section
        );
    };

    const hasValidEffort = (item) => {
        return (
            item?.Unit ||
            item?.role ||
            item?.monthlyPerson ||
            item?.rateCard ||
            item?.totalEffort ||
            item?.totalCost
        );
    };
    const validEfforts = (dataEffort || []).filter(hasValidEffort);

    const effortOverview = (dataEffort || []).reduce(
        (acc, item) => {
            acc.totalCost += Number(item.totalCost || 0);
            acc.totalDays += Number(item.totalEffort || 0);
            acc.units += Number(item.monthlyPerson || 0); // 👈 Units = people allocated
            return acc;
        },
        {
            totalCost: 0,
            totalDays: 0,
            units: 0,
        }
    );

    // -------- helpers --------
    const getRoleName = (unitId, roleId) => {
        return rolesByUnit?.[unitId]?.[roleId] || roleId;
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

    // -------- data grouping --------
    useEffect(() => {
        if (!Object.keys(rolesByUnit).length || !dataEffort.length) return;

        const grouped = dataEffort.reduce((acc, item) => {
            const roleName = getRoleName(item.Unit, item.role);
            const label = `${roleName} (${item.monthlyPerson})`;
            const cost = Number(item.totalCost || 0);

            acc[label] = (acc[label] || 0) + cost;
            return acc;
        }, {});

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGroupedMap(grouped);
        setShowGraph(true);
    }, [rolesByUnit, dataEffort]);

    // -------- chart data --------
    const labels = Object.keys(groupedMap);
    const series = Object.values(groupedMap);
    const totalCostGraph = series.reduce((a, b) => a + b, 0);

    const chartData = labels.map((label, i) => ({
        label,
        value: series[i]
    }));

    const colorsOhter = [
        "#9156be",
        "#10B981",
        "#94A3B8",
        "#18aecc",
        "#fabf2d",
        "#3079bd",

        "#06B6D4",
        "#6366F1",
    ];
    const [otherCostMap, setOtherCostMap] = useState({});
    const [showOtherGraph, setShowOtherGraph] = useState(false);

    useEffect(() => {
        if (!dataOtherCost?.length) return;

        const grouped = dataOtherCost.reduce((acc, item) => {
            const label = item.nameOfExpense;
            const cost = Number(item.totalAmount || 0);

            acc[label] = (acc[label] || 0) + cost;
            return acc;
        }, {});

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOtherCostMap(grouped);
        setShowOtherGraph(true);
    }, [dataOtherCost]);

    // -------- chart data (FIXED) --------
    const labelsO = Object.keys(otherCostMap);
    const seriesO = Object.values(otherCostMap);
    const otherCostGraph = seriesO.reduce((a, b) => a + b, 0);

    const chartOtherData = labelsO.map((label, i) => ({
        label,
        value: seriesO[i]   // ✅ FIXED
    }));

    return (
        <>
            <div className="status-bar-insight">
                <div className="status-item">
                    <span className="label">Status:</span>
                    <span className="status-pill">
                        Proposal
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
                            <small className="text-muted">Effort Overview</small>
                            <div className="box-card-data">
                                <div>
                                    <h4>${effortOverview.totalCost.toLocaleString()}</h4>
                                    <p>Total Effort Cost</p>
                                </div>
                                <div>
                                    <h4>{effortOverview.totalDays}</h4>
                                    <p>Total Days</p>
                                </div>
                                <div>
                                    <h4>{effortOverview.units}</h4>
                                    <p>Units</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={`card summary-card card-light-b`}>
                            <small className="text-muted">Duration</small>
                            <h5 className="fw-bold mt-2">{formatDate(dataOpportunity?.startDate)} - {formatDate(dataOpportunity?.endDate)}</h5>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className={`card summary-card card-light-green`}>
                            <small className="text-muted">Total Cost</small>
                            <h5 className="fw-bold mt-2">{summaryInfo?.["Financial  Information USD"]?.total}</h5>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className={`card summary-card card-light-blue`}>
                            <small className="text-muted">Profit Margin</small>
                            <h5 className="fw-bold mt-2">{profitPercent}%</h5>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className={`card summary-card card-light-b`}>
                            <small className="text-muted">Location</small>
                            <h5 className="fw-bold mt-2">{summaryInfo?.["Opportunity  Information"]?.Location} {countryCode && (
                                <img
                                    src={`https://flagcdn.com/w40/${countryCode}.png`}
                                    alt={`${location} flag`}
                                    width={30}
                                />
                            )}</h5>
                        </div>
                    </div>
                </div>

                {/* INFORMATION SECTIONS */}
                <div className="row mt-4">
                    <div className="col-md-4">
                        <div className="card card-opp-middle-s h-100">
                            <div className="card-header-middle-s"><p className='main-heading-opportunity'>Opportunity Information</p></div>
                            <div className="card-body">
                                {Object.entries(summaryInfo?.["Opportunity  Information"] || {}).map(
                                    ([key, value]) => {
                                        const isDateField = key === "Start Date" || key === "End Date";

                                        return (
                                            <div className="d-flex card-opp-middle-s-row" key={key}>
                                                <span className="text-muted f-b">{key}:</span>
                                                <span className="fw-medium">
                                                    {isDateField ? formatDate(value) : value}
                                                </span>
                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card card-opp-middle-s h-100">
                            <div className="card-header-middle-s"><p className='main-heading-opportunity'>Financial Information</p></div>
                            <div className="card-body">
                                {Object.entries(summaryInfo?.["Financial  Information USD"] || {}).map(
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
                    <p className='main-heading-opportunity' onClick={() => toggleSection("effort")}>Effort Details <span>{openSection === "effort" ? <FaChevronUp /> : <FaChevronDown />}</span></p>
                    {openSection === "effort" && (
                        <div className="row">
                            <div className="col-xl-7 col-xxl-8">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Unit</th>
                                                <th>Role</th>
                                                <th>Monthly Person</th>
                                                <th>Rate</th>
                                                <th>Total Effort</th>
                                                <th>Total Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {validEfforts.length > 0 ? (
                                                validEfforts.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{departmentMap[item.Unit] || "—"}</td>
                                                        <td>{rolesByUnit[item.Unit]?.[item.role] || "—"}</td>
                                                        <td>{item.monthlyPerson}</td>
                                                        <td>${item.rateCard}</td>
                                                        <td>{item.totalEffort}</td>
                                                        <td>${item.totalCost}</td>
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
                            <div className="col-xl-5 col-xxl-4">
                                <div className="graph-div-opp">
                                    <p className='main-heading-opportunity-c'>Resource View</p>
                                    <RenderChart showGraph={showGraph} chartData={chartData} totalCostGraph={totalCostGraph} colors={colors} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* OTHER EFFORT DETAILS TABLE */}
                <div className="card-opp-middle-table mt-4">
                    <p className='main-heading-opportunity' onClick={() => toggleSection("otherCost")}>Other Cost  <span>{openSection === "otherCost" ? <FaChevronUp /> : <FaChevronDown />}</span></p>
                    {openSection === "otherCost" && (
                        <div className="row">
                            <div className="col-md-8">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name Of Expense</th>
                                                <th>Expense Type</th>
                                                <th>Quantity</th>
                                                <th>Amount Per Unit</th>
                                                <th>Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {validOtherCosts.length > 0 ? (
                                                validOtherCosts.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.nameOfExpense}</td>
                                                        <td>{expenseTypeMap[item.expenseType] || "—"}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.amountPerUnit}</td>
                                                        <td>{item.totalAmount}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className=" text-muted">
                                                        No additional cost recorded yet
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="graph-div-opp">
                                    <p className='main-heading-opportunity-c'>Additional Cost View</p>
                                    <RenderChart showGraph={showOtherGraph} chartData={chartOtherData} totalCostGraph={otherCostGraph} colors={colorsOhter} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}