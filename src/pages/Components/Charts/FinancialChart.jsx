import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";
import SelectComponent from "../common/SelectOption/SelectComponent.jsx";
import ClientFinancialChart from "./ClientFinancialChart.jsx";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const FinancialChart = ({ activeTab }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [revenueComparison, setRevenueComparison] = useState({});
  const [revenueTrend, setRevenueTrend] = useState({});
  const [expenses, setExpenses] = useState({});
  const [netProfit, setNetProfit] = useState(0);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);


  const fetchFinancialData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/opportunity/financeRevenueStatsAndCharts`, { params: { "currency": selectedCurrency } });
      if (response) {
        const data = response.data.data;

        // Revenue comparison card
        setRevenueComparison({
          currentValue: (
            parseFloat(data.revenueComparison.data[0].toString().replace(/[^0-9.-]+/g, ""))
          ).toFixed(0),
          previousValue: (
            parseFloat(data.revenueComparison.data[1].toString().replace(/[^0-9.-]+/g, ""))
          ).toFixed(0),
          currentLabel: data.revenueComparison.lables[0],
          previousLabel: data.revenueComparison.lables[1],
          currencySymbol: data.currencySymbol,
        });

        setRevenueTrend({
          series: [
            {
              name: "Revenue",
              data: data.revenueTrend.series.map((val) =>
                (parseFloat(val)
                ).toFixed(0)),
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
            plotOptions: {
              bar: {
                columnWidth: "50%",
                borderRadius: 0,
              },
            },
            stroke: { width: 0 },
            grid: {
              row: {
                colors: ["#fff", "#f2f2f2"],
              },
            },
            colors: ["#156082", "#f3797e"],
            dataLabels: { enabled: false },
            xaxis: {
              categories: data.revenueTrend.labels,
            },
            title: {
              text: "Revenue",
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


        // Expenses pie chart
        setExpenses({
          series: data.expenses.series.map((val) => Number((parseFloat(val)).toFixed(0))), // ✅ convert to numbers
          options: {
            chart: {
              type: "pie"
            },
            labels: data.expenses.labels,
            legend: {
              position: "bottom",
              fontSize: "12px",
              fontFamily: "Helvetica Now MT Micro Regular",
            },
            colors: ["#156082", "#e97132", "#32b3d3ff"],
            title: {
              text: "Total Expense",
              align: "center",
              margin: 20,
              style: {
                fontSize: "13px",
                fontFamily: "Helvetica Now MT Micro Regular",
                fontWeight: "500",
                color: "#263238",
              },
            },
            dataLabels: {
              formatter: function (val, opts) {
                const label = opts.w.globals.labels[opts.seriesIndex];
                const value = opts.w.config.series[opts.seriesIndex].toLocaleString("en-IN");
                const currencySymbol = opts.w.config.currencySymbol || "";
                return `${label}: ${currencySymbol}${value}`;
              },
            },
            currencySymbol: data.currencySymbol,
          },
        });


        setNetProfit(
          Number(
            (parseFloat(
              data.netProfit.toString().replace(/[^0-9.-]+/g, "")
            )).toFixed(0)
          )
        );



        setShowGraph(true);
      }
    } catch (err) {
      console.error("Error fetching financial data:", err);
    }
  };


  useEffect(() => {
    if (activeTab === "Financial" && selectedCurrency) {
      fetchFinancialData();
    }
  }, [activeTab, selectedCurrency]);



  useEffect(() => {
    const fetchCurrencyList = async () => {
      try {

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { params: { "isFor": "currencylist" } });

        const formattedOptions = response.data.data.map(item => ({
          label: item.currencyName,
          value: item.id,
        }));
        setCurrencyOptions(formattedOptions);
        // Set default currency to INR
        const inrOption = formattedOptions.find(option =>
          option.label === "Indian Rupees - INR"
        );

        if (inrOption) {
          setSelectedCurrency(inrOption.value);
        }
      } catch (error) {
        console.error('Failed to fetch currency list', error);
      }
    };

    fetchCurrencyList();
  }, []);

  const handleCurrencyChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    setSelectedCurrency(value);

  };



  return (
    <div id="financial-chart" className="row mb-3">

      <div className="col-md-8">
      </div>
      <div className="col-md-4">
        <div className="form-group">
          <SelectComponent label={"Filter Data by Currency"} placeholder={""} options={currencyOptions} onChange={handleCurrencyChange} value={selectedCurrency} />
        </div>
      </div>
      {/* Revenue Comparison Card */}
      <div className="col-12 col-md-3 custom_padding_taskbar">
        <div className="oxy_chat_box text-center revenue-box">
          {showGraph ? (
            <>

              <small className="revenue-unit">(in 1000s)</small>
              <div className="revenue-inside-box">
                <h4 className="revenue-value">{revenueComparison.currencySymbol}
                  {revenueComparison.currentValue}</h4>
                <p className="revenue-labels">{revenueComparison.currentLabel}</p>
                <h4 className="revenue-value">{revenueComparison.currencySymbol}
                  {revenueComparison.previousValue}</h4>
                <p className="revenue-labels">{revenueComparison.previousLabel}</p>
              </div>
            </>
          ) : null}
        </div>
      </div>


      {/* Revenue Bar Chart */}
      <div className="col-12 col-md-3 custom_padding_taskbar">
        <div className="oxy_chat_box">
          {showGraph ? (
            <Chart
              options={revenueTrend.options}
              series={revenueTrend.series}
              type="bar"
              height={330}
            />
          ) : null}
        </div>
      </div>

      {/* Expense Pie Chart */}
      <div className="col-12 col-md-3 custom_padding_taskbar">
        <div className="oxy_chat_box">
          {showGraph ? (
            <Chart
              options={expenses.options}
              series={expenses.series}
              type="pie"
              height={330}
            />
          ) : null}
        </div>
      </div>

      {/* Net Profit Card */}
      <div className="col-12 col-md-3 custom_padding_taskbar">

        <div className="oxy_chat_box text-center  revenue-box">
          <small className="revenue-unit">(in 1000s)</small>
          {showGraph ? (
            <div className="revenue-inside-box">
              <h4 className="revenue-value" style={{ color: netProfit >= 0 ? "green" : "red" }}>
                {revenueComparison.currencySymbol}{netProfit}
              </h4>

              <p className="revenue-labels">Net Profit / Loss</p>
            </div>
          ) : null}
        </div>
      </div>
      <div>
        <ClientFinancialChart selectedCurrency={selectedCurrency} />
      </div>
      {/* <FinancialChartDetailDrawer  isOpen={isDetailDrawerOpen}
      onClose={() => setIsDetailDrawerOpen(false)}
      tableData={detailTableData}/> */}
    </div>
  );
};

export default FinancialChart;
