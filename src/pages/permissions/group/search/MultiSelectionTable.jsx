import React, { useState, useEffect  } from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { GrNext, GrPrevious  } from "react-icons/gr";
import { axiosJWT } from "../../../Auth/AddAuthorization.jsx";

const ModuleRow = ({ item, level, expandedRows, setExpandedRows, rootModules, highlightChildren = false, }) => {
    const hasChildren = item.modules?.length > 0;
    const toggleExpand = () => {
        setExpandedRows(prev =>
            prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
        );
    };
    return (
        <>
            <tr className={`module-row level-${level} ${highlightChildren ? "row-active" : ""}`}>
                <td>
                    <input
                        type="checkbox"
                        disabled={true}
                        checked={true}
                        className="select-checkbox-table"
                    />
                </td>
                <td className="medium-length-box second-td-multi">
                    {item.moduleName}
                    {hasChildren && (
                        <button onClick={toggleExpand} className="btn-table-toggle">
                            {expandedRows.includes(item.id) ? <FiMinusCircle /> : <FiPlusCircle />}
                        </button>
                    )}
                </td>
                <td className="medium-length-box">{item.createDate}</td>
                <td className="medium-length-box"><span className={`oxyem-mark-${item.status}`}>{item.status}</span></td>
                <td className="large-length-box">{item.description}</td>
            </tr>
            {hasChildren && expandedRows.includes(item.id) && item.modules.map(child => (
                <ModuleRow
                    key={child.id}
                    item={child}
                    level={level + 1}
                    expandedRows={expandedRows}
                    setExpandedRows={setExpandedRows}
                    rootModules={rootModules}
                    highlightChildren={highlightChildren}
                />
            ))}
        </>
    );
};

export default function MultiSelectionTable({
    apiPath, searchfilter
}) {
    const [moduleInfo, setModuleInfo] = useState({
        columns: [],
        modulesData: [],
        totalCount: 0,
    });

    const [expandedRows, setExpandedRows] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
		let cleanedSearchFilter = {};
		if (searchfilter && typeof searchfilter === 'object') {
			cleanedSearchFilter = Object.fromEntries(
			Object.entries(searchfilter).filter(([ v]) => v !== '' && v !== null && v !== undefined)
		);
		}
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}${apiPath}`, {
                params: {
                    page: currentPage,
                    limit: rowsPerPage,
                    sort: sortConfig.key,
                    order: sortConfig.direction,
                    search,
					...cleanedSearchFilter
                },
            });

            if (response?.data?.data) {
                setModuleInfo({
                    columns: response.data.data.columns || [],
                    modulesData: response.data.data.modulesData || [],
                    totalCount: response.data.data.totalCount || 0,
                });
            }
        } catch (error) {
            console.error("Failed to fetch modules:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, rowsPerPage, sortConfig, search, apiPath, searchfilter]);

    const totalPages = Math.ceil(moduleInfo.totalCount / rowsPerPage);
    const currentModules = moduleInfo.modulesData;

    /* ---------------- Render ---------------- */

    return (
        <div className="table-responsive custom-table-multi-lable">
            {/* Top Controls */}
            <div className="mb-3 custom-top-table-design">
                <div className="custom-top-table-design-input">
                    <input
                        type="text"
                        placeholder="Search modules..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="form-control"
                    />
                    <FaSearch />
                </div>

                <div className="d-flex justify-content-end align-items-center custom-pagination-sort">
                    <div className="custom-select-multi">
                        Per Page:
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="form-select-m ms-2"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <div className="display-count">
                        {moduleInfo.totalCount === 0
                            ? "0 of 0"
                            : `${currentModules.length} of ${moduleInfo.totalCount} Modules`}
                    </div>

                    <div>
                        <button
                            className="btn-outline-primary-re"
                            onClick={() =>
                                setCurrentPage(prev => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                        >
                            <GrPrevious />
                        </button>

                        <button
                            className="btn-outline-primary-re"
                            onClick={() =>
                                setCurrentPage(prev =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            <GrNext />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
								disabled={true}
                                checked={true}
                            />
                        </th>
                        {moduleInfo.columns.map(col => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={moduleInfo.columns.length + 1}>
                                Loading...
                            </td>
                        </tr>
                    ) : currentModules.length === 0 ? (
                        <tr>
                            <td colSpan={moduleInfo.columns.length + 1}>
                                No data found
                            </td>
                        </tr>
                    ) : (
                        currentModules.map(module => (
                            <ModuleRow
                                key={module.id}
                                item={module}
                                level={0}
                                expandedRows={expandedRows}
                                setExpandedRows={setExpandedRows}
                                rootModules={currentModules}
                                highlightChildren={expandedRows.includes(
                                    module.id
                                )}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
