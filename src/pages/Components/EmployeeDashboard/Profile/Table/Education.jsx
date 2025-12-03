import React, { useEffect, useState } from 'react';
import { IoDownloadOutline } from "react-icons/io5";
import MUIDataTable from "mui-datatables";
import { axiosJWT } from '../../../../Auth/AddAuthorization';

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
    const { formColumns, data } = allData;

    switch (activeTab) {
      case 'education':
        setColumns(formColumns.Education || []);
        setInfo(data.Education || []);
        break;
      case 'experience':
        setColumns(formColumns.Experience || []);
        setInfo(data.Experience || []);
        break;
      case 'compensation':
        setColumns(formColumns.Compensation || []);
        setInfo(data.Compensation || []);
        break;
      case 'other_documents':
        setColumns(formColumns['Other Documents'] || []);
        setInfo(data['Other Documents'] || []);
        break;
      default:
        setColumns([]);
        setInfo([]);
        break;
    }
  }, [activeTab, allData]);

  const tableColumns = columns.map(column => ({
    name: column.name,
    label: column.label,
    options: {
      customBodyRender: (value) => {
        if (column.name === "path" || column.name === "filePath") {
          return (
            <span
              className='file-download-icon'
              onClick={() => handleDownloadClick(value)}
            >
              <IoDownloadOutline size={20} style={{ color: 'var(--theme-primary-color)' }} />
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
