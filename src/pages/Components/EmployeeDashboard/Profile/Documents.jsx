import React, { useEffect, useState } from 'react';
import Education from './Table/Education';
import EditTab from '../Edit/EditTab';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function Documents({ empId, apiBaseUrl ,showbutton}) {
  const [documents, setDocuments] = useState([{ type: '', files: [] }]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [errors, setErrors] = useState({ documentName: '' });
  const [activeTab, setActiveTab] = useState('education'); // State to manage active tab

  const openEditModal = () => {
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const handleSubmitByDocument = async (formData) => {
    try {
      if (formData) {
        formData.append('idEmployee', empId);

        const apiUrl = `${apiBaseUrl}/uploadDocuments`;

        const response = await axiosJWT.post(apiUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        closeEditModal();
        fetchInfo();
      }
    } catch (error) {
      // console.error("Error occurred during API call:", error);
    }
  };

  const [allData, setAllData] = useState({ formColumns: {}, data: {} });

  const fetchInfo = async () => {
    try {
      if (empId) {
        const response = await axiosJWT.get(`${apiBaseUrl}/getDocumentInfo`, {
          params: { idEmployee: empId },
        });

        if (response.status === 200 && response.data.data) {
          setAllData(response.data.data);
        } else if (response.status === 404) {
          setAllData({ formColumns: {}, data: {} });
        }
      }
    } catch (error) {
      // console.error("Error occurred during API call:", error);
    } 
  };

  useEffect(() => {
    fetchInfo();
  }, [empId]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <EditTab isOpen={isEditOpen} closeModal={closeEditModal} handleSubmitByDocument={handleSubmitByDocument} documents={documents} setDocuments={setDocuments} />
      <div className="card-body">
        <h3 className="card-title">
          Documents 
          {!showbutton ? null : <span className="add-btn-circle" onClick={openEditModal}>+</span>}
        </h3>
        <div className="experience-box">
          <div className="card tab-box">
            <div className="row user-tabs">
              <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                <ul className="nav nav-tabs nav-tabs-bottom">
                  <li className="nav-item">
                    <a onClick={() => handleTabChange('education')} className={`nav-link ${activeTab === 'education' ? 'active' : ''}`}>
                      Education
                    </a>
                  </li>
                  <li className="nav-item">
                    <a onClick={() => handleTabChange('experience')} className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`}>
                      Experience
                    </a>
                  </li>
                  <li className="nav-item">
                    <a  onClick={() => handleTabChange('compensation')} className={`nav-link ${activeTab === 'compensation' ? 'active' : ''}`}>
                      Compensation
                    </a>
                  </li>
                  <li className="nav-item">
                    <a onClick={() => handleTabChange('other_documents')} className={`nav-link ${activeTab === 'other_documents' ? 'active' : ''}`}>
                      Other Documents
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div className={`pro-overview tab-pane fade ${activeTab === 'education' ? 'show active' : ''}`} id="education">
                    <div className="row">
                      <div className="col-md-12">
                        <Education activeTab={activeTab} allData={allData}/>
                      </div>
                    </div>
                  </div>
                  <div className={`pro-overview tab-pane fade ${activeTab === 'experience' ? 'show active' : ''}`} id="experience">
                    <div className="row">
                      <div className="col-md-12">
                      <Education activeTab={activeTab} allData={allData}/>
                      </div>
                    </div>
                  </div>
                  <div className={`pro-overview tab-pane fade ${activeTab === 'compensation' ? 'show active' : ''}`} id="compensation">
                    <div className="row">
                      <div className="col-md-12"><Education activeTab={activeTab} allData={allData}/></div>
                    </div>
                  </div>
                  <div className={`pro-overview tab-pane fade ${activeTab === 'other_documents' ? 'show active' : ''}`} id="other_documents">
                    <div className="row">
                      <div className="col-md-12"><Education activeTab={activeTab} allData={allData}/></div>
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
