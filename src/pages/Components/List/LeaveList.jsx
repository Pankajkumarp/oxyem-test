import React, { useEffect, useState } from 'react';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import CustomDataTable from '../../Components/Datatable/table.jsx';
import { useRouter } from 'next/router';

export default function LeaveList() {

    const router = useRouter();
    const [data, setData] = useState([]);

    const columnData = [
  
        {
            "lebel": "Project Name",
            "name": "projectName",
            "isfilter": true,
            "issort": true
        },
        {
          "lebel": "Id",
          "name": "id",
          "isfilter": false,
          "issort": false
        },
        {
            "lebel": "No of resources",
            "name": "noofResources",
            "isfilter": false,
            "issort": false
        },
        {
            "lebel": "Allocated",
            "name": "allocated",
            "isfilter": true,
            "issort": true
        },
        {
            "lebel": "Start date",
            "name": "startDate"
        },
        {
            "lebel": "End date",
            "name": "endDate",
            "isfilter": false,
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
      ]

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const handleEditClick = (id) => {
        router.push(`/Project-allocation/${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosJWT.get(`${apiUrl}/project`);
               
                const transformedArray = response.data.data.map(project => [
                    {
                        "name": "projectName",
                        "value": project.projectName
                    },
                    {
                        "name": "id",
                        "value": project.idProject
                    },
                    {
                        "name": "noofResources",
                        "value": project.noOfResources
                    },
                    {
                        "name": "allocated",
                        "value": `${project.allocationPercentage}%`
                    },
                    {
                        "name": "startDate",
                        "value": project.startDate
                    },
                    {
                        "name": "endDate",
                        "value": project.endDate
                    },
                    {
                        "name": "status",
                        "value": project.status.toLowerCase() // Convert to lowercase if needed
                    },
                    {
                        "name": "action",
                        "value": project.action
                    }
                ]);
                setData(transformedArray)
                console.log("table", response.data.data);  // Ensure to access the data from the response
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);
const onDeleteClick = (id) => {
    console.log(id)
  };

  return (
    <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">

                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">

                                                <div className="card-body oxyem-mobile-card-body">

                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title={""}
                                                            data={data}
                                                            columnsdata={columnData}
                                                            onEditClick={handleEditClick}
															onDeleteClick={onDeleteClick}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
  )
}
