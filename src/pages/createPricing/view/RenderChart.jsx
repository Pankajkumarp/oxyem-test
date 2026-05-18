import React, { useState, useEffect, useRef } from "react";

export default function RenderChart({ showGraph, chartData, totalCostGraph, colors }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);
const graphRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      graphRef.current &&
      !graphRef.current.contains(event.target)
    ) {
      setHoveredSlice(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const CustomDonutChart = ({ data, total }) => {
    const size = 200;
    const strokeWidth = 35;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;

    return (
      <svg width={size} height={size}>
        {data.map((item, index) => {
          const percent = item.value / total;
          const dash = percent * circumference;

          const circle = (
            <circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              strokeLinecap="butt"
              pointerEvents="stroke"   // ✅ IMPORTANT FIX
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                setHoveredSlice({
                  label: item.label,
                  value: item.value,
                  x: e.clientX,
                  y: e.clientY
                })
              }
              onMouseLeave={() => setHoveredSlice(null)}
            />
          );

          offset += dash;
          return circle;
        })}

        {/* Center Text */}
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fontSize="12"
          fill="#6B7280"
          fontWeight="600"
        >
          Total Cost
        </text>

        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#111827"
        >
          ₹ {total.toLocaleString("en-IN")}
        </text>
      </svg>
    );
  };

  // -------- legend --------
  const CustomLegend = ({ data }) => (
    <div  className="graph-div-opp-conetnt" style={{ marginLeft: 8 }}>
      {data.map((item, index) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            fontSize: 11
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              minWidth:10,
              borderRadius: "50%",
              backgroundColor: colors[index % colors.length],
              marginRight: 5
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );

  // -------- tooltip --------
  const Tooltip = ({ data }) => {
    if (!data) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: data.y + 10,
          left: data.x + 10,
          background: "#fff",
          color: "#6e2f9d",
          border: "1px solid #6e2f9d",
          padding: "10px 15px",
          borderRadius: 1,
          fontSize: 11,
          pointerEvents: "none",
          boxshadow: "0 1px 2px #000000",
          zIndex: 1000,
          lineHeight: "13px"
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 5 }}>{data.label}</div>
        <div style={{ fontSize: 12.2, fontWeight: 600}}>₹ {data.value.toLocaleString("en-IN")}</div>
      </div>
    );
  };

  // -------- render --------
  if (!showGraph) return null;

  return (
    <div 
    className="d-b-g"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        position: "relative"
      }}
    >
      <span ref={graphRef}>
      <CustomDonutChart data={chartData} total={totalCostGraph} />
      </span>
      <CustomLegend data={chartData} />
      <Tooltip data={hoveredSlice} />
    </div>
  );
}
