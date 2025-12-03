import React, { useState, useEffect } from 'react';
import PreviewComponent from './PreviewComponent';
import dynamic from 'next/dynamic';
const DynamicForm = dynamic(() => import('./NewFormField.jsx'), {
  ssr: false
});
import { Tooltip } from 'react-tooltip';

export default function NewFormSecTab({ AdduserContent, headingContent, getleavedetail, handlesubmitApiData, getsubmitformdata, getleaveoption, getsubmitformdatapreview, actionid, handleBTPformvalue, pagename, showButton, converttoenable, showleave, getChangessField, tdsAmount, salaryAmount, previewData ,tdsoveridevalue ,pageedit }) {
  const apiUrl = "";
  const [content, setContent] = useState(AdduserContent);
  const [activeTab, setActiveTab] = useState(AdduserContent.section[0].SectionName);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // New state to track form submission
  const hasMultipleSections = Array.isArray(content.section) && content.section.length > 1;

  const sectionname = AdduserContent.section[0].name;

  const handleTabClick = (tab) => {
    if (tab !== 'Preview' || isFormSubmitted) { // Prevent switching to the preview tab if not submitted
      if (tab !== 'Preview') {
        setIsFormSubmitted(false); // Reset form submission state when navigating away from the preview tab
      }
      setActiveTab(tab);
    }
  };

  const convertToArray = (sourceArray) => {
    const newArray = {
      feature: sourceArray.formType,
      section: []
    };

    sourceArray.section.forEach(section => {
      const newSection = {
        SectionName: section.SectionName.replace(/\s/g, ''),
        fields: []
      };

      section.Subsection.forEach(subsection => {
        subsection.fields.forEach(field => {
          let attributeValue = field.value;
          if (field.value != null && typeof field.value === 'object' && 'value' in field.value) {
            attributeValue = field.value.value;
          }

          const newField = {
            name: field.name,
            attributeValue: attributeValue
          };
          newSection.fields.push(newField);
        });
      });

      newArray.section.push(newSection);
    });

    return newArray;
  };

  useEffect(() => {
    setContent(AdduserContent);
  }, [AdduserContent]);

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
            break; // Stop further iteration once the field is found and updated
          }
        }
      }
    }
    if (
      activeTab === "Personal Information" &&
      fieldName === "experience"
    ) {
      // If the value of "experience" is false, remove the "Prior Work Experience" section
      if (!value) {
        const priorWorkExperienceIndex = updatedArray.section.findIndex(
          (section) => section.SectionName === "Prior Work Experience"
        );
        if (priorWorkExperienceIndex !== -1) {
          updatedArray.section.splice(priorWorkExperienceIndex, 1);
        }
      }
    }
    // Update your state or variable holding the array with the updatedArray
    setContent(updatedArray);
  };

  const handleChangess = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < content.section.length) {
      setActiveTab(content.section[nextIndex].SectionName);
    }
  };

  const handelUpdateFormData = async (value) => {
    try {
        updateFormData(value);
    } catch (error) {
    }
};

const updateFormData = (data) => {
    const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array
    for (let i = 0; i < updatedArray.section.length; i++) {
        const section = updatedArray.section[i];

        for (let j = 0; j < section.Subsection.length; j++) {
            const subsection = section.Subsection[j];

            for (let k = 0; k < subsection.fields.length; k++) {
                const field = subsection.fields[k];

                switch (field.name) {
                    case 'otherAllowance':
                        updatedArray.section[i].Subsection[j].fields[k].value = data.earning;
                        break;
                    case 'deductionOtherAllowance':
                        updatedArray.section[i].Subsection[j].fields[k].value = data.deductions;
                        break;
                    // Add more cases if there are other fields to update
                    default:
                  break;
                }
            }
        }
    }
    setContent(updatedArray);
};

  const submitformdata = (value, currentIndex) => {
    const newArray = convertToArray(AdduserContent);
    handelUpdateFormData(value);
    getsubmitformdata(newArray, value);
    setIsFormSubmitted(true); // Set form submission state to true
    handleChangess(currentIndex); // Call handleChangess to navigate to the next tab
  };

  const submitformdataPreview = () => {
    const newArray = convertToArray(AdduserContent); // Use AdduserContent instead of sourceArray
    getsubmitformdatapreview(newArray);
  };

  const handleGetformvalueClick = (value) => {
    handleBTPformvalue(value);
  };

  return (
    <div className="center-part">
      <div className="card-body -body skolrup-learning-card-body">
        <div className="row">
          <div className="col-12">
            <div className="user-text skolrup-m-user-text">
              <h5>{headingContent}</h5>
            </div>
          </div>
        </div>
        {Array.isArray(content.section) && content.section.length > 1 ? (
          <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
            {content.section.map((section, index) => (
              section.isVisible && (
                <li key={index} className="nav-item">
                  <a
                    className={`nav-link ${activeTab === section.SectionName ? 'active' : ''} ${section.SectionName === 'Preview' && !isFormSubmitted ? 'disabled' : ''}`} // Disable the preview tab
                    onClick={() => handleTabClick(section.SectionName)}
                  >
                    <div className="skolrup-profile-tab-link">{section.SectionName}</div>
                  </a>
                </li>
              )
            ))}
          </ul>
        ) : (
          <div></div>
        )}

        <div className="tab-content" style={hasMultipleSections ? {} : { paddingTop: '0px' }}>
          {content.section.map((section, index) => (
            activeTab === section.SectionName && (
              <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>
                <>
                  {section.isPreviewtype && isFormSubmitted ? (
                    <PreviewComponent data={content} submitformdata={submitformdataPreview} previewData={previewData} tdsoveridevalue={tdsoveridevalue} fields={section}/>
                  ) : (
                    <DynamicForm
                      fieldsvalue={section}
                      content={content}
                      apiurl={apiUrl}
                      handleChangeValue={handleChangeValue}
                      Openedsection={index}
                      handleChangess={() => handleChangess(index)}
                      getleavedetail={getleavedetail}
                      submitformdata={(value) => submitformdata(value, index)} // Pass the current index
                      getleaveoption={getleaveoption}
                      isModule={content.formType}
                      actionid={actionid}
                      handleGetformvalueClick={handleGetformvalueClick}
                      pagename={pagename}
                      showButton={showButton}
                      showleave={showleave}
                      getChangessField={getChangessField}
                      tdsAmount={tdsAmount}
                      salaryAmount={salaryAmount}
                      pageedit={pageedit}
                    />
                  )}
                </>
              </div>
            )
          ))}
        </div>
        <Tooltip id="my-tooltip-tab" style={{ zIndex: 99999 }} />
      </div>
    </div>
  );
}