import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { axiosJWT } from "../../../Auth/AddAuthorization.jsx";
import { FaRegEye } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

export default function NormalTable({ apiPath, searchfilter, showCheckbox, onclickButton, onclickHistroy, handleEditClick }) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(0); // backend is 0-based
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

    const [users, setUsers] = useState({
        formColumns: [],
        formdata: [],
        totalCount: 0,
    });

    const [loading, setLoading] = useState(false);

    // 🔹 API CALL
    const fetchData = async () => {
        let cleanedSearchFilter = {};
        if (searchfilter && typeof searchfilter === 'object') {
            cleanedSearchFilter = Object.fromEntries(
                Object.entries(searchfilter).filter(([v]) => v !== '' && v !== null && v !== undefined)
            );
        }
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(
                `${apiUrl}${apiPath}`,
                {
                    params: {
                        page: currentPage,
                        limit: rowsPerPage,
                        sort: sortConfig.key,
                        order: sortConfig.direction,
                        search,
                        ...cleanedSearchFilter
                    },
                }
            );

            if (response?.data?.data) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 TRIGGER API
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, rowsPerPage, sortConfig, search, apiPath, searchfilter]);

    const totalPages = Math.ceil(users.totalCount / rowsPerPage);

    // 🔹 SORT HANDLER
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
        setCurrentPage(0);
    };



    return (
        <div className="table-responsive custom-made-table">
            {/* 🔹 TOP BAR */}
            <div className="mb-3 custom-top-table-design">
                <div className="custom-top-table-design-input">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, email"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(0);
                        }}
                    />
                    <FaSearch />
                </div>

                <div className="d-flex justify-content-end align-items-center custom-pagination-sort">
                    <div className="display-select-count">
                        Per Page
                        <select
                            className="form-selec-c"
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(0);
                            }}
                        >
                            {[4, 10, 20, 50, 100].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="display-count">
                        {(currentPage + 1) * rowsPerPage > users.totalCount
                            ? users.totalCount
                            : (currentPage + 1) * rowsPerPage}{" "}
                        of {users.totalCount} Role displayed
                    </div>

                    <div>
                        <button
                            className="btn-outline-primary-re"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                            disabled={currentPage === 0}
                        >
                            <GrPrevious />
                        </button>

                        <button
                            className="btn-outline-primary-re"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                            disabled={currentPage >= totalPages - 1}
                        >
                            <GrNext />
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔹 TABLE */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        {showCheckbox ? (
                            <th>
                                <input type="checkbox" disabled={true} checked={true} />
                            </th>
                        ) : (null)}
                        {users?.formColumns
                            .filter((col) => col.name !== "id")
                            .map((col) => (
                                <th
                                    key={col.name}
                                    onClick={() => handleSort(col.name)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {col.lebel}
                                    {sortConfig.key === col.name &&
                                        (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                                </th>
                            ))}
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={users?.formColumns.length + 1} className="text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : users?.formdata.length > 0 ? (
                        users.formdata.map((row, index) => {
                            const rowObj = Object.fromEntries(
                                row.map((item) => [item.name, item.value])
                            );

                            return (
                                <tr key={rowObj.id || index}>
                                    {showCheckbox ? (
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled={true}
                                                checked={true}
                                            />
                                        </td>
                                    ) : (null)}
                                    {users.formColumns
                                        .filter((col) => col.name !== "id")
                                        .map((col) => (
                                            <td key={col.name}>
                                                {col.name === "status" ? (
                                                    <span className={`oxyem-mark-${rowObj.status}`}>
                                                        {rowObj.status}
                                                    </span>
                                                ) : col.name === "action" ? (
                                                    <div className="d-flex gap-2 align-items-center">
                                                        {Array.isArray(rowObj.action) &&
                                                            rowObj.action.map((act, i) => {
                                                                if (!act.isEnable) return null;

                                                                if (act.type === "view") {
                                                                    return (
                                                                        <FaRegEye
                                                                            key={`view-${i}`}
                                                                            className="eye-icon-tab"
                                                                            title="View"
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => onclickButton("view", rowObj)}
                                                                        />
                                                                    );
                                                                }

                                                                if (act.type === "history") {
                                                                    return (
                                                                        <FaHistory
                                                                            key={`history-${i}`}
                                                                            className="history-icon-tab"
                                                                            title="History"
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => onclickHistroy("history", rowObj)}
                                                                        />
                                                                    );
                                                                }
                                                                if (act.type === "edit") {
                                                                    return (
                                                                        <FiEdit
                                                                            key={`Edit-${i}`}
                                                                            className="history-icon-tab"
                                                                            title="Edit"
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => handleEditClick("edit", rowObj)}
                                                                        />
                                                                    );
                                                                }

                                                                return null;
                                                            })}
                                                    </div>
                                                ) : (
                                                    rowObj[col.name]
                                                )}
                                            </td>

                                        ))}

                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={users.formColumns.length + 1} className="text-center">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
