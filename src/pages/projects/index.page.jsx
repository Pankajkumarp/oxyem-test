import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { HiDotsVertical } from "react-icons/hi";
import { GrResources } from "react-icons/gr";
import { axiosJWT } from "../Auth/AddAuthorization.jsx";
import ReactPaginate from 'react-paginate';
import MUIDataTable from "mui-datatables";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoEye } from "react-icons/go";
import Link from 'next/link';
import DeleteModalProject from '../Components/Popup/DeleteModalProject.jsx';
import Avatar from 'react-avatar';
import { Tooltip } from 'react-tooltip'
import { GrTooltip } from "react-icons/gr";


import pageTitles from '../../common/pageTitles.js';
import { Toaster, toast } from 'react-hot-toast';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ProjectListing({ }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'project-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);

    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };

    const [projectStats, setProjectStats] = useState({});

    const fetchProjectStats = async () => {
        try {
            // 🔹 Replace this dummy with your real API later
            const response = await axiosJWT.get(`${apiUrl}/project/projectstats`);
            const responsedata = response.data.data || {};

            // ✅ Dummy Stats
            // const responsedata = {
            //     totalActive: 8,
            //     totalInactive: 2,
            //     totalExpiringThisMonth: 1,
            //     totalDraft: 1
            // };

            setProjectStats(responsedata);
        } catch (error) {
            console.error("Error fetching project stats:", error);
        }
    };

    useEffect(() => {
        fetchProjectStats();
    }, []);

    const [isProjectChartOpen, setIsProjectChartOpen] = useState(false);

    const [projectStatusBarChartData, setProjectStatusBarChartData] = useState();
    const [projectClientBarChartData, setProjectClientBarChartData] = useState();
    const [projectEndDateLineChartData, setProjectEndDateLineChartData] = useState();
    const [projectTypeDonutChartData, setProjectTypeDonutChartData] = useState();

   useEffect(() => {
    const getProjectCharts = async () => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/project/projectgraphs`);
            const projectChartResponse = response.data?.data || {}; // ✅ Access inside .data
            console.log("this ", projectChartResponse);

            // 📊 Chart 1 - Bar (Projects by Status)
            setProjectStatusBarChartData({
                series: [{ name: "Projects", data: projectChartResponse.projectStatus?.data || [] }],
                options: {
                    chart: {
                        type: "bar",
                        height: 350,
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                const category = chartContext.w.config.xaxis.categories[config.dataPointIndex];
                                if (!category) return;
                                requestAnimationFrame(() => {
                                    console.log("Filter by status:", category);
                                    setSearchfilter( category );
                                    setActiveTab(1);
                                    setActiveStatus(category);
                                });
                            },
                        },
                    },
                    xaxis: { categories: projectChartResponse.projectStatus?.categories || [] },
                    grid: { row: { colors: ["#fff", "#f2f2f2"] } },
                    colors: ["#156082"],
                    legend: {show: false},
                    dataLabels: { enabled: true },
                },
            });

            // 📊 Chart 2 - Bar (Projects by Client)
            setProjectClientBarChartData({
                series: [{ name: "Projects", data: projectChartResponse.projectClient?.data || [] }],
                options: {
                    chart: {
                        type: "bar",
                        height: 350,
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                const category = chartContext.w.config.xaxis.categories[config.dataPointIndex];
                                if (!category) return;
                                requestAnimationFrame(() => {
                                    console.log("Filter by client:", category);
                                    setSearchfilter({ projectName: category });
                                    setActiveTab(1);
                                    setActiveStatus(category);
                                });
                            },
                        },
                    },
                    xaxis: { categories: projectChartResponse.projectClient?.categories || [] },
                    grid: { row: { colors: ["#fff", "#f2f2f2"] } },
                    colors: ["#43a047"],
                    legend: {show: false},
                    dataLabels: { enabled: true },
                },
            });

            // 📊 Chart 3 - Line (Projects by End Date)
            setProjectEndDateLineChartData({
                series: [{ name: "Projects", data: projectChartResponse.projectEndDate?.data || [] }],
                options: {
                    chart: { type: "bar", height: 350 },
                    xaxis: { categories: projectChartResponse.projectEndDate?.categories || [] },
                    colors: ["#156082"],
                    dataLabels: { enabled: true },
                    grid: { row: { colors: ["#fff", "#f2f2f2"] } },
                    legend: {show: false},
                },
            });

            // 📊 Chart 4 - Donut (Projects vs Opportunities) — only if API provides it
            if (projectChartResponse.projectType) {
                setProjectTypeDonutChartData({
                    series: projectChartResponse.projectType.data,
                    options: {
                        chart: { type: "donut", height: 350 },
                        labels: projectChartResponse.projectType.categories,
                        colors: ["#156082", "#43a047"],
                        legend: { position: "bottom" },
                        dataLabels: { enabled: true },
                    },
                });
            }

            setIsProjectChartOpen(true);
        } catch (error) {
            console.error("Error setting project chart data:", error);
        }
    };

    getProjectCharts();
}, []);



    const [searchfilter, setSearchfilter] = useState({});
    const [activeStatus, setActiveStatus] = useState(null);
    const [activeTableTab, setActiveTableTab] = useState("");

    const handleShowDataForStatus = (filterKey) => {
        setActiveTab(1); // Switch to table view
        setActiveTableTab(filterKey);
        setActiveStatus(filterKey);

        if (filterKey === "clr") {
            // Clear all filters
            setSearchfilter();
            setActiveStatus(null);
            return;
        }

        switch (filterKey) {

            case "Active":
                setSearchfilter("Active");
                break;

            case "Inactive":
                setSearchfilter("Inactive");
                break;

            case "ExpiringThisMonth":
                // 🔹 For expiring projects, you can filter based on endDate within this month
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                // setSearchfilter({
                //   expiringThisMonth: true, // optional flag
                //   filterFn: (row) => {
                //     const endDateStr = row.find((item) => item.name === "endDate")?.value;
                //     if (!endDateStr) return false;
                //     const endDate = new Date(endDateStr.split("-").reverse().join("-"));
                //     return endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
                //   },
                // });
                break;

            case "Draft":
                setSearchfilter("Draft");
                break;

            default:
                setSearchfilter({});
                break;
        }
    };


    const menuRefs = useRef({});
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the clicked element is inside any open dropdown
            if (openMenuIndex !== null && menuRefs.current[openMenuIndex]) {
                if (!menuRefs.current[openMenuIndex].contains(event.target)) {
                    setOpenMenuIndex(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenuIndex]);

    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [formdata, setFormdata] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState([]);
    const [columnss, setcolumns] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [filterList, setFilterList] = useState({});
    const getProjectValue = async (page) => {
        const filterParams = Object.keys(filterList)
            .map(key => filterList[key].length ? `${key}=${filterList[key].join(',')}` : '')
            .filter(param => param)
            .join('&');
        const searchParam = searchValue ? `&search=${encodeURIComponent(searchValue)}` : '';
        try {
            const response = await axiosJWT.get(`${apiUrl}/project?page=${page}&limit=${itemsPerPage}&${filterParams}${searchParam}`,
                {
                    params: {
                        status: searchfilter
                    }
                }
            );

            if (response) {
                const apiResponse = response.data.data;
                setFormdata(apiResponse.formdata || []);
                setTotalCount(apiResponse.totalCount); // used to calculate total pages
                setcolumns(response.data.data.formColumns || [])
                const transformedData = apiResponse.formdata?.map(item => item.map(subItem => subItem.value));
                setData(transformedData || []);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };
    useEffect(() => {
        getProjectValue(currentPage);
    }, [currentPage, itemsPerPage, searchValue, filterList, searchfilter]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };
    const columns = columnss.map(column => ({
        name: column.name,
        label: column.lebel,
        options: {
            filter: column.isfilter,
            sort: column.issort,
            display: ['id', 'idAssignTask'].includes(column.name) ? 'excluded' : 'true',
            customBodyRender: (value) => {
                if (value && typeof value === 'object') {
                    // Try showing 'name', 'label', or stringify
                    return value.name || value.label || JSON.stringify(value);
                }
                return value ?? '-'; // fallback for null/undefined
            }
        }
    }));


    const pageCount = Math.ceil(totalCount / itemsPerPage);
    const options = {
        filter: true, // Enable filtering
        filterType: "dropdown", // Can be "checkbox", "dropdown", "multiselect", etc.
        responsive: "standard", // Can be "standard", "vertical", "simple"
        serverSide: true, // Enable server-side operations
        rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100], // Rows per page options
        selectableRows: "none", // Disable selectable rows
        search: true, // Enable global search
        download: true, // Enable download option
        print: true, // Enable print option
        viewColumns: false, // Enable view/hide columns option
        onTableChange: (action, tableState) => {
            switch (action) {
                case 'changePage':
                    setCurrentPage(tableState.page);
                    break;
                case 'changeRowsPerPage':
                    setItemsPerPage(tableState.rowsPerPage);
                    setCurrentPage(0);
                    break;
                case 'sort':
                    setSortOrder({
                        name: tableState.sortOrder.name,
                        direction: tableState.sortOrder.direction,
                    });
                    break;
                case 'filterChange':
                    const newFilterList = {};
                    tableState.filterList.forEach((value, index) => {
                        if (value.length) {
                            newFilterList[tableState.columns[index].name] = value;
                        }
                    });
                    setFilterList(newFilterList);
                    break;
                case 'search':
                    setSearchValue(tableState.searchText);
                    break;
                default:
                    break;
            }
        },
        onDownload: (buildHead, buildBody, columns, data) => {
            const excludedColumnNames = ['Id', 'Action', 'id', 'action', 'Allocated'];

            const filteredColumns = columns.filter(column => !excludedColumnNames.includes(column.name));
            const filteredData = data.map(row => {
                const filteredRow = row.data.filter((_, index) => !excludedColumnNames.includes(columns[index].name));
                return { ...row, data: filteredRow };
            });

            // Generate CSV content
            const csvContent = buildHead(filteredColumns) + buildBody(filteredData);

            // Return with UTF-8 BOM for Excel compatibility
            return '\ufeff' + csvContent; // Add BOM
        },
    };

    const [isModalOpendelete, setIsModalOpenDelete] = useState(false);
    const [deleteId, setDeleteid] = useState("");
    const onDeleteClick = (id) => {
        setDeleteid(id)
        setIsModalOpenDelete(true)
    };
    const closeModalInputselect = () => {
        setIsModalOpenDelete(false);
    };

    const onConformationClick = async () => {

        try {
            const response = await axiosJWT.delete(`${apiUrl}/project`, {
                params: {
                    'idProject': deleteId
                }
            });
            if (response) {
                setIsModalOpenDelete(false);
                getProjectValue();
            }
        } catch (error) {

        }
    }
    const GroupAvatar = ({ users, maxVisible = 3 }) => {
        const visibleUsers = users?.slice(0, maxVisible);
        const remaining = users?.length - maxVisible;

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {visibleUsers?.map((user, index) => (
                    <div key={index} style={{ marginLeft: index === 0 ? 0 : -10 }}>
                        <Avatar
                            name={user.name}
                            src={user.imageUrl}
                            size={30}
                            textSizeRatio={2}
                            round={true}
                            style={{
                                objectFit: 'cover' // Add object-fit
                            }} />
                    </div>
                ))}
                {remaining > 0 && (
                    <div className="pending-avtar" style={{ marginLeft: -10 }}>
                        <Avatar
                            name={`+ ${remaining}`}
                            size={30}
                            textSizeRatio={2}
                            round={true}
                            style={{
                                objectFit: 'cover' // Add object-fit
                            }} />
                    </div>
                )}
            </div>
        );
    };
    return (
        <>
            <Head><title>{pageTitles.ProjectDashboard}</title></Head>
            <DeleteModalProject isOpen={isModalOpendelete} closeModal={closeModalInputselect} onConformationClick={onConformationClick} />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashboard (Project)"} addlink={"/Projectmanagement"} tooltipcontent={"Add New Project"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div>
                                    <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                        <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                            <li className={`nav-item ${activeTab === 0 ? 'active' : ''}`}>   {/* ✅ className */}
                                                <a className="nav-link" onClick={() => handleTabClick(0)}>   {/* ✅ className */}
                                                    <div className="skolrup-profile-tab-link">Summary Overview</div>
                                                </a>
                                            </li>
                                            <li className={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                                                <a className="nav-link" onClick={() => handleTabClick(1)}>
                                                    <div className="skolrup-profile-tab-link">Detailed Records</div>
                                                </a>
                                            </li>
                                        </ul>


                                    </div>
                                    {activeTab === 0 && (

                                        <>
                                            <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                                <div className="">
                                                    <div>
                                                        {projectStats && Object.keys(projectStats).length > 0 && (
                                                            <div className="oxyem-top-box-design design-only-attendence attendence-top-data-main leave-top-data-main mx-0 row stats-grid">

                                                                {/* Active Projects */}
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                    <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("Active")}>
                                                                        <img src='/assets/img/active-icon.png' alt="active" />
                                                                        <div className='ox-colored-box-1'>
                                                                            <h4 className='all_attendence'>
                                                                                {projectStats.totalActive}
                                                                            </h4>
                                                                        </div>
                                                                        <div className='ox-box-text'><h6>Active</h6></div>
                                                                    </div>
                                                                </div>

                                                                {/* Inactive Projects */}
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                    <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("Inactive")}>
                                                                        <img src='/assets/img/inactive-icon.png' alt="inactive" />
                                                                        <div className='ox-colored-box-2'>
                                                                            <h4 className='month_attendence'>
                                                                                {projectStats.totalInactive}
                                                                            </h4>
                                                                        </div>
                                                                        <div className='ox-box-text'><h6>Inactive</h6></div>
                                                                    </div>
                                                                </div>

                                                                {/* Expiring This Month */}
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                    <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("ExpiringThisMonth")}>
                                                                        <img src='/assets/img/expiring-icon.png' alt="expiring" />
                                                                        <div className='ox-colored-box-3'>
                                                                            <h4 className='notsubmit_attendence'>
                                                                                {projectStats.totalExpiringThisMonth}
                                                                            </h4>
                                                                        </div>
                                                                        <div className='ox-box-text'><h6>Expiring This Month</h6></div>
                                                                    </div>
                                                                </div>

                                                                {/* Draft Projects */}
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                    <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("Draft")}>
                                                                        <img src='/assets/img/draft-icon.png' alt="draft" />
                                                                        <div className='ox-colored-box-4'>
                                                                            <h4 className='week_attendence'>
                                                                                {projectStats.totalDraft}
                                                                            </h4>
                                                                        </div>
                                                                        <div className='ox-box-text'><h6>Draft</h6></div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                                                <div className="tab-content">
                                                    {isProjectChartOpen && (
                                                        <div>
                                                            <div className="row">
                                                                {/* 📊 Chart 1: Project Status (Bar) */}
                                                                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className="oxy_chat_box">
                                                                        <div className="graph-top-head">
                                                                            <h3>Projects by Status</h3>
                                                                        </div>
                                                                        {projectStatusBarChartData && (
                                                                            <Chart
                                                                                options={projectStatusBarChartData.options}
                                                                                series={projectStatusBarChartData.series}
                                                                                type="bar"
                                                                                height={330}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* 📊 Chart 2: Project by Client (Bar) */}
                                                                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className="oxy_chat_box">
                                                                        <div className="graph-top-head">
                                                                            <h3>Projects by Client</h3>
                                                                        </div>
                                                                        {projectClientBarChartData && (
                                                                            <Chart
                                                                                options={projectClientBarChartData.options}
                                                                                series={projectClientBarChartData.series}
                                                                                type="bar"
                                                                                height={330}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>

                                                            {/* <div className="row mt-4"> */}
                                                                {/* 📊 Chart 3: Project End Date (Area / Line) */}
                                                                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className="oxy_chat_box">
                                                                        <div className="graph-top-head">
                                                                            <h3>Projects by End Date</h3>
                                                                        </div>
                                                                        {projectEndDateLineChartData && (
                                                                            <Chart
                                                                                options={projectEndDateLineChartData.options}
                                                                                series={projectEndDateLineChartData.series}
                                                                                type="bar"
                                                                                height={330}
                                                                            />
                                                                        )}

                                                                    </div>
                                                                </div>

                                                                {/* 📊 Chart 4: Project vs Opportunities (Donut) */}
                                                                {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className="oxy_chat_box">
                                                                        <div className="graph-top-head">
                                                                            <h3>Projects vs Opportunities</h3>
                                                                        </div>
                                                                        {projectTypeDonutChartData && (
                                                                            <Chart
                                                                                options={projectTypeDonutChartData.options}
                                                                                series={projectTypeDonutChartData.series}
                                                                                type="donut"
                                                                                width="100%"
                                                                                height="90%"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div> */}
                                                            {/* </div> */}
                                                        </div>
                                                            </div>

                                                    )}


                                                </div>

                                            </div>
                                        </>
                                    )}
                                    {activeTab === 1 && (
                                        <div className="row">
                                            <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                                <div className="card flex-fill comman-shadow oxyem-index" id='project-list-page'>
                                                    <div className="center-part">
                                                        <div className="card-body oxyem-mobile-card-body">
                                                            <div className="col-md-6">{activeStatus !== null && (
                                                                <div className="active-filter-tag">
                                                                    <span> {typeof activeStatus === "string"
                                                                        ? activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)
                                                                        : activeStatus}</span>
                                                                    <button onClick={() => handleShowDataForStatus('clr')} className="remove-filter-btn">×</button>
                                                                </div>
                                                            )}</div>
                                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                <div className="row">
                                                                    <div className="filter-section">
                                                                        <MUIDataTable
                                                                            title={<div className={"oxyem-table-tittle"}></div>}
                                                                            data={data}
                                                                            columns={columns}
                                                                            options={options}
                                                                        />
                                                                    </div>
                                                                    {formdata.map((projectData, index) => {
                                                                        const project = Object.fromEntries(projectData.map(item => [item.name, item.value]));
                                                                        const isExpanded = expandedDescriptions[index]; // Check if this description is expanded

                                                                        const toggleDescription = () => {
                                                                            setExpandedDescriptions(prev => ({
                                                                                ...prev,
                                                                                [index]: !prev[index]
                                                                            }));
                                                                        };

                                                                        const descriptionText = project.Description || '';
                                                                        const shouldTruncate = descriptionText.length > 115 && !isExpanded;
                                                                        const displayedDescription = shouldTruncate
                                                                            ? descriptionText.slice(0, 115) + '...'
                                                                            : descriptionText;
                                                                        const fullName = project.projectName || "";
                                                                        const shortName = fullName.length > 27 ? fullName.slice(0, 27) + "..." : fullName;
                                                                        const showTooltipIcon = fullName.length > 27;
                                                                        return (
                                                                            <div className="col-md-4" key={project.id}>
                                                                                <div className="projectcard"> 
                                                                                    <Link href={`/projects/view/${project.id}`} className='project-ox-colored-box-3'>{project.projectCode}</Link>
                                                                                    <Link
                                                                                        href={`/projects/view/${project.id}`}
                                                                                        className='main-head-txt'
                                                                                    >
                                                                                        {shortName} 
                                                                                        {showTooltipIcon && (
                                                                                        <span data-tooltip-id="my-tooltip-datatable"
                                                                                        data-tooltip-content={fullName}><GrTooltip/></span>
                                                                                        )}
                                                                                    </Link>
                                                                                    <h3 className='main-head-sub-txt'>Client Name: <span>{project.clientName} </span></h3>
                                                                                    <span className={`project-status oxyem-mark-${project.status}`}>{project.status}</span>
                                                                                    <p className='discript-text'>
                                                                                        {displayedDescription}
                                                                                        {descriptionText.length > 115 && (
                                                                                            <span
                                                                                                onClick={toggleDescription}
                                                                                                style={{ color: '#004d95', cursor: 'pointer', marginLeft: '5px', fontSize: '10px', fontWeight: '700' }}
                                                                                            >
                                                                                                {isExpanded ? 'Show less' : 'Show more'}
                                                                                            </span>
                                                                                        )}
                                                                                    </p>
                                                                                    <div className='d-flex date-info-sec'>
                                                                                        <p style={{ width: '50%', fontSize: '11.2px' }}>Start: <span style={{ color: '#004d95' }}>{project.startDate}</span></p>
                                                                                        <p style={{ width: '50%', textAlign: 'end', fontSize: '11.2px' }}>End: <span style={{ color: '#004d95' }}>{project.endDate}</span></p>
                                                                                    </div>
                                                                                    <div className="menu-wrapper-p" ref={(el) => (menuRefs.current[index] = el)}>
                                                                                        <button className="menu-button-p" onClick={() => toggleMenu(index)}><HiDotsVertical /></button>
                                                                                        {openMenuIndex === index && (
                                                                                            <div className="dropdown">
                                                                                                {project.action.map(action => (
                                                                                                    <>
                                                                                                        {action.type === "view" ? (
                                                                                                            <Link
                                                                                                                href={`/projects/view/${project.id}`}
                                                                                                                key={action.type}
                                                                                                                disabled={!action.isEnable}
                                                                                                                className="dropdown-item view-btn-p"
                                                                                                            >
                                                                                                                <GoEye />{action.type}
                                                                                                            </Link>
                                                                                                        ) : action.type === "edit" ? (
                                                                                                            <Link
                                                                                                                href={`/projects/edit/${project.id}`}
                                                                                                                key={action.type}
                                                                                                                disabled={!action.isEnable}
                                                                                                                className="dropdown-item edit-btn-p"
                                                                                                            >
                                                                                                                <BiEdit />{action.type}
                                                                                                            </Link>
                                                                                                        ) : action.type === "delete" ? (
                                                                                                            <button
                                                                                                                onClick={() => onDeleteClick(project.id)}
                                                                                                                key={action.type}
                                                                                                                disabled={!action.isEnable}
                                                                                                                className="dropdown-item delete-btn-p"
                                                                                                            >
                                                                                                                <RiDeleteBin6Line />Deactivate
                                                                                                            </button>
                                                                                                        ) : null
                                                                                                        }
                                                                                                    </>
                                                                                                ))}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                                        <div>
                                                                                            <GrResources /> {project.noOfResources} Resources
                                                                                        </div>
                                                                                        <GroupAvatar users={project?.allocationPercentage} maxVisible={5} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {pageCount ?
                                                                        <div className='pagination-section'>
                                                                            <div className='row-per-page'>
                                                                                <div className='text-card-pagi'>Per page:</div>
                                                                                <select
                                                                                    value={itemsPerPage}
                                                                                    onChange={(e) => {
                                                                                        setItemsPerPage(Number(e.target.value));
                                                                                        setCurrentPage(0); // reset page
                                                                                    }}
                                                                                >
                                                                                    <option value={6}>6</option>
                                                                                    <option value={12}>12</option>
                                                                                    <option value={18}>18</option>
                                                                                    <option value={50}>50</option>
                                                                                    <option value={100}>100</option>
                                                                                </select>
                                                                            </div>
                                                                            <ReactPaginate
                                                                                breakLabel="..."
                                                                                nextLabel="→"
                                                                                onPageChange={handlePageClick}
                                                                                pageRangeDisplayed={5}
                                                                                pageCount={pageCount}
                                                                                previousLabel="←"
                                                                                renderOnZeroPageCount={null}
                                                                                containerClassName="pagination"
                                                                                activeClassName="active"
                                                                                forcePage={currentPage}
                                                                            />
                                                                        </div>
                                                                        : null}
                                                                </div>
                                                            </div>
                                                            <Tooltip id="my-tooltip-datatable" style={{ zIndex: 99999, textTransform: "capitalize", backgroundColor:"#004d95" }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster
                position="top-right"
                reverseOrder={false}

            />
        </>
    );
}