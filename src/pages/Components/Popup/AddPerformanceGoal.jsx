import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import authenticatedRequest from '../../Auth/authenticatedRequest.jsx';
import axios from "axios";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { GoGoal } from "react-icons/go";
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { FaRegCheckCircle } from "react-icons/fa";
const DynamicForm = dynamic(() => import('../CommanForm.jsx'), {
  ssr: false
});
const AddPerformanceGoal = ({ isOpen, closeModal, refreshData, goalNameId, clickType }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [AdduserContent, setAdduserContent] = useState();
  const [isFormShow, setisFormShow] = useState(false);
  const [activeTab, setActiveTab] = useState();
  const [error, setError] = useState();
  const fetchNameForm = async (goalNameId, formData) => {
    try {
      const response = await authenticatedRequest({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/performance/getGoalNameData`,
        params: { idGoalMaster: goalNameId }
      });
      if (response) {
        const idGoalMaster = response.data.data.idGoalMaster
        const rsValue = response.data.data.goalInfo
        const commentInfo = response.data.data.commentInfo
        const updatedContent = formData;
        if (rsValue.goalType === "2b297dfa-6d63-4d2a-b90a-832a991d9020") {
          updatedContent.section = updatedContent.section.map((section) => {
            section.Subsection = section.Subsection.map((subsection) => {
              subsection.fields = subsection.fields.map((field) => {
                if (field.name === "goalName") {
                  return {
                    ...field,
                    value: rsValue.goalName,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "isActive") {
                  return {
                    ...field,
                    value: rsValue.isActive !== undefined && rsValue.isActive !== null ? rsValue.isActive : field.value,
                    isVisible: clickType === "edit" || clickType === "view",
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "goalScore" && rsValue?.goalScore !== undefined) {
                  return {
                    ...field,
                    value: rsValue.goalScore,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "target") {
                  return {
                    ...field,
                    isVisible: false,
                    validations: []
                  };
                }
                if (field.name === "noOrPercentage") {
                  return {
                    ...field,
                    isVisible: false,
                    validations: []
                  };
                }
                if (field.name === "refreshUrl" && rsValue?.refreshUrl !== undefined) {
                  return {
                    ...field,
                    isVisible: true,
                    value: rsValue.refreshUrl,
                    isDisabled: clickType === "view" ? true : false,
                    validations: [
                      {
                        "message": "Url is required",
                        "type": "required"
                      },
                      {
                        "message": "Please Enter Valid URL",
                        "type": "urlCheck",
                        "startPattern": ["https://", "www.", "http://", "ftp://"]
                      }
                    ]
                  };
                }
                if (field.name === "rewardPoint" && rsValue?.rewardPoint !== undefined) {
                  return {
                    ...field,
                    isVisible: true,
                    value: rsValue.rewardPoint,
                    isDisabled: clickType === "view" ? true : false,
                    validations: [
                      {
                        "message": "Reward Point is required",
                        "type": "required"
                      }
                    ]
                  };
                }
                if (field.name === "typeOfLevel" && rsValue?.typeOfLevel !== undefined) {
                  return {
                    ...field,
                    value: rsValue.typeOfLevel,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "goalType" && rsValue?.goalType !== undefined) {
                  return {
                    ...field,
                    value: rsValue.goalType,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "goalDetails" && rsValue?.goalDetails !== undefined) {
                  return {
                    ...field,
                    value: rsValue.goalDetails,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "addRemarks" && commentInfo?.addRemarks !== undefined) {
                  return {
                    ...field,
                    value: commentInfo.addRemarks,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                return field;
              });
              return subsection;
            });
            if (clickType === "view") {
              section.buttons = [];
            }
            return section;
          });
        } else {
          updatedContent.section = updatedContent.section.map((section) => {
            section.Subsection = section.Subsection.map((subsection) => {
              subsection.fields = subsection.fields.map((field) => {
                if (field.name === "goalName") {
                  return {
                    ...field,
                    value: rsValue.goalName,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "isActive") {
                  return {
                    ...field,
                    value: rsValue.isActive !== undefined && rsValue.isActive !== null ? rsValue.isActive : field.value,
                    isVisible: clickType === "edit" || clickType === "view",
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "goalScore" && rsValue?.goalScore !== undefined) {
                  return {
                    ...field,
                    value: rsValue.goalScore,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "target" && rsValue?.target !== undefined) {
                  return {
                    ...field,
                    value: rsValue.target,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "noOrPercentage" && rsValue?.noOrPercentage !== undefined) {
                  return {
                    ...field,
                    value: rsValue.noOrPercentage,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "refreshUrl" && rsValue?.refreshUrl !== undefined) {
                  return {
                    ...field,
                    value: rsValue.refreshUrl,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "rewardPoint" && rsValue?.rewardPoint !== undefined) {
                  return {
                    ...field,
                    value: rsValue.rewardPoint,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "typeOfLevel" && rsValue?.typeOfLevel !== undefined) {
                  return {
                    ...field,
                    value: rsValue.typeOfLevel,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "goalType" && rsValue?.goalType !== undefined) {
                  return {
                    ...field,
                    value: rsValue.goalType,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "goalDetails" && rsValue?.goalDetails !== undefined) {
                  return {
                    ...field,
                    value: rsValue.goalDetails,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                if (field.name === "addRemarks" && commentInfo?.addRemarks !== undefined) {
                  return {
                    ...field,
                    value: commentInfo.addRemarks,
                    isDisabled: clickType === "view" ? true : false
                  };
                }
                return field;
              });
              return subsection;
            });
            if (clickType === "view") {
              section.buttons = [];
            }
            return section;
          });
        }
        setAdduserContent(updatedContent);
        setActiveTab(updatedContent.section[0].SectionName)
        setisFormShow(true)
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
  };
  const fetchForm = async () => {
    try {
      const response = await authenticatedRequest({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/getDynamicForm`,
        params: {
          formType: 'addGoalName'
        }
      });
      if (response) {
        const formData = response.data.data;
        if (!goalNameId) {
          setAdduserContent(formData)
          setActiveTab(response.data.data.section[0].SectionName)
          setisFormShow(true)
        } else {
          fetchNameForm(goalNameId, formData)
        }

      }
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
  };

  useEffect(() => {

    if (isOpen) {
      document.body.classList.add('remove_scroll');
      fetchForm();
    } else {
      document.body.classList.remove('remove_scroll');
    }
    return () => {
      document.body.classList.remove('remove_scroll');
    };
  }, [isOpen]);

  const handleChangeValue = async (fieldName, value) => {
    let typeOfLevelValue = "";
    let goalTypeValue = "";
    let targetValue = "";
    AdduserContent.section.forEach(section => {
      section.Subsection.forEach(subsection => {
        subsection.fields.forEach(field => {
          if (field.name === 'typeOfLevel') typeOfLevelValue = field.value;
          if (field.name === 'goalType') goalTypeValue = field.value;
          if (field.name === 'target') {
            targetValue = (typeof field.value === 'object' && field.value !== null && 'value' in field.value)
              ? field.value.value
              : field.value;
          }
        });
      });
    });
    const newType = targetValue === "number" ? "Number" : "Text";
    AdduserContent.section.forEach(section => {
      section.Subsection.forEach(subsection => {
        subsection.fields.forEach(field => {
          if (field.name === 'noOrPercentage') {
            field.type = newType;
          }
        });
      });
    });
    if (typeOfLevelValue !== "" && goalTypeValue !== "") {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'goalName') {
              const array = {
                typeOfLevel: typeOfLevelValue,
                goalType: goalTypeValue
              }
              field.dependentId = "";
            }
          });
        });
      });
    } else {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'goalName') {
              field.dependentId = "";
            }
          });
        });
      });
    }
    if (goalTypeValue === "2b297dfa-6d63-4d2a-b90a-832a991d9020") {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'target') {
              field.isVisible = false;
              field.validations = [];
            }
            if (field.name === 'noOrPercentage') {
              field.isVisible = false;
              field.validations = [];
            }
            if (field.name === 'rewardPoint') {
              field.isVisible = true;
              field.validations = [
                {
                  "message": "Reward Point is required",
                  "type": "required"
                }
              ];
            }
            
            if (field.name === 'refreshUrl') {
              field.isVisible = true;
              field.validations = [
                {
                  "message": "Url is required",
                  "type": "required"
                },
                {
                  "message": "Please Enter Valid URL",
                  "type": "urlCheck",
                  "startPattern": ["https://", "www.", "http://", "ftp://"]
                }
              ];
            }
          });
        });
      });
    } else {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'target') {
              field.isVisible = true;
              field.validations = [
                {
                  "message": "Target is required",
                  "type": "required"
                }
              ];
            }
            if (field.name === 'noOrPercentage') {
              field.isVisible = true;
              field.validations = [
                {
                  "message": "No. or Percentage is required",
                  "type": "required"
                }
              ];
            }
            if (field.name === 'rewardPoint') {
              field.isVisible = false;
              field.validations = [];
            }
            if (field.name === 'refreshUrl') {
              field.isVisible = false;
              field.validations = [];
            }
          });
        });
      });
    }
    if (goalTypeValue === "2b297dfa-6d63-4d2a-b90a-832a991d9020") {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'goalScore') {
              field.validations = [
                {
                  "message": "Goal weightage is required",
                  "type": "required"
                },
                {
                  "message": "Value must be greater than 0.",
                  "type": "minValue",
                  "minValue": 0
                }
              ]
            }
          });
        });
      });
    } else if (goalTypeValue === "c288c7b0-6a5c-40a0-b7a7-1dded4358c39") {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'goalScore') {
              field.validations = [
                {
                  "message": "Goal weightage is required",
                  "type": "required"
                },
                {
                  "message": "Value must be greater than 0.",
                  "type": "minValue",
                  "minValue": 0
                }
              ]
            }
          });
        });
      });
    } else if (goalTypeValue === "be8b322a-4386-43b4-969c-f098ed6be94c") {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'goalScore') {
              field.validations = [
                {
                  "message": "Goal weightage is required",
                  "type": "required"
                },
                {
                  "message": "Value must be greater than 0.",
                  "type": "minValue",
                  "minValue": 0
                }
              ]
            }
          });
        });
      });
    }

    if (typeOfLevelValue === "928c0306-9dfe-41c3-a5da-48ba5a6260d8") {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'project') {
              field.isVisible = true;
              field.validations = [
                {
                  "message": "Project Name is required",
                  "type": "required"
                }
              ]
            }
          });
        });
      });
    } else {
      AdduserContent.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
            if (field.name === 'project') {
              field.isVisible = false;
              field.validations = [];
            }
          });
        });
      });
    }
    setAdduserContent({ ...AdduserContent });
  };
  const handleChangess = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < AdduserContent.section.length) {
      setActiveTab(AdduserContent.section[nextIndex].SectionName);
    }
  };
  const [sectionerrors, setSectionErrors] = useState({});
  function extractFields(data) {
    const result = {};
    data.section.forEach(section => {
      section.Subsection.forEach(subsection => {
        subsection.fields.forEach(field => {
          if (field.value) {
            const sectionName = section.apiLabel;
            const fieldName = field.name;
            const fieldValue = (typeof field.value === 'object' && field.value !== null)
              ? field.value.value
              : field.value;
            if (!result[sectionName]) {
              result[sectionName] = {};
            }
            result[sectionName][fieldName] = fieldValue;
          }
        });
      });
    });
    return result;
  }


  const submitformdata = async () => {
    if (activeTab === "Comments") {
      let errors = {};
      AdduserContent.section.forEach((section) => {
        section.Subsection.forEach((subsection) => {
          subsection.fields.forEach((field) => {
            if (field.validations && field.validations.length > 0) {
              field.validations.forEach((validation) => {
                if (validation.type === "required" && field.value === "") {
                  errors[field.name] = `${field.label} is required`;
                }
              });
            }
          });
        });
      });
      if (Object.keys(errors).length > 0) {
        setSectionErrors(errors);
      } else {
        const result = extractFields(AdduserContent);
        const payloadData = {
          ...result,
          ...(goalNameId ? { idGoalMaster: goalNameId } : {})
        };

        const response = await axiosJWT.post(`${apiUrl}/performance/addGoalNameDetails`, payloadData);
        if (response) {
          refreshData();
          closeModal();
          let message;
          if (clickType === "edit") {
            message = "The goal has been successfully updated.";
          } else {
            message = "New goal added successfully.";
          }

          toast.success(({ id }) => (
            <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
              <FaRegCheckCircle style={{
                fontSize: '35px',
                marginRight: '10px',
                color: '#4caf50'
              }} />
              <span dangerouslySetInnerHTML={{ __html: message }}></span>
              <button
                onClick={() => toast.dismiss(id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4caf50',
                  marginLeft: 'auto',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                <FaTimes />
              </button>
            </div>
          ), {
            icon: null, // Disable default icon
            duration: 7000,
            style: {
              border: '1px solid #4caf50',
              padding: '8px',
              color: '#000',
            },
          });
        }
      }
    }
  };

  const removeError = (key) => {
    const newErrors = { ...sectionerrors };
    delete newErrors[key];
    setSectionErrors(newErrors);
  };

  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay'
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body oxyem_perfprmance_tab">
            <div className='row align-item-center'>
              <div className='col-1 oxyem_perfom_head_icon'>
                <GoGoal />
              </div>
              <div className='col-11'>
                <h6 className='oxyem_perfom_head_text'>Add New Goal Name</h6>
                <p className='oxyem_perfom_subtext'>Define clear and measurable goals to track performance, behavior, and learning progress.</p>
              </div>
            </div>
            {isFormShow ? (
              <div className="vertical-tabs-container">
                <div className="tabs">
                  {Array.isArray(AdduserContent.section) ? (
                    <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
                      {AdduserContent.section.map((section, index) => (
                        section.isVisible && (
                          <li key={index} className={`nav-item ${activeTab === section.SectionName ? 'active' : ''}`}>
                            <a
                              className={`nav-link`}
                              onClick={() => setActiveTab(section.SectionName)}
                            >{section.SectionName}
                            </a>
                          </li>
                        )
                      ))}
                    </ul>
                  ) : (
                    null
                  )}
                </div>
                <div className="tab-content">
                  {sectionerrors && Object.keys(sectionerrors).map((key) => (
                    <div key={key} className="alert alert-danger alert-dismissible fade show" role="alert">
                      {sectionerrors[key]}
                      <button type="button" className="btn-close" aria-label="Close" onClick={() => removeError(key)}></button>
                    </div>
                  ))}
                  {AdduserContent.section.map((section, index) => (
                    activeTab === section.SectionName && (
                      <div key={index} className={`tab-pane section-name-${section.SectionName} ${activeTab === section.SectionName ? 'active' : ''}`}>
                        <h4 className='goal_popup_text'>{section.textData}</h4>
                        {section.subtextData ? (<p className='goal_popup_text-sub'>{section.subtextData}</p>) : (null)}
                        {section.textHighlight ? (<p className='goal_popup_text-highlight'>{section.textHighlight}</p>) : (null)}
                        <DynamicForm
                          fields={section}
                          content={AdduserContent}
                          apiurl={apiUrl}
                          handleChangeValue={handleChangeValue}
                          Openedsection={index}
                          handleChangess={() => handleChangess(index)}
                          submitformdata={submitformdata}
                          isModule={AdduserContent.formType}
                          pagename={"performGoalName"}
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (null)}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AddPerformanceGoal;
