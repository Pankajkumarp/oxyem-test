import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DocFrom from './DocumentComponent.jsx';
import DocFromcomman from './DocumentComponentcomman.jsx';
import PreviewComponent from './PreviewComponent.jsx';
import { FaEdit } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';

const DynamicForm = dynamic(() => import('../CommanForm.jsx'), {
  ssr: false
});

export default function SecTab({
  AdduserContent,
  headingContent,
  getleavedetail,
  handlesubmitApiData,
  getsubmitformdata,
  getleaveoption,
  getsubmitformdatapreview,
  actionid,
  handleBTPformvalue,
  pagename,
  showButton,
  converttoenable,
  showleave,
  getChangessField,
  handleGetEmpDetail,
  handleGetproject,
  LossOfPayApplicable,
  getsubmitformdatahitApi,
  assetid,
  handleExportClick,
  loaderSubmitButton
}) {
  const apiUrl = "";
  const [content, setContent] = useState(AdduserContent); // State to hold the content
  const [activeTab, setActiveTab] = useState(AdduserContent.section[0].SectionName);
  const hasMultipleSections = Array.isArray(content.section) && content.section.length > 1;
  const [currentType, setCurrentType] = useState(null); // State to store the current type
  const sectionname = AdduserContent.section[0].name;
  const [myFile, setFile] = useState(''); // State to store the current type
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
  
  const filterSectionsBasedOnAssetType = (content, assetType) => {
    if (!content || !Array.isArray(content.section)) {
      return content;
    }
  
    const section = content.section.find(sec => sec.SectionName === "Assets Information");
    const assetTypeField = section.Subsection[0].fields.find(field => field.name === "typeOfAsset");
  
    if (!assetTypeField || !assetTypeField.value) {
      return content;
    }
  
    const assetTypeLabel = assetTypeField.value.label;
  
    const updatedSections = content.section.map(section => {
      if (section.SectionName === "Assets Information") {
        if (!Array.isArray(section.Subsection)) {
          section.Subsection = [];
        }
  
        section.Subsection = section.Subsection.map(subsection => {
          let shouldBeVisible = true;
  
          if (assetTypeLabel === "Laptop" || assetTypeLabel === "Desktop") {
            if (subsection.name === "printerConfig" || subsection.name === "otherConfig") {
              shouldBeVisible = false;
            }
          } else if (assetTypeLabel === "Printer") {
            if (subsection.name === "assetConfigLaptop" || subsection.name === "otherConfig") {
              shouldBeVisible = false;
            }
          } else if (assetTypeLabel === "Others") {
            if (subsection.name === "printerConfig" || subsection.name === "assetConfigLaptop") {
              shouldBeVisible = false;
            }
          } else if (assetTypeLabel !== "Laptop" && assetTypeLabel !== "Desktop" && assetTypeLabel !== "Printer" && assetTypeLabel !== "Others") {
            if (subsection.name === "assetConfigLaptop" || subsection.name === "printerConfig" || subsection.name === "otherConfig") {
              shouldBeVisible = false;
            }
          }
  
          // Set the attribute based on visibility
          return {
            ...subsection,
            isFieldVisiblef: shouldBeVisible
          };
        });
      }
      return section;
    });
  
    return {
      ...content,
      section: updatedSections
    };
  };
  

  const filterSectionsWarrantyType = (content, warrantyInfo) => {
    if (!content || !Array.isArray(content.section)) {
      return content;
    }

    const updatedSections = content.section.map(section => {
      if (section.SectionName === "Warranty Information") {
        if (!Array.isArray(section.Subsection)) {
          section.Subsection = [];
        }

        section.Subsection = section.Subsection.map(subsection => {
            let shouldBeVisible = true;

            if (warrantyInfo === false) {
                if (subsection.name === "extendedWarrantyInfo") {
                    shouldBeVisible = false;
                }
            } else if (warrantyInfo === true) {
                if (subsection.name === "extendedWarrantyInfo") {
                    shouldBeVisible = true;
                }
            }


            // Set the attribute based on visibility
            return {
                ...subsection,
                isFieldVisiblef: shouldBeVisible
            };
        });
      }
      return section;
    });

    return {
      ...content,
      section: updatedSections
    };
  };

  const handleChangeValue = (fieldName, value) => {
    setContent(prevContent => {
      const updatedContent = JSON.parse(JSON.stringify(prevContent)); // Create a deep copy of the original content

      for (let i = 0; i < updatedContent.section.length; i++) {
        const section = updatedContent.section[i];

        for (let j = 0; j < section.Subsection.length; j++) {
          const subsection = section.Subsection[j];

          for (let k = 0; k < subsection.fields.length; k++) {
            const field = subsection.fields[k];

            if (field.name === 'typeOfAsset') {
              const type = value?.label;
              if (type !== undefined && type !== currentType) {
                setCurrentType(type);
                const filteredContent = filterSectionsBasedOnAssetType(updatedContent, type);
                return filteredContent;
              }
            }
            if (field.name === 'additionalWarranty') {
              const warrantyInfo = value;
              const filteredContent = filterSectionsWarrantyType(updatedContent, warrantyInfo);
              return filteredContent;
            }
            if (field.name === fieldName) {
              updatedContent.section[i].Subsection[j].fields[k].value = value;
              break;
            }
          }
        }
      }
      return updatedContent;
    });
  };

  const handleChangess = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < content.section.length) {
      setActiveTab(content.section[nextIndex].SectionName);
    }
  };

  const submitformdata = () => {
    const newArray = convertToArray(sourceArray);
    getsubmitformdata(newArray);
  };

  const submitformdataPreview = () => {
    const newArray = convertToArray(sourceArray);
    getsubmitformdatapreview(newArray);
  };

  const handlesubmitbyDocumment = (value) => {
    const newArray = convertToArray(sourceArray);
    const documentsIndex = newArray.section.findIndex(section => section.SectionName === "Documents");
    if (documentsIndex !== -1) {
      handlesubmitApiData(newArray, value);
    }
  };

  const handleGetformvalueClick = (value) => {
    handleBTPformvalue(value);
  };

  const handleAssetsformvalueClick = (value, files) => {

    setFile(files)
    const filteredSections = content.section.filter(section => section.isVisible !== false);
    const currentIndex = filteredSections.findIndex(section => section.SectionName === activeTab);
    const nextIndex = filteredSections.findIndex((section, index) => index > currentIndex && section.isVisible !== false);
    if (nextIndex !== -1) {
      setActiveTab(filteredSections[nextIndex].SectionName);
    } else {
      const newArray = convertToArray(sourceArray);
      getsubmitformdatahitApi(newArray ,myFile);
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
          ) : null
        }

        <div className="tab-content" style={hasMultipleSections ? {} : { paddingTop: '0px' }}>
          {content.section.map((section, index) => (
            activeTab === section.SectionName && (
              <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>
                {pagename === "edit_allowcation" ? (
                  section.name === "ProjectDetails" && (
                    <div className="text-end w-100 mb-4">
                      <span className="allocation-edit-icon" onClick={converttoenable} data-tooltip-id="my-tooltip-tab" data-tooltip-content={"Edit Project"}>
                        <FaEdit />
                      </span>
                    </div>
                  )
                ) : null}
                {section.isDocumentstype ? (
                  sectionname === "PersonalInfo" ? (
                    <DocFrom fields={section} handleChangeValue={handleChangeValue} handlesubmitbyDocumment={handlesubmitbyDocumment} handleChangess={() => handleChangess(index)} actionid={actionid} />
                  ) : (
                    <DocFromcomman fields={section} handleChangeValue={handleChangeValue} handlesubmitbyDocumment={handlesubmitbyDocumment} handleChangess={() => handleChangess(index)} actionid={actionid} />
                  )
                ) : (
                  section.isPreviewtype ? (
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
					  handleExportClick={handleExportClick}
            loaderSubmitButton={loaderSubmitButton}
                    />
                  )
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
