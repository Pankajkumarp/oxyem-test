import Link from 'next/link';
import { useState, useEffect } from 'react'
import MUIDataTable from "mui-datatables";
import { FaRegEye } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import Recall from '../Popup/Recallmodal';
import Profile from '../commancomponents/profile';
import { GrTooltip } from "react-icons/gr";
import { Tooltip } from 'react-tooltip'
import { FiEdit } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import { IoRefreshSharp } from "react-icons/io5";
import RejectPopup from '../Popup/Rejectmodal';
export default function Table({ title, data, columnsdata, ismodule, onEditClick, onSubmitClick, responseData, onDeleteClick ,onViewClick, onHistoryClick, handleApprrovereq, handlerecallvalueClick }) {
  
  const [respdata, setRespdata] = useState("");
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const validationError = '';
  const transformedData = data.map(item => item.map(subItem => subItem.value));
  
  
   const [selectedIds, setSelectedIds] = useState([]);
   const [isModalOpenreject, setIsModalOpenreject] = useState(false);


   const closeModalrecallModalreject = () => {
    setIsModalOpenreject(false);
   };

  const handleRejectClick = () => {
    setIsModalOpenreject(true);
  }
  const handleRejectSubmit = (data) => {
    setIsModalOpenreject(false);
    const purpose ="rejected"
    handleApprrovereq(
      selectedIds, 
      purpose, 
      data,
      () => {
          // Handle success message
          setSelectedIds([])
      }
  );
  }
  const handleApproveClick = () => {
    const purpose ="approved"
	const data =""
    handleApprrovereq(
      selectedIds, 
      purpose, 
	  data,
      () => {
          // Handle success message
          setSelectedIds([])
      }
  );
  };
  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  useEffect(() => {
    if (responseData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRespdata(responseData)
      setMessageType(respdata.type)
      setMessage(respdata.message)
      if (messageType == "success" && responseData.popup == "recall") {
        // eslint-disable-next-line react-hooks/immutability
        setisModalOpenrecall(false);

      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseData]);
  const options = {
    responsive: "standard",
    select: false,
    filterType: "dropdown",
    // rowsPerPage: [10],
    // rowsPerPageOptions: [25, 50, 100, 150],
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100, 150],
    jumpToPage: true,
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "Total items Per Page",
        displayRows: "OF"
      }

    },
    setRowProps: (row, dataIndex, rowIndex) => {
      // Define your row coloring logic here
      let backgroundColor = '';
      let className = ''; 
      if (rowIndex % 2 === 0) {
        backgroundColor = 'var(--table-bg-row-color1)';
      } else {
        backgroundColor = 'var(--table-bg-row-color2)';
      }
      if (row[7] === 'Leave Applied') { // Assuming 'weekendorDay' is at index 7
        className = 'custom_class_applied_leave'; // Assign className if condition met
      }
	  if (row[6] === 'Leave Applied') { // Assuming 'weekendorDay' is at index 7
        className = 'custom_class_applied_leave'; // Assign className if condition met
      }
      return {
        style: {
          backgroundColor
        },
        className
      };
    },
    onChangePage() {
    },
    onChangeRowsPerPage() {
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      // Columns to exclude
      const excludedColumnNames = ['Id', 'Action' ,'id', 'action'];

      // Filter out columns and data based on excludedColumnNames
      const filteredColumns = columns.filter(column => !excludedColumnNames.includes(column.name));
      const filteredData = data.map(row => {
        const filteredRow = row.data.filter((_, index) => !excludedColumnNames.includes(columns[index].name));
        return { ...row, data: filteredRow };
      });
  
      // Generate CSV content
      return buildHead(filteredColumns) + buildBody(filteredData);
    },
  };

  const renderActionButtons = (value, tableMeta, updateValue) => {
    if (!Array.isArray(value)) {
      return null;
    }
  const rowIndex = tableMeta.rowIndex;
    const rowId = data[rowIndex][1].value;
    return (
      <div className='oxyem-action-buttons'>
        
        {value.includes("edit") && (
          <span className='oxyem-without-btn oxyem-mark-edit oxyem-mark-edit1' onClick={() => handleRowEditClick(tableMeta.rowData, value, updateValue)} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Edit"}>
            <FiEdit />
          </span>
        )}
        {value.includes("history") && (
          <span className='oxyem-without-btn oxyem-mark-edit oxyem-mark-history' onClick={() => handleRowHistoryClick(tableMeta.rowData, value, updateValue)} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"View history"}>
            <GoHistory />
          </span>
        )}
        {value.includes("recall") && (
          <span className='oxyem-without-btn oxyem-mark-recall' onClick={() => handleRowrecallClick(tableMeta.rowData, value)} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Recall"}>
            <IoRefreshSharp />
          </span>
        )}
        {value.includes("view") && (
          <span className='oxyem-without-btn oxyem-mark-view' onClick={() => handleRowClick(tableMeta.rowData)} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"View"}>
            <FaRegEye />
          </span>
        )}
        {value.includes("delete") && (
          <span className='oxyem-without-btn oxyem-mark-delete' onClick={() => handleRowDeleteClick(tableMeta.rowData)} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Delete"}>
            <RiDeleteBinLine />
          </span>
        )}
        {value.includes('aprvrej') && (
          <span className='checkbox-wrapper-19'>
            <input
              type='checkbox'
              id={`cbtest-${rowIndex}`}
              checked={selectedIds.includes(rowId)}
              onChange={() => handleCheckboxChange(rowId)}
            />
            <label htmlFor={`cbtest-${rowIndex}`} className='check-box' />
          </span>
        )}
      </div>
    );
  };
  const renderStatus = (value) => {
    return <span className={`oxyem-mark-${value}`}>{value}</span>;
  };
  const rendercustomProfile = (value, tableMeta) => {
    const rowIndex = tableMeta.rowIndex;
    const profileData = data[rowIndex].find(item => item.name === 'Name' || item.name === 'idEmployee' || item.name === 'projectName');
    
    const profilePicture = profileData ? profileData.Profilepicture : "";
    const profileLink = profileData ? profileData.Profilelick : "";
    return (
      <span className='oxyem-custom-table-profile'>
        <Profile name={value} imageurl={profilePicture} size={"30"} profilelink={profileLink} />
        {profileLink !== "" ? (<Link className='oxyem-table-link' href={profileLink}>{value}</Link>) : (<span className='oxyem-table-link' >{value}</span>)}
      </span>
    );
  };

  const rendercustomProfileUserList = (value, tableMeta) => {
    const rowIndex = tableMeta.rowIndex;
    const profileData = data[rowIndex].find(item => item.name === 'empName');
  
    const profilePicture = profileData ? profileData.Profilepicture : "";
    const profileLink = profileData ? profileData.Profilelick : "";
    return (
      <span className='oxyem-custom-table-profile'>
        <Profile name={value} imageurl={profilePicture} size={"30"} profilelink={profileLink} />
        {profileLink !== "" ? (<Link className='oxyem-table-link' href={profileLink}>{value}</Link>) : (<span className='oxyem-table-link' >{value}</span>)}
      </span>
    );
  };
  
  const renderLeaveReason = (value) => {
    const maxLength = 35;
    const truncatedValue = value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
  
    return (
      <div className='oxyem-tooltip-text'>
        {truncatedValue}
        {value.length > maxLength && <GrTooltip className='oxyem-tooltip-icon' style={{ marginLeft: '5px' }} data-tooltip-id="my-tooltip-table-text" data-tooltip-content={value}/>}
        <Tooltip id="my-tooltip-table-text" type='dark' effect='solid'  style={{ width: '40%', zIndex: '999' }}/>
      </div>
    );
  };
  const columns = columnsdata.map(column => ({
    name: column.lebel,
    options: {
      filter: column.isfilter, // Use isfilter value for filter option
      sort: column.issort, // Use issort value for sort option
      display: column.name === 'id' ? 'excluded' : 'true',
      customBodyRender: column.name === 'action'
      ? (value, tableMeta, updateValue) => renderActionButtons(value, tableMeta, updateValue)
      : column.name === 'status'
      ? (value, tableMeta, updateValue) => renderStatus(value, tableMeta, updateValue)
      : column.name === 'leaveReason'
      ? (value, tableMeta, updateValue) => renderLeaveReason(value, tableMeta, updateValue)
      : column.name === 'employeeName'
      ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
	  : column.name === 'idEmployee'
      ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
	  : column.name === 'projectName'
      ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
      : column.name === 'empName'
      ? (value, tableMeta, updateValue) => rendercustomProfileUserList(value, tableMeta, updateValue)
      :
      null
    }
  }));
  
  const handleRowClick = (data) => {
    let id = data[1] 
    if(ismodule === "leave"){
      onHistoryClick(id)
    }else  {
    onViewClick(id)
  }

  };


  const handleRowEditClick = async (data) => {
    let id = data[1]
    onEditClick(id)

  };

  const handleRowHistoryClick = async (data) => {
    let id = data[1]
    onHistoryClick(id)

  };

  const handleRowDeleteClick = async (data) => {
    let id = data[1]
    let name = data[2]
    onDeleteClick(id, name)

  };

  const [isModalOpenrecall, setisModalOpenrecall] = useState(false);


  const handleRowrecallClick = (data) => {
    let id = data[1]
    handlerecallvalueClick(id)

  };
  const closeModalrecallModal = () => {
    setisModalOpenrecall(false);
  };
  const handleRecallSubmit = async (data) => {
    let id = data[1]
    onSubmitClick(id)

  };

  return (
    <>
      {message && (
        <div className={`alert alert-${messageType}`} role="alert">
          {message}
        </div>
      )}
      {validationError && (
        <div className='alert alert-danger' role='alert'>
          {validationError}
        </div>
      )}
	  {selectedIds.length === 0 ? (
        <></>
      ) : (
        <div className="text-end w-100">
          <button type="submit" className={`btn btn-approve`} onClick={handleApproveClick}>
          Approve
          </button>
          <button type="submit" className="btn btn-reject" onClick={handleRejectClick}>
        Reject
      </button>
        </div>
      )}
      <Recall isOpen={isModalOpenrecall} closeModal={closeModalrecallModal} onSubmit={handleRecallSubmit} />
	  <RejectPopup isOpen={isModalOpenreject} closeModal={closeModalrecallModalreject} onSubmit={handleRejectSubmit} />
      <MUIDataTable
        title={<div className={"oxyem-table-tittle"}>{title}</div>}
        data={transformedData}
        columns={columns}
        options={options}
      />
	  <Tooltip id="my-tooltip-datatable" style={{ zIndex: 99999 }} />
    </>
  )
}
