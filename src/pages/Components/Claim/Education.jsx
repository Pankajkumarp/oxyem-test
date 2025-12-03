import React, { useEffect, useState } from 'react';
import { IoDownloadOutline } from "react-icons/io5";
import MUIDataTable from "mui-datatables";
import { axiosJWT } from '../../Auth/AddAuthorization';

export default function DocumentTable({ activeTab, allData }) {
  const [columns, setColumns] = useState([]);
  const [info, setInfo] = useState([]);
  const [error, setError] = useState(null);
  
  
    const handleDownloadClick = async (path) => {

        const filePath = path;
 
        try {

          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/download`, {
                params: { filePath},
                responseType: 'blob', // Important for file download
            });

            // Create a URL for the file and download it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = getFileName(filePath);
            link.setAttribute('download', fileName); // or extract the file name from the response
            document.body.appendChild(link);
            link.click();

        } catch (error) {
            console.error('Error downloading the file', error);
        }
    };
 
      const getFileName = (path) => {
          return path.substring(path.lastIndexOf('/') + 1);
      };
  
      
      
 
  useEffect(() => {
  if (activeTab === 'claimAdmin' && allData.formColumns && allData.formdata) {
    const columns = allData.formColumns;
    const raw = allData.formdata;

    const info = raw.map(row => {
      const obj = {};
      row.forEach(item => {
        obj[item.name] = item.value; // Extract primitive value
      });
      return obj;
    });

    setColumns(columns);
    setInfo(info);
  }
}, [activeTab, allData]);
// console.log('123');
// console.log(columns.lebel);
// console.log('987');


  const tableColumns = columns.map(column => ({
  name: column.name,
  label: column.lebel,
 options: {
  customBodyRender: (value) => {
    if (column.name === "documents") {
      return Array.isArray(value) && value.length > 0
        ? (
          <span onClick={() => handleDownloadClick(value[0])}>
            <IoDownloadOutline
              size={20}
              style={{ color: 'var(--theme-primary-color)' }}
            />
          </span>
        )
        : '-';
    }
     if (column.name === "status") {
        return (
          <span className={`oxyem-mark-${value}`}>
            {value}
          </span>
        );
      }
    return value;
  }
}

}));
// console.log('aaaaa');
// console.log(tableColumns);
// console.log('qqqq');

  const options = {
    filter: false,
    search: false,
    filterType: 'dropdown',
    responsive: 'standard',
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    download: false,
    print: false,
    viewColumns: false,
    selectableRows: 'none',
    textLabels: {
      body: {
        noMatch: error || "No records found"
      }
    }
  };

  return (
    <MUIDataTable
      title={""}
      data={info}
      columns={tableColumns}
      options={options}
    />
  );
}
