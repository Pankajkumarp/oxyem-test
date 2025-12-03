import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
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
import { IoIosPeople } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { IoDownloadOutline } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa6";
import DocList from './documentlist';
import { TbSteeringWheel } from "react-icons/tb";
import { TbSteeringWheelOff } from "react-icons/tb";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import moment from 'moment-timezone';
import { PiStopCircleBold } from "react-icons/pi";
import DecommissionModal from '../Popup/DecommissionModal.jsx';
import DeallocationModal from '../Popup/DeallocationModal.jsx';
import { HiOutlineMail } from "react-icons/hi";
import { MdConfirmationNumber } from "react-icons/md";
const getCurrentTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
const convertUtcToLocalTime = (utcTime, timeZone) => {
  if (!utcTime || utcTime.trim() === "") return "";

  try {
    const today = moment.utc().format('YYYY-MM-DD');  // Get today's date in UTC
    const utcDateTime = `${today}T${utcTime}Z`;  // Combine date and time to form a full date-time string
    const localTime = moment.utc(utcDateTime).tz(timeZone).format('HH:mm:ss');  // Convert to local time
    if (localTime === "Invalid date") return ""; // Return empty string if the date is invalid
    return localTime;
  } catch (error) {
    return ""; // Return empty string in case of any error during conversion
  }
};

