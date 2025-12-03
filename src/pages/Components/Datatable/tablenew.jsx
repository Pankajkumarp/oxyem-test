import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import MUIDataTable from "mui-datatables";
import { FaEdit } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import { SlActionUndo } from "react-icons/sl";
import { FaWindowMinimize } from "react-icons/fa";
import Recall from '../Popup/Recallmodal';
import Profile from '../commancomponents/profile';
import axios from "axios";
import { GrTooltip } from "react-icons/gr";
import { Tooltip } from 'react-tooltip'
import { FiEdit } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import { IoRefreshSharp } from "react-icons/io5";
import RejectPopup from '../Popup/Rejectmodal';
import { MdAssignmentInd } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlinePending } from "react-icons/md";
import { IoDownloadOutline } from "react-icons/io5";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FaRegCircle } from "react-icons/fa6";
import DocList from './documentlist';
import { FaDownload } from "react-icons/fa";
import { TbSteeringWheel } from "react-icons/tb";
import { TbSteeringWheelOff } from "react-icons/tb";
export default function tablenew({ title, data, columnsdata, ismodule, handleGetvalueClick, onEditClick, onSubmitClick, responseData, onDeleteClick, onViewClick, onHistoryClick, handleApprrovereq, handlerecallvalueClick, handleViewAssignReq, pagename }) {


  const router = useRouter();
  const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
  const [formRecallData, setFormRecallData] = useState({});
  const [idLeave, setIdLeave] = useState("");
  const [recallmessage, setRecallMessage] = useState('');
  const [respdata, setRespdata] = useState("");
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [recallmessageType, setRecallMessageType] = useState('');
  const [validationError, setValidationError] = useState('');
  const transformedData = data.map(item => item.map(subItem => subItem.value));
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


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
    const purpose = "rejected"
    handleApprrovereq(
      selectedIds,
      purpose,
      data,
      (successMessage) => {
        // Handle success message
        setSelectedIds([])
      }
    );
  }
  const handleApproveClick = () => {
    const purpose = "approved"
    const data = ""
    handleApprrovereq(
      selectedIds,
      purpose,
      data,
      (successMessage) => {
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
      setRespdata(responseData)
      setMessageType(respdata.type)
      setMessage(respdata.message)
      if (messageType == "success" && responseData.popup == "recall") {
        setisModalOpenrecall(false);

      }
    }
  }, [responseData]);
  const options = {
    responsive: "standard",
    select: false,
    filterType: "dropdown",
    rowsPerPage: [10],
    rowsPerPageOptions: [10,25, 50, 100, 150],
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
    onChangePage(currentPage) {
      //console.log({currentPage});
    },
    onChangeRowsPerPage(numberOfRows) {
      // console.log({numberOfRows});
    },
	onDownload: (buildHead, buildBody, columns, data) => {
      const excludedColumnNames = ['Id', 'Action', 'id', 'action', 'idAssignTask', 'Assigned Members'];
  
      const filteredColumns = columns.filter(column => !excludedColumnNames.includes(column.name));
      const filteredData = data.map(row => {
          const filteredRow = row.data.filter((_, index) => !excludedColumnNames.includes(columns[index].name));
          return { ...row, data: filteredRow };
      });
  
      // Generate CSV content
      const csvContent = buildHead(filteredColumns) + buildBody(filteredData);
      
      // Return with UTF-8 BOM for Excel compatibility
      return '\ufeff' + csvContent; // Add BOM
  },
    search: pagename !== 'filter', // Conditionally show/hide search option
    filter: pagename !== 'filter', // Conditionally show/hide filter option
    download: pagename !== 'filter', // Conditionally show/hide download option
    print: pagename !== 'filter', // Conditionally show/hide print option
    viewColumns: pagename !== 'filter', // Conditionally show/hide viewColumns option
  };
  const config = {
    headers: {
      'Authorization': token
    }
  };



  const renderActionButtons = (value, tableMeta, updateValue) => {
    if (!Array.isArray(value)) {
      return null;
    }

    const rowIndex = tableMeta.rowIndex;
    const actions = data[rowIndex].find(item => item.name === 'action').value;
    const rowId = data[rowIndex][1].value;
    return (
      <div className='oxyem-action-buttons'>
        {actions.map((action, index) => {
          let button;
          switch (action.type) {
            case "edit":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-edit oxyem-mark-edit1' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Edit"}>
                  <FiEdit />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowEditClick(tableMeta.rowData, value, updateValue),
                });
              } else {
                button = React.cloneElement(button, {
                  className: `${button.props.className} table_btn_disabled`, // add a disabled class to the button
                });
              }
              break;
            case "history":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-edit oxyem-mark-history' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"View history"}>
                  <GoHistory />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowHistoryClick(tableMeta.rowData, value, updateValue),
                });
              } else {
                button = React.cloneElement(button, {
                  className: `${button.props.className} table_btn_disabled`, // add a disabled class to the button
                });
              }
              break;
            case "recall":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-recall' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Recall"}>
                  <IoRefreshSharp />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowrecallClick(tableMeta.rowData, value),
                });
              } else {
                button = React.cloneElement(button, {
                  className: `${button.props.className} table_btn_disabled`, // add a disabled class to the button
                });
              }
              break;
            case "view":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-view' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"View"}>
                  <FaRegEye />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowClick(tableMeta.rowData),
                });
              } else {
                button = React.cloneElement(button, {
                  className: `${button.props.className} table_btn_disabled`, // add a disabled class to the button
                });
              }
              break;
            case "delete":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-delete' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Delete"}>
                  <RiDeleteBinLine />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowDeleteClick(tableMeta.rowData),
                });
              } else {
                button = React.cloneElement(button, {
                  className: `${button.props.className} table_btn_disabled`, // add a disabled class to the button
                });
              }
              break;
			  case "allocation":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-allocation-btn' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Allocation"}>
                  <TbSteeringWheel />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowDeleteClick(tableMeta.rowData),
                });
              } else {
                button = React.cloneElement(button, {
                  className: `${button.props.className} table_btn_disabled`, // add a disabled class to the button
                });
              }
              break;
              case "deallocation":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-deallocation-btn' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Deallocation"}>
                  <TbSteeringWheelOff />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowDeleteClick(tableMeta.rowData),
                });
              } else {
                button = React.cloneElement(button, {
                  className: `${button.props.className} table_btn_disabled`, // add a disabled class to the button
                });
              }
              break;
            case "aprvrej":
              button = (
                <span className='checkbox-wrapper-19'>
                  <input
                    type='checkbox'
                    id={`cbtest-${rowIndex}`}
                    checked={selectedIds.includes(rowId)}
                  />
                  <label htmlFor={`cbtest-${rowIndex}`} className='check-box' />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onChange: () => handleCheckboxChange(rowId),
                });
              } else {
                button = React.cloneElement(button, {
                  className: `${button.props.className} table_btn_disabled`, // add a disabled class to the button
                });
              }
              break;
            default:
              return null;
          }
          return button;
        })}
      </div>
    );
  };
