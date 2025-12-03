import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/table.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';

export default function index() {

    const router = useRouter();

    const [data, setData] = useState([]);

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Get day and pad it to 2 digits
        const month = date.toLocaleString('en-US', { month: 'long' }); // Get full month name
        const year = date.getFullYear(); // Get full year
    
        return `${day} ${month} ${year}`;
    };

    const [updleavelist, setUpdUserList] = useState([]);
    const [formcolumn, setFormColumn] = useState([]);
    

useEffect(() => {
    const fetchData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/employees`);

            const responsedata = response.data.data || {};
            let tablecolumn = responsedata.formColumns || [];
            
            const transformedArray = responsedata.employeeList || [];

            tablecolumn = tablecolumn.filter(column => column.name !== 'idEmployee'); 
            tablecolumn = tablecolumn.filter(column => column.name !== 'profilePicPath'); 


            const columnData = [
                {
                    "lebel": "Sr No",
                    "name": "srno"
                },
                {
                    "lebel": "Id",
                    "name": "id",
                    "isfilter": false,
                    "issort": false
                },
                {
                    "lebel": "Name",
                    "name": "empName",
                    "isfilter": true,
                    "issort": true
                },
                {
                    "isfilter": false,
                    "issort": true,
                    "lebel": "Employee Number",
                    "name": "empNumber"
                },
                {
                    "lebel": "Email",
                    "name": "emailAddress",
                    "isfilter": false,
                    "issort": true,
                },
                {
                    "lebel": "Mobile No.",
                    "name": "mobileNumber",
                    "isfilter": false,
                    "issort": true,
                },
                {
                    "lebel": "Joining date",
                    "name": "dateOfJoining",
                    "isfilter": true,
                    "issort": true
                },
                {
                    "lebel": "Role",
                    "name": "role",
                    "isfilter": true,
                    "issort": true
                },
                {
                    "lebel": "Status",
                    "name": "status",
                    "isfilter": true,
                    "issort": true
                },
                {
                    "lebel": "Action",
                    "name": "action"
                }
            ];

            const mappedArray = transformedArray.map((item, index) => {
                return columnData.map(column => {
                    if (column.name === 'srno') {
                        return {
                            name: column.lebel,
                            value: index + 1  // Assigning serial number
                        };
                    } else {
                        return {
                            name: column.lebel,
                            value: item[column.name] || ''  // Handle missing values
                        };
                    }
                });
            });

            setUpdUserList(mappedArray); // Set the non-flattened array
            setFormColumn(columnData);

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };
    fetchData();
}, []);



    const onViewClick = (id) => {

        router.push(`/employeeDashboard/${id}`);
    };

    const onDeleteClick = (id) => {
        // console.log(id)
      };


  return (
    <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"User List"} addlink={"/user"}/>


                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                


                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">

                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">

                                                <div className="card-body oxyem-mobile-card-body">

                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        {/* <h2> Welcome to User page</h2> */}

                                                        <CustomDataTable
                                                            title={""}
                                                            data={updleavelist}
                                                            columnsdata={formcolumn}
                                                            onViewClick={onViewClick}
															onDeleteClick={onDeleteClick}
                                                        />
                                                    

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
  )
}
