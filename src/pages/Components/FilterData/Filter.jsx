import React from 'react'
import SecTab from '../Employee/SecTab';
export default function Filter({ userFormdata }) {
    console.log("Documents section api333:", userFormdata);
    const headingContent = '';
    
    const AdduserContent = {
        "section": [
            {
                "SectionName": "Project Management",
                "Subsection": [
                    {
                        "SubsectionName ": "Filter",
                        "fields": [
                            {
                                "col": "4",
                                "label": "Project Name",
                                "name": "projectName",
                                "placeholder": "Enter Project Name",
                                "type": "Text",
                                "validations": [
                                    {
                                        "message": "Project Name is required",
                                        "type": "required"
                                    }
                                ],
                                "value": ""
                            },
                            {
                                "col": "4",
                                "label": "Client",
                                "name": "clientName",
                                "placeholder": "Client Name",
                                "type": "Role",
                                "validations": [
                                    {
                                        "message": "Client Name is required",
                                        "type": "required"
                                    }
                                ],
                                "value": ""
                            },
                            {
                                "col": "4",
                                "label": "Start Date",
                                "name": "startDate",
                                "placeholder": "Start Date",
                                "type": "Date",
                                "validations": [
                                    {
                                        "message": "Start Date is required",
                                        "type": "required"
                                    }
                                ],
                                "value": ""
                            },
                            {
                                "col": "4",
                                "label": "End Date",
                                "name": "endDate",
                                "placeholder": "End Date",
                                "type": "Date",
                                "validations": [
                                    {
                                        "message": "End Date is required",
                                        "type": "required"
                                    }
                                ],
                                "value": ""
                            },
                            {
                                "col": "4",
                                "label": "Project Name",
                                "name": "projectName",
                                "placeholder": "Enter Project Name",
                                "type": "Text",
                                "validations": [
                                    {
                                        "message": "Project Name is required",
                                        "type": "required"
                                    }
                                ],
                                "value": ""
                            },
                        ],
                        "isVisible": true,
                        "name": "ProjectManagement",
                        "sectionHeading": "Project Management"
                    }
                ],
                "buttons": [
                    
                ],
                "isVisible": true,
                "name": "ProjectManagement"
            }
        ]
    }
    const handlesubmitApiData = async (value) => {
        console.log("Documents section api:", value);
        
      };
  return (
    <div className='row'>
        <SecTab AdduserContent={AdduserContent} headingContent={headingContent} handlesubmitApiData={handlesubmitApiData}/>
    </div>
  )
}