const renderStatus = (value, section) => {
    if (pagename === "basketofallow") {
      let icon;
      switch (value) {
        case "approved":
          icon = <FaRegCheckCircle />;
          break;
        case "rejected":
          icon = <RxCrossCircled />;
          break;
        case "submitted":
          icon = <FaRegCircle />;
          break;
        default:
          icon = <FaRegCheckCircle />;
      }
      return (
        <div className={`oxyem-mark-${value} oxyem-mark-${pagename}`} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={value}>
          {icon}
        </div>
      );
    } else {
      return <span className={`oxyem-mark-${value}`}>{value}</span>;
    }
  };
  const renderDoc = (value, tableMeta, updateValue) => {
    return <Link className={`oxyem-mark-doc-img`} download href={value} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Download"}>  <IoDownloadOutline style={{ cursor: 'pointer' }} size={20} color='#FA7E12' onClick={() => handleDownloadClick(value)} /></Link>;
  };
  const renderwithiconStatus = (value, tableMeta, updateValue) => {
    return <span className={`oxyem-mark-${value}`} onClick={() => handleRowClick(tableMeta.rowData)} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"View Slip"}>  <FaRegEye /> {value}</span>;
  };
  const renderassignedMembers = (value, tableMeta, updateValue) => {
    return (
      <>
        <button className='oxyem-mark-assignmem' onClick={() => handleassignedMemClick(tableMeta.rowData)}>
          <IoIosPeople />
        </button>
      </>
    );
  };
  const rendertaskInformation = (value, tableMeta, updateValue) => {
    return (
      <>
        <button className='oxyem-mark-assignmem' onClick={() => handleRowClick(tableMeta.rowData)}>
          <IoIosPeople />
        </button>
      </>
    );
  };
  const rendercustomProfile = (value, tableMeta, updateValue) => {
    const rowIndex = tableMeta.rowIndex;
    const profileData = data[rowIndex].find(item => item.name === 'Name' || item.name === 'idEmployee');

    const profilePicture = profileData ? profileData.Profilepicture : "";
    const profileLink = profileData ? profileData.Profilelick : "";
    return (
      <span className='oxyem-custom-table-profile'>
        <Profile name={value} imageurl={profilePicture} size={"30"} profilelink={profileLink} />
        {profileLink !== "" ? (<Link className='oxyem-table-link' href={profileLink}>{value}</Link>) : (<span className='oxyem-table-link' >{value}</span>)}
      </span>
    );
  };

  const rendercustomProfileUserList = (value, tableMeta, updateValue) => {
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
        {value.length > maxLength && <GrTooltip className='oxyem-tooltip-icon' style={{ marginLeft: '5px' }} data-tooltip-id="my-tooltip-table-text" data-tooltip-content={value} />}
        <Tooltip id="my-tooltip-table-text" type='dark' effect='solid' style={{ width: '40%', zIndex: '999' }} />
      </div>
    );
  };
  const columns = columnsdata.map(column => ({
    name: column.lebel,
    options: {
      filter: column.isfilter, // Use isfilter value for filter option
      sort: column.issort, // Use issort value for sort option
      display: ['id', 'idAssignTask'].includes(column.name) ? 'excluded' : 'true',
      customBodyRender: column.name === 'action'
        ? (value, tableMeta, updateValue) => renderActionButtons(value, tableMeta, updateValue)
        : column.name === 'status'
          ? (value, tableMeta, updateValue) => renderStatus(value, tableMeta, updateValue)
		  : column.name === 'warrantyDoc'
          ? (value, tableMeta, updateValue) => renderDoc(value, tableMeta, updateValue)
          : column.name === 'leaveReason' || column.name === 'timesheetDescription'
            ? (value, tableMeta, updateValue) => renderLeaveReason(value, tableMeta, updateValue)
            : column.name === 'employeeName'
              ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
              : column.name === 'idEmployee'
                ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
                : column.name === 'projectManager'
                  ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
                  : column.name === 'empName'
				  ? (value, tableMeta, updateValue) => rendercustomProfileUserList(value, tableMeta, updateValue)
                    : column.name === 'fullName'
                    ? (value, tableMeta, updateValue) => rendercustomProfileUserList(value, tableMeta, updateValue)
                    : column.name === 'assignedMembers'
                      ? (value, tableMeta, updateValue) => renderassignedMembers(value, tableMeta, updateValue)
                      : column.name === 'taskInformation'
                        ? (value, tableMeta, updateValue) => rendertaskInformation(value, tableMeta, updateValue)
                        : column.name === 'payslip'
                        ? (value, tableMeta, updateValue) => renderwithiconStatus(value, tableMeta, updateValue)
                        :
                        column.name === 'documents' ? (value, tableMeta, updateValue) => (
                            <IoDownloadOutline  style={{ cursor: 'pointer' }} size={20} color='#FA7E12' onClick={() => handleDownloadClick(value)}  /> 
                        )
                        : null
    }
  }));

  const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [documentData, setDocumentData] = useState([]);

  const openDetailpopup = (documents) => {
    setDocumentData(documents);
    setIsModalOpen(true);
  };
