import React, { useState, useEffect } from 'react';
import DocFrom from './DocumentComponent';
import DocFromcomman from './DocumentComponentcomman';
import PreviewComponent from './PreviewComponent';
import dynamic from 'next/dynamic';
import { FaEdit } from "react-icons/fa";
const DynamicForm = dynamic(() => import('../NewFormField.jsx'), {
  ssr: false
});
import { Tooltip } from 'react-tooltip'
export default function NewFormSecTab({ AdduserContent, headingContent, getleavedetail, handlesubmitApiData, getsubmitformdata, getleaveoption, getsubmitformdatapreview, actionid, handleBTPformvalue, pagename, showButton, converttoenable, showleave, getChangessField, tdsAmount, salaryAmount , handleNetsalaryAmt}) {
  const apiUrl = "";
  const [content, setContent] = useState(AdduserContent); // State to hold the content
  const [activeTab, setActiveTab] = useState(AdduserContent.section[0].SectionName);
  const hasMultipleSections = Array.isArray(content.section) && content.section.length > 1;
  //console.log("jfffffff", hasMultipleSections)

  const sectionname = AdduserContent.section[0].name
  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
    // You can perform additional actions based on newArray here
   // const newArray = convertToArray(sourceArray);
    //console.log("neww",content)
    // console.log("ghghhghghghg22", AdduserContent)
    //getsubmitformdata(newArray);
    setContent(AdduserContent)
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

  const updateFieldValues = (content, data) => {
    content.section.forEach((section) => {
      section.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          if (data[field.name]) {
            if (['Location', 'Department', 'Role'].includes(field.type) && typeof data[field.name] === 'object') {
              field.value = data[field.name].label; // Use the label for these field types
            } else {
              field.value = typeof data[field.name] === 'object' ? data[field.name].value : data[field.name];
            }
          }
        });
      });
    });
  };


  const submitformdata = (value) => {

    const newArray = convertToArray(AdduserContent);
    console.log("newArray", newArray)
    console.log("AdduserContent", AdduserContent)
    getsubmitformdata(newArray, value)


  };
  const submitformdataPreview = () => {

    const newArray = convertToArray(sourceArray);
    getsubmitformdatapreview(newArray)


  };

  const handlesubmitbyDocumment = (value) => {
    // Convert sourceArray to newArray
    const newArray = convertToArray(sourceArray);

    // Find the index of the "Documents" section
    const documentsIndex = newArray.section.findIndex(section => section.SectionName === "Documents");

    // If the "Documents" section exists, remove it
    if (documentsIndex !== -1) {
      handlesubmitApiData(newArray, value)
    }
  };
  const handleGetformvalueClick = (value) => {
    handleBTPformvalue(value)
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
                    className={`nav-link ${activeTab === section.SectionName ? 'active' : ''}`}
                    onClick={() => handleTabClick(section.SectionName)}
                  >
                    <div className="skolrup-profile-tab-link">{section.SectionName}</div>
                  </a>
                </li>
              )
            ))}
          </ul>

        ) : (
          <div>

          </div>
        )}


        <div className="tab-content" style={hasMultipleSections ? {} : { paddingTop: '0px' }}>



          {content.section.map((section, index) => (
            activeTab === section.SectionName && (
              <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>
                {pagename === "edit_allowcation" ? (
                  <>
                    {section.name === "ProjectDetails" ? (
                      <div className="text-end w-100 mb-4"><span className="allocation-edit-icon" onClick={converttoenable} data-tooltip-id="my-tooltip-tab" data-tooltip-content={"Edit Project"}><FaEdit /></span></div>
                    ) : (<></>)}
                  </>) : (<></>)}
                {section.isDocumentstype ? (
                  <>
                    {sectionname === "PersonalInfo" ? (
                      <DocFrom fields={section} handleChangess={() => handleChangess(index)} />
                    ) : (
                      <DocFromcomman fields={section} handleChangess={() => handleChangess(index)} handlesubmitbyDocumment={handlesubmitbyDocumment} />
                    )}
                  </>
                ) : (
                  <>
                    {section.isPreviewtype ? (
                      <PreviewComponent data={content} submitformdata={submitformdataPreview} />
                    ) : (
                      <DynamicForm
                        fieldsvalue={section}
                        content={content}
                        apiurl={apiUrl}
                        handleChangeValue={handleChangeValue}
                        Openedsection={index}
                        handleChangess={() => handleChangess(index)}
                        getleavedetail={getleavedetail}
                        submitformdata={submitformdata}
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
                        handleNetsalaryAmt={handleNetsalaryAmt}
                      />
                    )}
                  </>
                )}
              </div>
            )
          ))}
        </div>
        <Tooltip id="my-tooltip-tab" style={{ zIndex: 99999 }} />
      </div>
    </div>
  );
}
