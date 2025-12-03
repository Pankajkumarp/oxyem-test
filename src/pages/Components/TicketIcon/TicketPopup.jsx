import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from "../../Auth/AddAuthorization";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ToastNotification, ToastContainer } from '../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
const DynamicForm = dynamic(() => import('../CommanForm.jsx'), {
  ssr: false
});

export default function Ticket({ isOpen, closeModal, screenshot, documentsuploaded }) {
  const [showSecTab, setshowSecTab] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [content, setContent] = useState([]);
  const router = useRouter();
  const [autofillData, setAutofillData] = useState({
    title: '',
    path: ''
  });

  useEffect(() => {
    if (isOpen) {
      const breadcrumbItems = document.querySelectorAll('.breadcrumb .breadcrumb-item');
    
    const breadcrumbText = Array.from(breadcrumbItems)
      .map(item => item.innerText.trim())
      .join(' > ');
      const pageURL = window.location.href;

      setAutofillData({
        // title: breadcrumbText,
        path: pageURL
      });
    }
  }, [isOpen]);


  const headingContent = '';
  const fetchForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "ticket" } });

      if (response.status === 200 && response.data.data) {
        setContent(response.data.data);
        setshowSecTab(true);
      }
    } catch (error) {
        console.error("Error occurred during API call:", error);
    }
  };
  useEffect(() => {
    if(isOpen){
    fetchForm();
    }
    if (screenshot) {
      setAttachments([
        {
          name: 'screenshot.png',
          type: 'image/png',
          url: screenshot
        }
      ]);
    }
  }, [isOpen]);

    const handleChangeValue = (fieldName, value) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array
        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];

            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];
                    if (field.name === fieldName) {
                        // Update the value of the field with matching fieldName
                        updatedArray.section[i].Subsection[j].fields[k].value = value;
                        if (field.name=="moduleName"){
                            const functionsField = subsection.fields.find(f => f.name === 'title');
                        if (functionsField) {
                            functionsField.dependentId = value.value;
                        }else {
                          functionsField.dependentId = null;
                        }
                        }
                        
                        break;
                    }
                }
            }
        }
        setContent(updatedArray);
    };

  const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
  const submitformdata = async (formdata, fileData) => {
    const formattedData = {};
    setSubmitButtonLoading(true);
    if (content && Array.isArray(content.section)) {
      content.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            // Skip radio objects
            if (field.type === 'Radiot&c' || field.type === 'documents') { return; }

            if (typeof field.value === 'object' && 'value' in field.value) {
              formattedData[field.name] = field.value.value;
            } else {
              formattedData[field.name] = field.value;
            }
          });
        });
      });
    }
    const formData = new FormData();
    try {

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/ticket/managetickets';
      formData.append('formData', JSON.stringify(formattedData));
      if (Array.isArray(fileData)) {
        fileData.forEach((file) => {
          formData.append('file', file);
        });
      } else {
        console.error('fileData is not an array:', fileData);

      }

      const response = await axiosJWT.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {

        ToastNotification({ message: response.data.message });
        setSubmitButtonLoading(false);
    closeModal();
        

      }
    } catch (error) {

      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
        ToastNotification({ message: errorMessage });
      } else {
        ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
      }
      setSubmitButtonLoading(false);
    }
  };

  const cancelClickAction = async (value) => {
    setAutofillData({ title: '', path: '' });
    closeModal();
  };


  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction="right"
      className="custom-drawer"
      overlayClassName="custom-overlay"
    >
      <div className="modal-dialog modal-lg oxyem-user-image-select">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body">
            <div>
              {showSecTab && (
                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                  {content && content.section && Array.isArray(content.section) ? (
                    content.section.map((section, index) => (
                      <div key={index} >
                        <DynamicForm
                          fields={section}
                          submitformdata={submitformdata}
                          handleChangeValue={handleChangeValue}
                          handleChangess={() => handleChangess(index)}
                          attachments={attachments}
                          pagename={'ticket'}
                          isModule={content.formType}
                          loaderSubmitButton={SubmitButtonLoading}
                          cancelClickAction={cancelClickAction}
                          autofillData={autofillData}
                        />
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>

              )}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
