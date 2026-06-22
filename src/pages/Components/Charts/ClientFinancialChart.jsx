import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ClientFinancialChart = ({ selectedCurrency }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [topClients, setTopClients] = useState({});
  const [monthlyRevenueExpense, setMonthlyRevenueExpense] = useState({});
  const [topProjects, setTopProjects] = useState({});
  // const [selectedCurrency, setSelectedCurrency] = useState(null);

  const fetchClientFinancialData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/opportunity/clinetFinanceRevenueStatsAndCharts`, { params: { "currency": selectedCurrency } });
      if (response) {
        const data = response.data.data;
        // Top 10 Clients
        setTopClients({
          series: [
            {
              name: "Revenue",
              data: data.topClients.series.map(
                (val) => parseFloat(val)
              ).map((val) => Number(val.toFixed(0))),
            },
          ],
          options: {
            chart: {
              type: "bar",
              height: 350,
              stacked: true,
              toolbar: { show: true },
              zoom: { enabled: true },
            },
            legend: {show: false},
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 0,
              },
            },
            stroke: { width: 0 },
            grid: { row: { colors: ["#fff", "#f2f2f2"] } },
            dataLabels: { enabled: false },
            colors: ["#156082", "#e97132"],
            xaxis: { categories: data.topClients.labels },
            title: {
              text: "Top 10 Clients as per Revenue",
              align: "center",
              margin: 20,
              style: {
                fontSize: "13px",
                fontFamily: "Helvetica Now MT Micro Regular",
                fontWeight: "500",
                color: "#263238",
              },
            },
          },
        });

        // Monthly Revenue vs Expense
        setMonthlyRevenueExpense({
          series: data.monthlyRevenueExpense.series.map((serie) => ({
            ...serie,
            data: serie.data.map(
              (val) => Math.round(parseFloat(val))
            ),
          })),
          options: {
            chart: {
              type: "bar",
              height: 350,
              stacked: false,
              toolbar: { show: true },
              zoom: { enabled: true },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "40%",
                borderRadius: 0,
              },
            },
            stroke: { width: 0 },
            grid: { row: { colors: ["#fff", "#f2f2f2"] } },
            dataLabels: { enabled: false },
            colors: ["#156082", "#e97132"],
            xaxis: { categories: data.monthlyRevenueExpense.labels },
            legend: {
              position: "bottom", offsetY: 8,
              offsetX: 0,
            },

            title: {
              text: "Monthly Revenue and Expense",
              align: "center",
              margin: 20,
              style: {
                fontSize: "13px",
                fontFamily: "Helvetica Now MT Micro Regular",
                fontWeight: "500",
                color: "#263238",
              },
            },
          },
        });

        // Top 10 Projects
        setTopProjects({
          series: [
            {
              name: "Projects",
              data: data.topProjects.series.map(
                (val) => Math.round(parseFloat(val))
              ),
            },
          ],
          options: {
            chart: {
              type: "bar",
              height: 350,
              stacked: true,
              toolbar: { show: true },
              zoom: { enabled: true },
            },
            legend: {show: false},
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 0,
              },
            },
            stroke: { width: 0 },
            grid: { row: { colors: ["#fff", "#f2f2f2"] } },
            dataLabels: { enabled: false },
            colors: ["#156082", "#e97132"],
            xaxis: { categories: data.topProjects.labels },
            title: {
              text: "Top 10 Projects",
              align: "center",
              margin: 20,
              style: {
                fontSize: "13px",
                fontFamily: "Helvetica Now MT Micro Regular",
                fontWeight: "500",
                color: "#263238",
              },
            },
          },
        });


        setShowGraph(true);
      }
    } catch (err) {
      console.error("Error fetching client financial data:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClientFinancialData();
  }, [selectedCurrency]);

  return (
    <div className="row mb-3">
      {/* Top Clients */}
      <div className="col-12 col-md-4 custom_padding_taskbar">
        <div className="oxy_chat_box">
          {showGraph ? (
            <Chart
              options={topClients.options}
              series={topClients.series}
              type="bar"
              height={330}
            />
          ) : null}
        </div>
      </div>

      {/* Monthly Revenue vs Expense */}
      <div className="col-12 col-md-4 custom_padding_taskbar">
        <div className="oxy_chat_box">
          {showGraph ? (
            <Chart
              options={monthlyRevenueExpense.options}
              series={monthlyRevenueExpense.series}
              type="bar"
              height={330}
            />
          ) : null}
        </div>
      </div>

      {/* Top Projects */}
      <div className="col-12 col-md-4 custom_padding_taskbar">
        <div className="oxy_chat_box">
          {showGraph ? (
            <Chart
              options={topProjects.options}
              series={topProjects.series}
              type="bar"
              height={330}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ClientFinancialChart;
