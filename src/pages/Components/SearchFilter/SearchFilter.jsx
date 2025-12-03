import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import SecTab from '../Employee/SecTab';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineClear } from "react-icons/md";

export default function SearchFilter({searchFilterData ,formType = ''}) {
  const [formData, setFormData] = useState(null);
  const [showSecTab, setShowSecTab] = useState(false); // toggle state

  const fetchForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, {
        params: { "formType": formType },
      });

      if (response.status === 200 && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [formType]);

  const handleFilterClick = () => {
    setShowSecTab(prev => !prev); // toggle section on click
  };

  const handleCloseFilterClick = () => {
    setShowSecTab(false); // close section on click
    // searchFilterData({}); // toggle section on click
  };


  const getsubmitformdata = (val) => {
    const transformedData = {};
  
    val?.section?.forEach(section => {
      section.fields.forEach(field => {
        if (field.name && field.attributeValue !== undefined) {
          transformedData[field.name] = field.attributeValue;
        }
      });
    });
    searchFilterData(transformedData);
  };
  
  const cancelClickAction = (val) => {
  }
  

  return (
    <div>
      <div className='search-filter-for-table-icon text-end'>
      {!showSecTab ? (
        <span 
          data-tooltip-id="my-tooltip-datatable" 
          data-tooltip-html={'Search Filter'} 
          onClick={handleFilterClick} 
          style={{ cursor: 'pointer' }}
        ><IoSearchSharp size={25} />
        </span>
        ):
        <span 
          data-tooltip-id="my-tooltip-datatable" 
          data-tooltip-html={'Close Filter'} 
          onClick={handleCloseFilterClick} 
          style={{ cursor: 'pointer' }}
        ><MdOutlineClear size={25} />
        </span>
        }
      </div>

      {showSecTab && (
        <SecTab AdduserContent={formData}  getsubmitformdata={getsubmitformdata} cancelClickAction={cancelClickAction}/>
      )}

      <Tooltip 
        id="my-tooltip-datatable" 
        style={{ zIndex: 99999, maxWidth: '300px' }} 
        clickable 
      />
    </div>
  );
}


            