export default function tablewithReport({ title, ismodule, onEditClick, onSubmitClick, responseData, onDeleteClick, onViewClick, onHistoryClick, handleApprrovereq, handlerecallvalueClick, handleViewAssignReq, pagename, dashboradApi, refreshtable, updatelist, year, utctimeconditionpage, handleDecommissionreq, assetsparms, refreshAfterEdit, handleDeallocationreq, handleSubmitAllocation, checkboxbuttonName, onEmailClick,onConfirmClick, enterField }) {

  const timeZone = getCurrentTimeZone();
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState({});
  const [filterList, setFilterList] = useState({});
  const [columnss, setcolumns] = useState([]);
  const [apisamedata, setapisamedata] = useState([]);
  const webUrl = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const [searchValue, setSearchValue] = useState("");


  const [idLeave, setIdLeave] = useState("");
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [validationError, setValidationError] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedIdsAsset, setSelectedIdsAsset] = useState([]);
  const [isModalOpenreject, setIsModalOpenreject] = useState(false);

  const closeModalrecallModalreject = () => {
    setIsModalOpenreject(false);
  };

  const handleRejectClick = () => {
    setIsModalOpenreject(true);
  }

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



  // Fetch data from API or any data source
  const fetchData = async (page, rowsPerPage, sortOrder, filterList, searchValue) => {
    const sortParam = sortOrder.name ? `&sort=${sortOrder.name}&order=${sortOrder.direction}` : '';

    const filterParams = Object.keys(filterList)
      .map(key => filterList[key].length ? `${key}=${filterList[key].join(',')}` : '')
      .filter(param => param)
      .join('&');

    const searchParam = searchValue ? `&search=${encodeURIComponent(searchValue)}` : '';
    const assetsParam = assetsparms ? `&${assetsparms}` : '';

    // Replace with your API call
    // let response = await axiosJWT.get(`${apiUrl}${dashboradApi}?page=${page}&limit=${rowsPerPage}${sortParam}&${filterParams}${searchParam}`);
    let response = await axiosJWT.get(`${apiUrl}${dashboradApi}?page=${page}&limit=${rowsPerPage}${sortParam}&${filterParams}${searchParam}${assetsParam}`, {
      params: {
        ...enterField
      }
    });
    
    setcolumns(response.data.data.formColumns)
    let taleData = response.data.data.formdata

    if (utctimeconditionpage === 'userAttendance') {
      taleData = taleData.map(item => item.map(subItem => {
        if (subItem.name === 'starttime' || subItem.name === 'endtime') {
          if (subItem.value && subItem.value !== '-') {
            subItem.value = convertUtcToLocalTime(subItem.value, timeZone)
          }
        }
        return subItem;
      }));

      setapisamedata(taleData);

    } else {
      setapisamedata(taleData)
    }


    const transformedData = (taleData || []).map(item => (item || []).map(subItem => subItem.value));
    setData(transformedData);
    setTotalRecords(response.data.data.totalCount); // Total number of records available
  };

  useEffect(() => {

    if (updatelist) {
      fetchData(page, rowsPerPage, sortOrder, filterList, searchValue)
    }
  }, [updatelist]);

  useEffect(() => {
    fetchData(page, rowsPerPage, sortOrder, filterList, searchValue);
  }, [page, rowsPerPage, sortOrder, filterList, year, searchValue, assetsparms]);
  useEffect(() => {
    fetchData(page, rowsPerPage, sortOrder, filterList, searchValue);
  }, [enterField]);

  useEffect(() => {
    if (refreshtable === "refresh") {
      fetchData(page, rowsPerPage, sortOrder, filterList, searchValue);
    }
  }, [refreshtable]);

  useEffect(() => {
    if (refreshAfterEdit) {
      fetchData(page, rowsPerPage, sortOrder, filterList, searchValue);
    }
  }, [refreshAfterEdit]);





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
        fetchData(page, rowsPerPage, sortOrder, filterList);
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
        fetchData(page, rowsPerPage, sortOrder, filterList);
      }
    );
  };

  const handleSubmitAllocationClick = () => {
    const purpose = "approved"
    const data = ""
    handleSubmitAllocation(
      selectedIdsAsset,
      purpose,
      data,
      (successMessage) => {
        // Handle success message
        setSelectedIdsAsset([])
        fetchData(page, rowsPerPage, sortOrder, filterList);
      }
    );
  };



  // For decommission popup
  const [isModalDecommission, setisModalDecommission] = useState(false);
  const [DecommissionId, setDecommissionId] = useState([]);
  const closeModalDecommission = () => {
    setisModalDecommission(false);
  };
  const handleDecommissionClick = async (data, value, updatedvalue) => {
    let id = data[1]
    setDecommissionId(id)
    setisModalDecommission(true)
  };

  const handleDecommissionSubmit = (data) => {
    setIsModalOpenreject(false);
    handleDecommissionreq(data);
    closeModalDecommission();
    fetchData(page, rowsPerPage, sortOrder, filterList);
  }

  //End decommission popup

  // Deallocation popup

  const [isModalDeallocation, setisModalDeallocation] = useState(false);
  const [deallocationId, setDeallocationId] = useState([]);
  const handledDeallocationClick = async (data, value, updatedvalue) => {
    let id = data[1]
    setDeallocationId(id)
    setisModalDeallocation(true)
  };

  const closeModalDeallocation = () => {
    setisModalDeallocation(false);
  };

  const handleDeallocationSubmit = (data) => {
    handleDeallocationreq(data);
    closeModalDeallocation();
    fetchData(page, rowsPerPage, sortOrder, filterList);
  }
  // End Deallocation popup

  // Radio buttons

  const handleRadioChange = (id) => {
    setSelectedIdsAsset([id]);

  };

  // End Radio buttons

  const options = {
    filter: false, // Enable filtering
    filterType: "dropdown", // Can be "checkbox", "dropdown", "multiselect", etc.
    responsive: "standard", // Can be "standard", "vertical", "simple"
    serverSide: true, // Enable server-side operations
    rowsPerPage, // Rows per page
    rowsPerPageOptions: [5, 10, 15, 20, 25, 50, 100], // Rows per page options
    count: totalRecords, // Total number of records (for pagination)
    page, // Current page index
    selectableRows: "none", // Disable selectable rows
    search: false, // Enable global search
    download: false, // Enable download option
    print: false, // Enable print option
    viewColumns: false, // Enable view/hide columns option
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          setPage(tableState.page);
          break;
        case 'changeRowsPerPage':
          setRowsPerPage(tableState.rowsPerPage);
          setPage(0); // Reset to the first page
          break;
        case 'sort':
          setSortOrder({
            name: tableState.sortOrder.name,
            direction: tableState.sortOrder.direction,
          });
          break;
        case 'filterChange':
          const newFilterList = {};
          tableState.filterList.forEach((value, index) => {
            if (value.length) {
              newFilterList[tableState.columns[index].name] = value;
            }
          });
          setFilterList(newFilterList);
          break;
        case 'search':
          setSearchValue(tableState.searchText);
          break;
        default:
          break;
      }
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      const excludedColumnNames = ['Id', 'Action', 'id', 'action', 'idAssignTask', 'Assigned Members', 'ducumentPath'];

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
  };

  const renderActionButtons = (value, tableMeta, updateValue) => {
    if (!Array.isArray(value)) {
      return null;
    }

    const rowIndex = tableMeta.rowIndex;
    const actions = apisamedata[rowIndex].find(item => item.name === 'action').value;
    const rowId = apisamedata[rowIndex][1].value;
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
            case "email":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-email oxyem-mark-email1' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Send Email"}>
                  <HiOutlineMail />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowEmailClick(tableMeta.rowData, value, updateValue),
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
            case "confirm":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-confirm' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Confirmation"}>
                  <MdConfirmationNumber />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleRowConfirmClick(tableMeta.rowData),
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
            case "decommission":
              button = (
                <span key={index} className='oxyem-without-btn oxyem-mark-deallocation-btn' data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Decommission"}>
                  {/* <TbSteeringWheelOff /> */}
                  <PiStopCircleBold />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onClick: () => handleDecommissionClick(tableMeta.rowData),
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
                  onClick: () => handledDeallocationClick(tableMeta.rowData),
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
            case "radio":
              button = (
                <span className='radio-wrapper'>
                  <input
                    type='radio'
                    id={`radio-${rowIndex}`}
                    name='radio-group'
                    checked={selectedIdsAsset.includes(rowId)}
                  />
                  <label htmlFor={`radio-${rowIndex}`} className='radio-box' />
                </span>
              );
              if (action.isEnable === true) {
                button = React.cloneElement(button, {
                  onChange: () => handleRadioChange(rowId),
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
  const renderpolicyDoc = (value, tableMeta, updateValue) => {
    const policyBaseurl = process.env.NEXT_PUBLIC_POLICY_IMAGE_BASE_URL
    const urlvalue = `${policyBaseurl}/${value}`;
    return <a className={`oxyem-mark-doc-img`} download href={urlvalue} data-tooltip-id="my-tooltip-datatable" data-tooltip-content={"Download"}>  <IoDownloadOutline style={{ cursor: 'pointer' }} size={20} color='#FA7E12' /></a>;
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
    const profileData = apisamedata[rowIndex].find(item => item.name === 'Name' || item.name === 'idEmployee' || item.name === 'employeeName');

    const profilePicture = profileData ? profileData.Profilepicture : "";
    const profileLink = profileData.idEmployee ? profileData.idEmployee : "";
    return (
      <span className='oxyem-custom-table-profile'>
        <Profile name={value} imageurl={`${baseImageUrl}/${profilePicture}`} size={"30"} profilelink={`/employeeDashboard/${profileLink}`} />
        {profileLink !== "" ? (<Link className='oxyem-table-link' href={`/employeeDashboard/${profileLink}`}>{value}</Link>) : (<span className='oxyem-table-link' >{value}</span>)}
      </span>
    );
  };

  const rendercustomProfileUserList = (value, tableMeta, updateValue) => {
    const rowIndex = tableMeta.rowIndex;
    const profileData = apisamedata[rowIndex].find(item => item.name === 'empName');

    const profilePicture = profileData ? profileData.Profilepicture : "";
    const profileLink = profileData.idEmployee ? profileData.idEmployee : "";
    return (
      <span className='oxyem-custom-table-profile'>
        <Profile name={value} imageurl={`${baseImageUrl}/${profilePicture}`} size={"30"} profilelink={`/employeeDashboard/${profileLink}`} />
        {profileLink !== "" ? (<Link className='oxyem-table-link' href={`/employeeDashboard/${profileLink}`}>{value}</Link>) : (<span className='oxyem-table-link' >{value}</span>)}
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
  const columns = (columnss || []).map(column => ({
    name: column.name,
    label: column.lebel,
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
            : column.name === 'policyDocPath'
              ? (value, tableMeta, updateValue) => renderpolicyDoc(value, tableMeta, updateValue)
              : column.name === 'leaveReason' || column.name === 'timesheetDescription' || column.name === 'policyDescription'
                ? (value, tableMeta, updateValue) => renderLeaveReason(value, tableMeta, updateValue)
                : column.name === 'employeeName'
                  ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
                  : column.name === 'idEmployee'
                    ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
                    : column.name === 'projectManager'
                      ? (value, tableMeta, updateValue) => rendercustomProfile(value, tableMeta, updateValue)
                      : column.name === 'empName'
                        ? (value, tableMeta, updateValue) => rendercustomProfileUserList(value, tableMeta, updateValue)
                        : column.name === 'assignedMembers'
                          ? (value, tableMeta, updateValue) => renderassignedMembers(value, tableMeta, updateValue)
                          : column.name === 'taskInformation'
                            ? (value, tableMeta, updateValue) => rendertaskInformation(value, tableMeta, updateValue)
                            : column.name === 'payslip'
                              ? (value, tableMeta, updateValue) => renderwithiconStatus(value, tableMeta, updateValue)
                              : column.name === 'documents' || column.name === 'pricingDocument'
                                ? (value, tableMeta, updateValue) => (
                                  value && value.length > 0 ? (
                                    <IoDownloadOutline style={{ cursor: 'pointer' }} size={20} color='#FA7E12' onClick={() => handleDownloadClick(value)} />
                                  ) : null
                                )
                                : column.name === 'uploadInvoice' || column.name === 'ducumentPath' || column.name === 'offerLetterPath'
                                  ? (value, tableMeta, updateValue) => (
                                    value && value.length > 0 ? (
                                      <IoDownloadOutline style={{ cursor: 'pointer' }} size={20} color='#FA7E12' onClick={() => handleDownloadClickWithPath(value)} />
                                    ) : null
                                  )
                                  : column.name === 'completetab'
                                    ? (value, tableMeta, updateValue) => (
                                      value && value.length > 0 ? (
                                        value === "A" ? <p className='job-stage'>Applied</p> : value === "J" ? <p className='job-stage'>Joined</p> : value === "TI" ? <p className='job-stage'>Technical interview</p> : value === "S" ? <p className='job-stage'>Shortlisted</p> : value === "O" ? <p className='job-stage'>Offer letter</p> : value === "MI" ? <p className='job-stage'>Management interview</p> : value
                                      ) : value === "" ? <p className='job-stage'>Applied</p> : null
                                    )
                                    : null
    }
  }));




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


  const handleDownloadClickWithPath = async (path) => {

    const filePath = path;

    try {

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/download`, {
        params: { filePath },
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
      // console.error('Error downloading the file', error);
    }
  };

  const getFileName = (path) => {
    return path.substring(path.lastIndexOf('/') + 1);
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
  const handleRowConfirmClick = async (data, value, updatedvalue) => {
    let id = data[1]
    onConfirmClick(id)

  };

  const handleRowHistoryClick = async (data, value, updatedvalue) => {
    let id = data[1]
    onHistoryClick(id)

  };
  const handleRowEmailClick = async (data, value, updatedvalue) => {
    let id = data[1]
    onEmailClick(id)
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
      <DocList isOpen={isModalOpen} closeModal={closeDetailpopup} documentData={documentData} />
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
            {checkboxbuttonName ? checkboxbuttonName : 'Approved'}
          </button>
          <button type="submit" className="btn btn-reject" onClick={handleRejectClick}>
            Reject
          </button>
        </div>
      )}
      <DeallocationModal isOpen={isModalDeallocation} closeModal={closeModalDeallocation} DeallocationId={deallocationId} onSubmit={handleDeallocationSubmit} />
      <DecommissionModal isOpen={isModalDecommission} closeModal={closeModalDecommission} DecommissionId={DecommissionId} onSubmit={handleDecommissionSubmit} />
      <Recall isOpen={isModalOpenrecall} closeModal={closeModalrecallModal} onSubmit={handleRecallSubmit} />
      <RejectPopup isOpen={isModalOpenreject} closeModal={closeModalrecallModalreject} onSubmit={handleRejectSubmit} />
      <MUIDataTable
        title={<div className={"oxyem-table-tittle"}>{title}</div>}
        data={data}
        columns={columns}
        options={options}
      />

      {selectedIdsAsset.length === 0 ? (
        <></>
      ) : (
        <div className="text-end w-100 mt-3">
          <button type="submit" className={`btn btn-primary`} onClick={handleSubmitAllocationClick}>
            Submit
          </button>
        </div>
      )}
      <Tooltip id="my-tooltip-datatable" style={{ zIndex: 99999, textTransform: "capitalize" }} />
    </>
  )
}
