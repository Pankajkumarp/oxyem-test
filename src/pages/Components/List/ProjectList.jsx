import React, { useEffect, useState } from 'react';
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';

export default function ProjectList({empId}) {

    const handleEditClick = (id) => { 
    };
    const onDeleteClick = (id) => {
    };
    
    return (
        <>
            
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
                                        dashboradApi={'/project/getMyProjects'}
                                        empId={empId}
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
