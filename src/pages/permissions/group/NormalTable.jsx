import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";

export default function NormalTable({ selectedIds, setSelectedIds, apiPath }) {
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
        fetchData();
    }, [currentPage, rowsPerPage, sortConfig, search]);

    const totalPages = Math.ceil(users.totalCount / rowsPerPage);

    // 🔹 SORT HANDLER
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
        setCurrentPage(0);
    };

    // 🔹 SELECT HANDLERS
    const handleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
  if (e.target.checked) {
    const ids = users.formdata
      .map((row) => {
        const rowObj = Object.fromEntries(
          row.map((item) => [item.name, item.value])
        );

        return rowObj.status?.toLowerCase() !== "inactive"
          ? rowObj.id
          : null;
      })
      .filter(Boolean);

    setSelectedIds(ids);
  } else {
    setSelectedIds([]);
  }
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
                        <th>
                            <input type="checkbox" onChange={handleSelectAll} />
                        </th>

                        {users.formColumns
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
                            <td colSpan={users.formColumns.length + 1} className="text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : users.formdata.length > 0 ? (
                        users.formdata.map((row, index) => {
                            const rowObj = Object.fromEntries(
                                row.map((item) => [item.name, item.value])
                            );

                            return (
                                <tr key={rowObj.id || index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            disabled={rowObj.status?.toLowerCase() === "inactive"}
                                            checked={selectedIds.includes(rowObj.id)}
                                            onChange={() => handleSelectRow(rowObj.id)}
                                        />

                                    </td>

                                    {users.formColumns
                                        .filter((col) => col.name !== "id")
                                        .map((col) => (
                                            <td key={col.name}>
                                                {col.name === "status" ? (
                                                    <span className={`oxyem-mark-${rowObj.status}`}>
                                                        {rowObj.status}
                                                    </span>
                                                ) : (
                                                    rowObj[col.name] ?? "-"
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
