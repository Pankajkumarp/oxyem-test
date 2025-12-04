import React, { useState, useEffect, useRef } from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { GrResources } from "react-icons/gr";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";
import ReactPaginate from 'react-paginate';
import MUIDataTable from "mui-datatables";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoEye } from "react-icons/go";
import Link from 'next/link';
import Avatar from 'react-avatar';
import { GrTooltip } from "react-icons/gr";
import DeleteModalProject from '../../Components/Popup/DeleteModalProject.jsx';

export default function ProjectList({ empId }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [searchfilter, setSearchfilter] = useState({});


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
        <div className="row">
            <DeleteModalProject isOpen={isModalOpendelete} closeModal={closeModalInputselect} onConformationClick={onConformationClick} />
            <div className="col-12 px-4">
                <div className="row" id='project-list-page'>
                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border px-3" id="sk-create-page">
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
                                                        data-tooltip-content={fullName}><GrTooltip /></span>
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
                </div>
            </div>
        </div>
    )
}