const closeDetailpopup = async () => {
    setIsModalOpen(false)
}

const handleDownloadClick = (documents) => {
  if (documents.length > 1) {
    // Multiple files, open popup to show the list
    openDetailpopup(documents);
  } else if (documents.length === 1) {
    // Single file, download it directly
    const url = `${baseImageUrl}/${documents[0]}`;
    window.open(url, '_blank');
  }
};

  const handleRowClick = (data, value, updatedvalue) => {
    let id = data[1]
    if (ismodule === "leave") {
      onHistoryClick(id)
    } else {
      onViewClick(id)
    }

  };
  const handleassignedMemClick = (data, value, updatedvalue) => {
    let id = data[1]
    handleViewAssignReq(id)

  };


  const handleRowEditClick = async (data, value, updatedvalue) => {
    let id = data[1]
    onEditClick(id)

  };

  const handleRowHistoryClick = async (data, value, updatedvalue) => {
    let id = data[1]
    onHistoryClick(id)

  };

  const handleRowDeleteClick = async (data, value, updatedvalue) => {
    let id = data[1]
    let name = data[2]
    onDeleteClick(id, name)

  };

  const [isModalOpenrecall, setisModalOpenrecall] = useState(false);


  const handleRowrecallClick = (data, value) => {
    let id = data[1]
    handlerecallvalueClick(id)
    setIdLeave(value);

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
    <DocList isOpen={isModalOpen} closeModal={closeDetailpopup} documentData={documentData}/>
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
            Approved
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
      <Tooltip id="my-tooltip-datatable" style={{ zIndex: 99999, textTransform: "capitalize" }} />
    </>
  )
}
