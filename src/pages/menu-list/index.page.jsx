import React, { useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import View from './history';

export default function EmployeeSection() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };


  const router = useRouter();
    
    const [isHistroyId, setIsHistroyId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedTab, setClickedTab] = useState(null);
    const openDetailpopup = async () => { setIsModalOpen(true); };

    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }

    const handleHistoryClick = (id, tab) => { 
      setIsHistroyId(id); 
      setClickedTab(tab); // Set the tab where the click occurred
      openDetailpopup();
    };
    const onViewClick = (id, tab) => { 
      router.push(`/menu/${id}?editfor=${tab}`); 
    };

    const onDeleteClick = (id) => {};

    
  return (
<>
<View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"}  datafor={clickedTab}/>

            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                        <Breadcrumbs maintext={"Menu list"} addlink={"/menu"} />
                            <div className="col-12 col-lg-12 col-xl-12 mt-3">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <p className='text-danger'>{''}</p>
                                                       
                                                        <div className="center-part">
      <div className="card-body -body skolrup-learning-card-body">
        
        
        <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
          <li key="assignMenuRole" className="nav-item">
            <a
              className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => handleTabClick(1)}
            >
              <div className="skolrup-profile-tab-link">Assign Menu Role</div>
            </a>
          </li>
          <li key="assignMenuUser" className="nav-item">
            <a
              className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => handleTabClick(2)}
            >
              <div className="skolrup-profile-tab-link">Assign Menu User</div>
            </a>
          </li>
        </ul>
        
        <div className="tab-content" style={{ padding: '20px' }}>
          {activeTab === 1 && (
            <div className="tab-pane active">
              <CustomDataTable
                onViewClick={(id) => onViewClick(id, 'role')}
                // onViewClick={onViewClick}
                onDeleteClick={onDeleteClick}
                handleApprrovereq=""
                // onHistoryClick={handleHistoryClick}
                onHistoryClick={(id) => handleHistoryClick(id, 'role')} // Pass tab index 1
                dashboradApi={'/permission/menuList'}   
                ifForvalue={'role'}
                />
            </div>
          )}
          {activeTab === 2 && (
            <div className="tab-pane active">
              <CustomDataTable
                // onViewClick={onViewClick}
                onViewClick={(id) => onViewClick(id, 'user')}
                onDeleteClick={onDeleteClick}
                handleApprrovereq=""
                onHistoryClick={(id) => handleHistoryClick(id, 'user')} // Pass tab index 1
                dashboradApi={'/permission/menuList'}   
                ifForvalue={'user'}
                />
            </div>
          )}
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
                    </div>

                </div>
            </div>
            
        </>
  );
}
