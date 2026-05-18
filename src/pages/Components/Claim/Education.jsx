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


const tableColumns = columns.map(column => ({
  name: column.name,
  label: column.lebel,
  options: {
    display: column.name !== 'documents',

    customBodyRender: (value, tableMeta) => {
      const rowIndex = tableMeta.rowIndex;
      const rowData = info[rowIndex];

      if (column.name === "status") {
        return (
          <span className={`oxyem-mark-${value}`}>
            {value}
          </span>
        );
      }

      if (column.name === "claimNumber") {
  return (
    <span
      className="oxyem-mark-link"
      style={{ cursor: "pointer", color: "#004D95" }}
      onClick={() => {
        const docs = rowData?.documents;

        console.log("docs:", docs);

        // ✅ CASE 1: array of objects
        if (Array.isArray(docs) && docs[0]?.path) {
          handleDownloadClick(docs[0].path);
          return;
        }

        // ✅ CASE 2: array of strings
        if (Array.isArray(docs) && typeof docs[0] === "string") {
          handleDownloadClick(docs[0]);
          return;
        }

        // ✅ CASE 3: single string
        if (typeof docs === "string") {
          handleDownloadClick(docs);
          return;
        }

        console.warn("No downloadable document found");
      }}
    >
      {value}
    </span>
  );
}


      return value;
    }
  }
}));


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
