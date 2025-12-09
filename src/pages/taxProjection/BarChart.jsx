import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

// Dynamically import the Chart component to prevent SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = ({ mygraphvalue }) => {
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (mygraphvalue?.data && mygraphvalue?.value) {
      setCategories(mygraphvalue.data);
      setValues(mygraphvalue.value.map(val => parseFloat(val))); // Convert string values to numbers
    }
  }, [mygraphvalue]);

  const options = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories,
    },
    
    plotOptions: {
      bar: {
        distributed: true,  // Apply different colors to each bar
      },
    },
    
  };

  const series = [
    {
      name: 'Total',  // Descriptive name for the series
      data: values,
    },
  ];

  return (
    <div className='taxProjection'>
      {mygraphvalue?.data && mygraphvalue?.value ? (
        <>
          <h2>Chart</h2>
          <Chart options={options} series={series} type="bar" height={330} />
        </>
      ) : (
        <p>No data available</p>  // Optional: A fallback message if data is missing
      )}
    </div>
  );
  
};

export default BarChart;
