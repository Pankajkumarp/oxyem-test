"use client";

import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";

export default function FilterBar({ GetFilterValue, GetStatusValue }) {
    const [filters, setFilters] = useState({
        dateRange: "",
        idManager: "",
        status: "",
        idEmployee: "",
        overdueOnly: false,
    });

    const [dateRangeOptions, setdateRangeOptions] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);
    const [members, setMembers] = useState([]);
    const [status, setStatus] = useState([]);
    const fetchdateRange = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}/timesheet/getTimeSheetDate`)

            if (response?.data) {
                const apiResponse = response?.data
                setdateRangeOptions([
                    ...apiResponse.map((item) => ({
                        label: item.label,
                        value: item.key,
                    })),
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchEmployessByManager = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}/timesheet/getEmployessByManager`)

            if (response?.data?.data) {
                const apiResponse = response?.data?.data
                setMembers([
                    ...apiResponse.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })),
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchProjectMangerData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}/timesheet/getProjectMangersDropdown`)

            if (response?.data?.data) {
                const apiResponse = response?.data?.data
                setProjectManagers([
                    ...apiResponse.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })),
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchProjectStausData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                params: {
                    isFor: "timeshet_status"
                },
            })

            if (response?.data?.data) {
                const apiResponse = response?.data?.data
                GetStatusValue(apiResponse)
                setStatus([
                    ...apiResponse.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })),
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchdateRange()
        fetchEmployessByManager();
        fetchProjectMangerData();
        fetchProjectStausData();
    }, []);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...filters,
            overdueOnly: filters.overdueOnly ? "overdue" : "",
        };
        GetFilterValue(payload)
    };






    return (
        <form
            className="filter-bar-oxyem"
            onSubmit={handleSubmit}
        >
            <CustomSelect
                options={dateRangeOptions}
                value={filters.dateRange}
                placeholder="Select Date range"
                onChange={(val) => updateFilter("dateRange", val)}
            />

            <CustomSelect
                options={projectManagers}
                value={filters.idManager}
                placeholder="Select Project manager"
                onChange={(val) => updateFilter("idManager", val)}
            />

            <CustomSelect
                options={status}
                value={filters.status}
                placeholder="Select Status"
                onChange={(val) => updateFilter("status", val)}
            />

            <CustomSelect
                options={members}
                value={filters.idEmployee}
                placeholder="Select Team member"
                onChange={(val) => updateFilter("idEmployee", val)}
            />

            <div className="filter-check-oxyem">
                <input
                    type="checkbox"
                    checked={filters.overdueOnly}
                    onChange={(e) =>
                        updateFilter("overdueOnly", e.target.checked)
                    }
                />
                <label>Overdue Only</label>
            </div>
            <button type="submit" className="btn btn-primary apply-btn">
                Apply Filters
            </button>
        </form>
    );
}
