import React, { useEffect, useState } from 'react';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import CustomDataTable from '../Datatable/tablewithApi.jsx';
import { useRouter } from 'next/router';
import DeleteModalProject from '../Popup/DeleteModalProject.jsx';

export default function ProjectList({empId,searchfilter}) {

    const router = useRouter();

    const [data, setData] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const handleEditClick = (id) => {
        router.push(`/projects/edit/${id}`);
    };

    
    const [isModalOpendelete, setIsModalOpenDelete] = useState(false);
    const [deleteId, setDeleteid] = useState("");
    const onDeleteClick = (id) => {
        setDeleteid(id)
        setIsModalOpenDelete(true)
    };
    const closeModalInputselect = () => {
        setIsModalOpenDelete(false);
    };

    const onConformationClick = async () => {

        try {
            const response = await axiosJWT.delete(`${apiUrl}/project`, {
                params: {
                    'idProject': deleteId
                }
            });
            if (response) {
                setIsModalOpenDelete(false);
                fetchData();
            }
        } catch (error) {

        }
    }
	    const onViewClick = (id) => {
        router.push(`/projects/view/${id}`);
    };
    return (
        <>
            <DeleteModalProject isOpen={isModalOpendelete} closeModal={closeModalInputselect} onConformationClick={onConformationClick} />
            <div className="row">
                <div className="col-12 col-lg-12 col-xl-12 d-flex">

                    <div className="card flex-fill comman-shadow oxyem-index">
                        <div className="center-part">

                            <div className="card-body oxyem-mobile-card-body">

                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                    <CustomDataTable
                                        title={""}
                                        data={''}
                                        columnsdata={''}
                                        onEditClick={handleEditClick}
                                        onDeleteClick={onDeleteClick}
                                        dashboradApi={'/project'}
										onViewClick={onViewClick}
                                        searchfilter={searchfilter}

                                        
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
