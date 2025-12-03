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
const customStyles = {
  content: {
    background: '#fff',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const AddPerformance = ({ isOpen, closeModal, id, isAFor, refreshData }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [AdduserContent, setAdduserContent] = useState();
  const [isFormShow, setisFormShow] = useState(false);
  const [getSectionName, setGetSectionName] = useState(isAFor);
  const [activeTab, setActiveTab] = useState();
  const [error, setError] = useState();
  const fetchForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await authenticatedRequest({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/getDynamicForm`,
        params: {
          formType: 'addGoal'
        }
      });
      if (response) {
        const formData = response.data.data;
        formData.section.forEach(section => {
          section.Subsection.forEach(subsection => {
            subsection.fields.forEach(field => {
              if (field.name === 'goalName') {
                //field.isDisabled = true;
              }
            });
          });
        });
        setAdduserContent(formData)
        setActiveTab(response.data.data.section[0].SectionName)
        setisFormShow(true)
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
  };
  const [behaviourRemain, setBehaviourRemain] = useState();
  const [learningRemain, setLearningRemain] = useState();
  const [performanceRemain, setPerformanceRemain] = useState();
  const [allGoalInfo, setAllGoalInfo] = useState([]);
  const fetchGoalForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/performance/getGoalScores`, { params: { "idReview": id } })
      if (response) {
        const formData = response.data.data;
        if (formData && formData["Behavior Goals"] !== undefined) {
          setBehaviourRemain(formData["Behavior Goals"]);
        }
        if (formData && formData["Learning Goals"] !== undefined) {
          setLearningRemain(formData["Learning Goals"]);
        }
        if (formData && formData["Performance Goals"] !== undefined) {
          setPerformanceRemain(formData["Performance Goals"]);
        }
      }
    } catch (error) {

    }
  };
  const fetchNameForm = async () => {
    try {
      const response = await authenticatedRequest({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/performance/getGoalName`,
          params: { idReview: id }
      });
      if (response) {
        setAllGoalInfo(response.data.data)
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
  };
  useEffect(() => {
    fetchForm();
    fetchNameForm();
    setGetSectionName(isAFor)
    if (isOpen) {
      fetchGoalForm();
      document.body.classList.add('remove_scroll');
    } else {
      document.body.classList.remove('remove_scroll');
    }
    return () => {
      document.body.classList.remove('remove_scroll');
    };
  }, [isOpen]);

  // Helper to update fields by name
  const updateField = (name, callback) => {
    AdduserContent.section.forEach(section =>
      section.Subsection.forEach(subsection =>
        subsection.fields.forEach(field => {
          if (field.name === name) callback(field);
        })
      )
    );
  };


  const setGoalNameDisabled = (disabled) => {
    updateField('goalName', field => field.isDisabled = disabled);
  };

  const setFieldVisibilityAndValidations = (goalTypeValue) => {
    const showRewardFields = goalTypeValue === "2b297dfa-6d63-4d2a-b90a-832a991d9020";

    updateField('target', field => {
      field.isVisible = !showRewardFields;
      field.validations = showRewardFields ? [] : [{ message: "Target is required", type: "required" }];
    });

    updateField('noOrPercentage', field => {
      field.isVisible = !showRewardFields;
      field.validations = showRewardFields ? [] : [{ message: "No. or Percentage is required", type: "required" }];
    });

    updateField('rewardPoint', field => {
      field.isVisible = showRewardFields;
      field.validations = showRewardFields ? [{ message: "Reward Point is required", type: "required" }] : [];
    });

    updateField('refreshUrl', field => {
      field.isVisible = showRewardFields;
      field.validations = showRewardFields ? [
        { message: "Url is required", type: "required" },
        {
          message: "Please Enter Valid URL",
          type: "urlCheck",
          startPattern: ["https://", "www.", "http://", "ftp://"]
        }
      ] : [];
    });
  };

  const setGoalScoreValidation = (goalTypeValue) => {
    let maxValue = null;
    if (goalTypeValue === "2b297dfa-6d63-4d2a-b90a-832a991d9020") maxValue = learningRemain;
    else if (goalTypeValue === "c288c7b0-6a5c-40a0-b7a7-1dded4358c39") maxValue = behaviourRemain;
    else if (goalTypeValue === "be8b322a-4386-43b4-969c-f098ed6be94c") maxValue = performanceRemain;

    if (maxValue !== null) {
      updateField('goalScore', field => {
        field.validations = [
          { message: "Goal weightage is required", type: "required" },
          { message: "Value must be greater than 0.", type: "minValue", minValue: 0 },
          { message: `You are not allowed to add goals more than 100%. Please check your goals and reassign.`, type: "maxValue", maxValue }
        ];
      });
    }
  };

  const setGoalNameFieldType = (typeOfLevelValue) => {
    const isCreateType = typeOfLevelValue === "b1e4e384-24da-4cfb-9cf9-7d079ca5b41f";
    updateField('goalName', field => field.type = isCreateType ? "CreateSelect" : "Select");
  };

  const setFieldType = (targetValue) => {
    const newType = targetValue === "number" ? "Number" : "Text";
    updateField('noOrPercentage', field => field.type = newType);
  };

  const [typeOfLevelValueId, setTypeOfLevelValueId] = useState("");
  const [goalTypeId, setgoalTypeId] = useState("");
  const [goalNameId, setgoalNameId] = useState("");
  const handleChangeValue = async (fieldName, value) => {
    if (fieldName === "typeOfLevel" && value) {
      setTypeOfLevelValueId(value);
      setGoalNameFieldType(value);
      if (value === "b1e4e384-24da-4cfb-9cf9-7d079ca5b41f") {
        const updatedContent = { ...AdduserContent };
        updatedContent.section = updatedContent.section.map((section) => {
          section.Subsection = section.Subsection.map((subsection) => {
            subsection.fields = subsection.fields.map((field) => {
              if (field.name === "goalScore" || field.name === "goalDetails" || field.name === "target" || field.name === "noOrPercentage") {
                return {
                  ...field,
                  value: "",
                  isDisabled: false
                };
              }
              return field;
            });
            return subsection;
          });
          return section;
        });
        setAdduserContent(updatedContent);
      }
    }
    if (fieldName === "goalType" && value) {
      setgoalTypeId(value);
      setGoalScoreValidation(value);
      setFieldVisibilityAndValidations(value);
    }
    if (fieldName === "target" && value) {
      const targetval = typeof value === "object" && value !== null ? value.value : value;
      setFieldType(targetval);
    }
    if (fieldName === "goalName" && value) {
      const goalId = typeof value === "object" && value !== null ? value.value : value;
      setgoalNameId(goalId);
      const updatedContent = { ...AdduserContent };
      updatedContent.section = updatedContent.section.map((section) => {
        section.Subsection = section.Subsection.map((subsection) => {
          subsection.fields = subsection.fields.map((field) => {
            if (field.name === "goalName") {
              return {
                ...field,
                value: goalId
              };
            }
            return field;
          });
          return subsection;
        });
        return section;
      });
    }
  };

  const handleChangess = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < AdduserContent.section.length) {
      setActiveTab(AdduserContent.section[nextIndex].SectionName);
    }
  };
  const getFilteredGoals = (typeOfLevelValueId, goalTypeId, allGoalInfo) => {
    if (!typeOfLevelValueId || !goalTypeId) return [];
    return allGoalInfo
      .filter(goal => goal.idTypeOfLevel === typeOfLevelValueId && goal.idGoalType === goalTypeId)
      .map(goal => ({ label: goal.goalName, value: goal.idGoalMaster }));
  };
  const findGoalMatch = (typeOfLevelValueId, goalTypeId, goalNameId, allGoalInfo) => {
    return allGoalInfo.find(goal =>
      goal.idGoalMaster === goalNameId &&
      goal.idTypeOfLevel === typeOfLevelValueId &&
      goal.idGoalType === goalTypeId
    );
  };
  useEffect(() => {
    if (typeOfLevelValueId !== "b1e4e384-24da-4cfb-9cf9-7d079ca5b41f") {
      if (typeOfLevelValueId !== "" && goalTypeId !== "") {
        const filteredGoals = getFilteredGoals(typeOfLevelValueId, goalTypeId, allGoalInfo);
        const updatedContent = { ...AdduserContent };
        updatedContent.section = updatedContent.section.map((section) => {
          section.Subsection = section.Subsection.map((subsection) => {
            subsection.fields = subsection.fields.map((field) => {
              if (field.name === "goalName") {
                return {
                  ...field,
                  options: filteredGoals,
                  value: ""
                };
              }
              if (field.name === "goalScore" || field.name === "goalDetails" || field.name === "target" || field.name === "noOrPercentage") {
                return {
                  ...field,
                  value: "",
                  isDisabled: true
                };
              }
              return field;
            });
            return subsection;
          });
          return section;
        });
        setAdduserContent(updatedContent);
      }
      if (typeOfLevelValueId !== "" && goalTypeId !== "" && goalNameId !== "") {
        const otherfilteredGoals = findGoalMatch(typeOfLevelValueId, goalTypeId, goalNameId, allGoalInfo);

        const updatedContent = { ...AdduserContent };
        updatedContent.section = updatedContent.section.map((section) => {
          section.Subsection = section.Subsection.map((subsection) => {
            subsection.fields = subsection.fields.map((field) => {
              if (field.name === "goalName") {
                return {
                  ...field,
                  value: goalNameId
                };
              }
              if (field.name === "goalScore" && otherfilteredGoals?.goalScore !== undefined) {
                return {
                  ...field,
                  value: otherfilteredGoals.goalScore,
                  isDisabled: true
                };
              }
              if (field.name === "goalDetails" && otherfilteredGoals?.goalDetails !== undefined) {
                return {
                  ...field,
                  value: otherfilteredGoals.goalDetails,
                  isDisabled: true
                };
              }
              if (field.name === "noOrPercentage" && otherfilteredGoals?.noOrPercentage !== undefined) {
                return {
                  ...field,
                  value: otherfilteredGoals.noOrPercentage,
                  isDisabled: true
                };
              }
              if (field.name === "target" && otherfilteredGoals?.target !== undefined) {
                return {
                  ...field,
                  value: otherfilteredGoals.target,
                  isDisabled: true
                };
              }
			  if (field.name === "refreshUrl" && otherfilteredGoals?.refreshUrl !== undefined) {
                return {
                  ...field,
                  value: otherfilteredGoals.refreshUrl,
                  isDisabled: true
                };
              }
              if (field.name === "rewardPoint" && otherfilteredGoals?.rewardPoint !== undefined) {
                return {
                  ...field,
                  value: otherfilteredGoals.rewardPoint,
                  isDisabled: true
                };
              } 
              return field;
            });
            return subsection;
          });
          return section;
        });
        setAdduserContent(updatedContent);
      }
    }
  }, [typeOfLevelValueId, goalTypeId, goalNameId]);
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
  const getGoalType = async (value) => {
    return await extractgoalType(value);
  };

  const extractgoalType = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getGoalsValues`, {
        params: { isFor: "goal_types" }
      });
      if (response) {
        const optionsData = response.data.data.map((item) => ({
          name: item.name,
          value: item.id,
        }));
        const matchingItem = optionsData.find(item => item.value === value);
        if (matchingItem) {
          return matchingItem.name;
        } else {
          return null;
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
    return null;
  };




  const submitformdata = async () => {
    const result = extractFields(AdduserContent);
    const tabInfoss = await getGoalType(result.goalInfo.goalType);
    const tabInfo = typeof tabInfoss === 'string' ? tabInfoss.split(' ')[0] : '';
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
                if (field.name === "goalScore" && field.value !== "") {
                  let goalScore = parseFloat(field.value);
                  
                  if (goalScore <= 0) {
                    errors[field.name] = `${field.label} should be greater than 0`;
                  } 
                  else if (tabInfo === "Behavior" && goalScore > behaviourRemain) {
                    errors[field.name] = `You are not allowed to add goals more than 100%. Please check your goals and reassign.`;
                  } else if (tabInfo === "Learning" && goalScore > learningRemain) {
                    errors[field.name] = `You are not allowed to add goals more than 100%. Please check your goals and reassign.`;
                  } else if (tabInfo === "Performance" && goalScore > performanceRemain) {
                    errors[field.name] = `You are not allowed to add goals more than 100%. Please check your goals and reassign.`;
                  }
                }
                
              });
            }
          });
        });
      });
      if (Object.keys(errors).length > 0) {
        setSectionErrors(errors);
      } else {
        const payloadData = {
          ...result,
          isFor: tabInfo,
          idReview: id
        };
        const response = await axiosJWT.post(`${apiUrl}/performance/addGoal`, payloadData);
        if (response) {
			setTimeout(() => {
            closeModal();
          refreshData(tabInfo);
        }, 300);
          const message = response.data.message;
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
              color: '#4caf50',
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
                <h6 className='oxyem_perfom_head_text'>Set Your New Goals to Elevate Your Performance</h6>
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
                          pagename={"perform"}
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

export default AddPerformance;
