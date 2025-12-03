import React, { useState, useEffect } from 'react';
import DocFrom from './DocumentComponent';
import DocFromcomman from './DocumentComponentcomman';
import PreviewComponent from './PreviewComponent';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const DynamicForm = dynamic(() => import('../CommanForm.jsx'), { ssr: false });

export default function EmployeeSection({ AdduserContent, headingContent, submitformdata, getleavedetail, getleaveoption, getsubmitformdatapreview, handeldocfiles ,loaderSubmitButton }) {
  const apiUrl = "";
  const [content, setContent] = useState(AdduserContent);
  const [activeTab, setActiveTab] = useState(AdduserContent.section[0].SectionName);
  const hasMultipleSections = Array.isArray(content.section) && content.section.length > 1;
  const [myfiles, setMyfiles] = useState('');
  const [documents, setDocuments] = useState([{ type: '', files: [] }]);
  const [errors, setErrors] = useState([]);
  const [experience, setExperience] = useState(true); // Default experience state
const [currentStep, setCurrentStep] = useState(0); // 0 means first tab
const router = useRouter();
const isUserPage = router.pathname.includes('/user');

  // Static variable to store "Prior Work Experience" section
  const staticWorkExperienceSection = AdduserContent.section.find(section => section.name === 'WorkExperience');

  const sectionname = AdduserContent.section[0].name;

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

    sourceArray.section.forEach(section => {
      const newSection = {
        SectionName: section.SectionName.replace(/\s/g, ''),
        fields: []
      };

      section.Subsection.forEach(subsection => {
        subsection.fields.forEach(field => {
          let attributeValue = field.value;

          if (typeof field.value === 'object' && 'value' in field.value) {
            attributeValue = field.value.label;
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
    const newArray = convertToArray(sourceArray);
    setContent(AdduserContent);
  }, [AdduserContent]);

  

  const handleChangeValue = async (fieldName, value) => {
    const updatedArray = JSON.parse(JSON.stringify(content));
  
    for (let i = 0; i < updatedArray.section.length; i++) {
      const section = updatedArray.section[i];
  
      for (let j = 0; j < section.Subsection.length; j++) {
        const subsection = section.Subsection[j];
  
        for (let k = 0; k < subsection.fields.length; k++) {
          const field = subsection.fields[k];
  
          if (field.name === fieldName) {
            updatedArray.section[i].Subsection[j].fields[k].value = value;

            if (fieldName === 'experience') {
              setExperience(value); // Update the experience state
            }

            break;
          }
        }
      }
    }
  
    setContent(updatedArray);
  };
  

  const handleChangess = (currentIndex) => {
  const filteredSections = experience
    ? content.section
    : content.section.filter(section => section.name !== 'WorkExperience');

  const nextIndex = filteredSections.findIndex((section, index) => index > currentIndex && section.isVisible);

  if (nextIndex !== -1) {
    setActiveTab(filteredSections[nextIndex].SectionName);
    setCurrentStep(nextIndex); // ✅ Allow next tab
  }
};

  const submitformdataPreview = () => {
    const newArray = convertToArray(sourceArray);
    getsubmitformdatapreview(newArray, myfiles);
  };

  const handlesubmitbyDocumment = (value) => {
    setMyfiles(value);
  };

  // Filter sections based on experience
  const filteredSections = experience
    ? content.section
    : content.section.filter(section => section.name !== 'WorkExperience');

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
  {hasMultipleSections && (
  <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
    {filteredSections.map((section, index) =>
      section.isVisible && (
        <li key={index} className="nav-item">
          <a
            className={`nav-link ${activeTab === section.SectionName ? 'active' : ''} ${isUserPage && index > currentStep ? 'disabled' : ''}`}
            onClick={() => {
              if (!isUserPage || index <= currentStep) {
                handleTabClick(section.SectionName);
              }
            }}
            style={{
              pointerEvents: isUserPage && index > currentStep ? 'none' : 'auto',
              opacity: isUserPage && index > currentStep ? 0.5 : 1,
            }}
          >
            <div className="skolrup-profile-tab-link">{section.SectionName}</div>
          </a>
        </li>
      )
    )}
  </ul>
)}

        <div className="tab-content" style={hasMultipleSections ? {} : { paddingTop: '0px' }}>
          {filteredSections.map((section, index) => (
            activeTab === section.SectionName && (
              <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>
                {section.isDocumentstype ? (
                  <>
                    {sectionname === "PersonalInfo" ? (
                      <DocFrom
                        fields={section}
                        handleChangess={() => handleChangess(index)}
                        handlesubmitbyDocumment={handlesubmitbyDocumment}
                        documents={documents}
                        setDocuments={setDocuments}
                        errors={errors}
                        setErrors={setErrors}
                        experience={experience}
                      />
                    ) : (
                      <DocFromcomman
                        fields={section}
                        handleChangess={() => handleChangess(index)}
                        handlesubmitbyDocumment={handlesubmitbyDocumment}
                        documents={documents}
                        setDocuments={setDocuments}
                        errors={errors}
                        setErrors={setErrors}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {section.isPreviewtype ? (
                      <PreviewComponent
                        data={content}
                        submitformdata={submitformdataPreview}
                        setDocuments={documents}
                        loaderSubmitButton={loaderSubmitButton}
                      />
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
                      />
                    )}
                  </>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
