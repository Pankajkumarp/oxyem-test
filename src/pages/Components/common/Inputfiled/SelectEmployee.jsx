import React, { useState, useEffect } from 'react';
import ViewPopup from '../../Popup/PopupForm';
import DeleteModal from '../../Popup/DeleteModal';
import CustomDataTable from '../../Datatable/table';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import { FaPlus } from "react-icons/fa";
export default function SelectEmployee({ type, placeholder, label, value, validations = [], onChange, actionid, pagename }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [rowData, setRowData] = useState([]);
  const [columnsData, setgetcolumsData] = useState([]);



  const getTableData = async () => {

    const response = await axiosJWT.get(`${apiUrl}/project/allocation`, { params: { "idProject": actionid } })


    const desiredOrder = ["srno", "id", "idEmployee", "role", "allocation", "startDate", "endDate", "status", "action"];

    // Function to sort the array based on the desired order
    const sortColumns = (columns) => {
      return columns.sort((a, b) => {
        return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
      });
    };

    const sortedColumns = response.data.data.formcolumns ? sortColumns(response.data.data.formcolumns) : [];
    console.log("flitercol", sortedColumns)
    setgetcolumsData(sortedColumns);
    const sortAndFilterAllocationList = (allocationList) => {
      return allocationList.map(row => {
        return row.filter(item => item.name !== 'idProject')
          .sort((a, b) => {
            return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
          });
      });
    };

    const sortedAllocationList = response.data.data.allocationlist ? sortAndFilterAllocationList(response.data.data.allocationlist) : [];


        const transformedArray = sortedAllocationList.map(project => {
      const projectObj = Object.fromEntries(project.map(item => [item.name, item.value]));

      const transformedProject = [
        {
          "name": "srno",
          "value": projectObj.srno
        },
        {
          "name": "id",
          "value": projectObj.id
        },
        {
          "name": "idEmployee",
          "value": projectObj.idEmployee,
          "Profilepicture": "",
          "Profilelick": ""
        },
        {
          "name": "role",
          "value": projectObj.role
        },
        {
          "name": "allocationPercentage",
          "value": projectObj.allocation
        },
        {
          "name": "startDate",
          "value": projectObj.startDate
        },
        {
          "name": "endDate",
          "value": projectObj.endDate
        },
        {
          "name": "status",
          "value": projectObj.status
        }
      ];

      // Check if pagename is not "view_allocation", then add the action field
      if (pagename !== "view_allowcation") {
        transformedProject.push({
          "name": "action",
          "value": projectObj.action
        });
      }

      return transformedProject;
    });

    setRowData(transformedArray);

  };
  useEffect(() => {
    getTableData();
  }, [actionid]);

  const handleRemoveRowBySrNo = (srNoValue) => {
    const newRowData = rowData.filter(row => {
      const srNo = row.find(item => item.name === 'SrNo.');
      return srNo && srNo.value !== srNoValue;
    });
    setRowData(newRowData);
  };
  const handleGetvalueClick = (value) => {
    handleRemoveRowBySrNo(value);
    console.log("arrrrry", rowData)
  };
  const [isModalOpeninput, setIsModalOpeninput] = useState(false);
  const [getId, setGetid] = useState("");
  const [sectionName, setSectionName] = useState("");
  const onEditClick = (id) => {
    setGetid(id)
    setSectionName("allocationEdit");
    setIsModalOpeninput(true);
  };




  const closeModalInputselect = () => {
    setIsModalOpeninput(false);
  };

  const [deleteId, setDeleteid] = useState("");
  const [usernameD, setUsernameD] = useState("");
  const [isModalOpendelete, setIsModalOpenDelete] = useState(false);
  const onDeleteClick = (id, name) => {
    setDeleteid(id)
    setUsernameD(name)
    setIsModalOpenDelete(true);
  };


  const closeModalDelete = () => {
    setUsernameD("")
    setIsModalOpenDelete(false);
  };
  const CallDeleteApi = async (value) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/project/deAllocation`, value);
      // Handle the response if needed
      if (response) {
        getTableData();
        setIsModalOpenDelete(false)
      }
    } catch (error) {
      // Handle the error if any
      console.error("Error occurred:", error.response.data.errors);

    }
  };
  const callmainApi = () => {
    getTableData();
    setIsModalOpeninput(false)
  };
  const [isModalOpeninput1, setIsModalOpeninput1] = useState(false);
  const onAddClick = (id) => {
    setIsModalOpeninput1(true);
  };
  const closeModalInputselect1 = () => {
    setIsModalOpeninput1(false);
  };
  const callmainApi1 = () => {
    getTableData();
    setIsModalOpeninput1(false)
  };
  return (
    <>
      <ViewPopup isOpen={isModalOpeninput} closeModal={closeModalInputselect} labelText={"Add Allocation"} dynamicform={"Member_allocation"} alloctionid={getId} section={sectionName} callmainApi={callmainApi} />
      <ViewPopup isOpen={isModalOpeninput1} closeModal={closeModalInputselect1} labelText={"Add Allocation"} dynamicform={"Member_allocation"} actionid={actionid} callmainApi={callmainApi1}/>
      <DeleteModal isOpen={isModalOpendelete} closeModal={closeModalDelete} labelText={"Delete"} projectid={actionid} alloctionid={deleteId} CallDeleteApi={CallDeleteApi} usernameD={usernameD}/>
      <div className='row align-items-center text-end' style={{ marginBottom: '' }}>
        <div className='col-md-12'>
                    {pagename ==="view_allowcation" ?(null):(
          <button type='button' className='btn btn-primary oxyem-filter-button' onClick={onAddClick}><FaPlus /></button>
          )}
        </div>
      </div>
      <div className='row align-items-center'>
        <div className='col-md-12'>

          <CustomDataTable
            title={""}
            data={rowData}
            columnsdata={columnsData}
            handleGetvalueClick={handleGetvalueClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        </div>
      </div>
    </>
  );
}
