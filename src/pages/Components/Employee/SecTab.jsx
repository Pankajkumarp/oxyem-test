import React, { useState, useEffect } from 'react';
import DocFrom from './DocumentComponent';
import DocFromcomman from './DocumentComponentcomman';
import PreviewComponent from './PreviewComponent';
import dynamic from 'next/dynamic';
import Details from '../../onboardDashboard/innercomponet/detail.jsx';
import { FaEdit } from "react-icons/fa";
const DynamicForm = dynamic(() => import('../CommanForm.jsx'), {
  ssr: false
});
import { Tooltip } from 'react-tooltip'
import SummaryView from '../summary/summaryview.jsx';
export default function SecTab({ AdduserContent, headingContent, getleavedetail, handlesubmitApiData, getsubmitformdata, getleaveoption, getsubmitformdatapreview, actionid, handleBTPformvalue, pagename, showButton, converttoenable, showleave, getChangessField, handleGetEmpDetail, handleGetproject ,LossOfPayApplicable,getsubmitformdatahitApi,assetid, handleGetfiles, filegetpagename ,applicantDetails, cancelClickAction,applicantid, btpstpvalue ,handelPreviewPdf,loaderSubmitButton ,handleDescriptionDetail,getRewardData ,attachments ,autofillData, isPageType}) {
  const apiUrl = "";
  const [content, setContent] = useState(AdduserContent); // State to hold the content
  const [activeTab, setActiveTab] = useState(AdduserContent.section[0].SectionName);
  const hasMultipleSections = Array.isArray(content.section) && content.section.length > 1;

  const sectionname = AdduserContent.section[0].name
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (pagename === "onprocessBoarding") {
      const { completeSections, section, status } = AdduserContent;
      if (status === "rejected") {
        setActiveTab(completeSections);
        return;
      }
      const completedIndex = section.findIndex(sec => sec.SectionName === completeSections);
      const nextSection = completedIndex >= 0 && completedIndex + 1 < section.length 
        ? section[completedIndex + 1].SectionName 
        : AdduserContent.section[0].SectionName;
      setActiveTab(nextSection);
    }
  }, [AdduserContent]);
  
  const sourceArray = {
    "formType": content.formType,
    "section": content.section
  };

  

  const convertToArray = (sourceArray) => {
    const newArray = {
      feature: sourceArray.formType,
      section: []
    };

    if (assetid) {
      newArray.idAsset = assetid;
    }
    if (applicantid) {
      newArray.idJobApplicant = applicantid;
    }
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
  
        // Add the additional field for "addleave" page
        if ( (sourceArray.formType === "Admin_Leave" || sourceArray.formType === "addLeave") && LossOfPayApplicable === "yes") {
          newSection.fields.push({
            name: "isLossOfPayApplicable",
            attributeValue: "yes"
          });
        }
      });
  
      newArray.section.push(newSection);
    });
  
    return newArray;
  };
  


  useEffect(() => {
    const newArray = convertToArray(sourceArray);
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
	if(pagename === "updateProjection"){
      if(fieldName === "idEmployee"){
        handleGetEmpDetail(value)
      }
    }

    if(pagename === "addReward"){
      if(fieldName === "name"){
        handleGetEmpDetail(value)
      }
      else if(fieldName === "description"){
        handleDescriptionDetail(value)
      }
    }


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


  const submitformdata = () => {
    const newArray = convertToArray(sourceArray);
    if (pagename === "edit_allowcation") {
      handlesubmitApiData(newArray)
    }
    if (pagename === "edit_attendances") {
      handlesubmitApiData(newArray)
    }
    getsubmitformdata(newArray)
  };
  const submitformdataPreview = () => {
    const newArray = convertToArray(sourceArray);
    getsubmitformdatapreview(newArray)
  };

  const handlesubmitbyDocumment = (value) => {
    const newArray = convertToArray(sourceArray);
    const documentsIndex = newArray.section.findIndex(section => section.SectionName === "Documents");
    if (documentsIndex !== -1) {
      handlesubmitApiData(newArray, value)
    }
  };
  const handleGetformvalueClick = (value) => {
    handleBTPformvalue(value)
  };

  const handleAssetsformvalueClick = (value ,files) => {
    const filteredSections = content.section.filter(section => section.isVisible !== false);
    const currentIndex = filteredSections.findIndex(section => section.SectionName === activeTab);
    const nextIndex = filteredSections.findIndex((section, index) => index > currentIndex && section.isVisible !== false);
    if (nextIndex !== -1) {
      setActiveTab(filteredSections[nextIndex].SectionName);
    } else {
      const newArray = convertToArray(sourceArray);
      getsubmitformdatahitApi(newArray);
    }
  };

  const handleOnprocessBoarding = (buttonType, buttonvalue, value) => {
    const newArray = convertToArray(sourceArray);
    if (pagename === "onprocessBoarding") {
      getsubmitformdata(newArray,buttonType,buttonvalue)
    }
  };

  const handelPreviewPdfData = (buttonType, formData) => {
    const newArray = convertToArray(sourceArray);
    if (pagename === "addReward") {
      handelPreviewPdf(buttonType ,newArray)
    }
  };

  const handelAttendanceData = (formData,id) => {
    const newArray = convertToArray(sourceArray);
    if (pagename === "add_attendances") {
      console.log(newArray ,id);  
      handlesubmitApiData(newArray ,id)
    }
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
        {pagename === "onprocessBoarding" ? (
          <>
          <div className='on_borad_tab_icon'>
  {content.section.map((section, index) => {
    const completedSections = content.completeSections || ''; // Ensure it's a string
    const status = content.status || '';
    const completedIndex = content.section.findIndex(sec => sec.SectionName === completedSections); // Find index of completed section
    const isComplete = index <= completedIndex;
    const isRejected = status === 'rejected';
    const isNext = index === completedIndex + (isRejected ? 0 : 1);

    return (
      section.isVisible && (
        <>
          <div
            key={index}
            onClick={ (isComplete || isNext) ? () => handleTabClick(section.SectionName) : null} // Disable click if rejected
            className={`tab_icons_format ${activeTab === section.SectionName ? 'active' : ''} ${isComplete ? 'complete' :''} ${isNext && (!isRejected) ? 'next' : ''} ${(isRejected && completedSections === section.SectionName) ? 'tab-rejected' : ''} ${isRejected ? '' : ''}`}>
            {section.SectionName}
          </div>
          {index !== content.section.length - 1 && (
            <div className={`tab_icons_line`}></div>
          )}
        </>
      )
    );
  })}
</div>
      </>
        ) : (
          <>
            {
              Array.isArray(content.section) && content.section.length > 1 ? (
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
              )
            }
          </>
        )}


        <div className="tab-content" style={hasMultipleSections ? {} : { paddingTop: '0px' }}>

        {pagename === "onprocessBoarding"  && (
        <Details applicantDetails={applicantDetails} activeTab={activeTab} applicantid={applicantid}/>
        )}

          {pagename === "view_allowcation" || pagename === "edit_allowcation" ? (
            <>
              {content.section.map((section, index) => (
                activeTab === section.SectionName && (
                  <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>
                    {section.name === "summary" ? (
                      <SummaryView field={section.Subsection[0].value} />
                    ) : (
                      <>
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
                                fields={section}
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
                                handleGetproject={handleGetproject}
                                handleAssetsformvalueClick={handleAssetsformvalueClick}
                                handleGetfiles={handleGetfiles}
                                filegetpagename={filegetpagename}
								                cancelClickAction={cancelClickAction}
								                btpstpvalue={btpstpvalue}
                                isPageType={isPageType}
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                )
              ))}
            </>
          ) : (
            <>
              {content.section.map((section, index) => (
                activeTab === section.SectionName && (
                  <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>
                    {section.isDocumentstype ? (
                      <>
                        {sectionname === "PersonalInfo" ? (
                          <DocFrom fields={section} handleChangess={() => handleChangess(index)} />
                        ) : (
                          <DocFromcomman fields={section} handleChangess={() => handleChangess(index)} handlesubmitbyDocumment={handlesubmitbyDocumment} loaderSubmitButton={loaderSubmitButton}/>
                        )}
                      </>
                    ) : (
                      <>
                        {section.isPreviewtype ? (
                          <PreviewComponent data={content} submitformdata={submitformdataPreview} />
                        ) : (
                          <DynamicForm
                            fields={section}
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
                            handleGetproject={handleGetproject}
                            handleAssetsformvalueClick={handleAssetsformvalueClick}
                            handleGetfiles={handleGetfiles}
                            filegetpagename={filegetpagename}
							              cancelClickAction={cancelClickAction}
							              btpstpvalue={btpstpvalue}
                            handleOnprocessBoarding={handleOnprocessBoarding}
                            handelPreviewPdf={handelPreviewPdfData}
                            loaderSubmitButton={loaderSubmitButton}
                            getRewardData={getRewardData}
                            handelAttendanceData={handelAttendanceData}
                            attachments={attachments}
                            autofillData={autofillData}
                            isPageType={isPageType}
                          />
                        )}
                      </>
                    )}
                  </div>
                )
              ))}
            </>
          )}
        </div>
        <Tooltip id="my-tooltip-tab" style={{ zIndex: 99999 }} />
      </div>
    </div>
  );
}
