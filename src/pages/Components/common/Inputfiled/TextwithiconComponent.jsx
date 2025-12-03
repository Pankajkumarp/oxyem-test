import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import Profile from '../../commancomponents/profile';
import View from '../../Popup/selectuser';
import { IoPersonAddOutline } from "react-icons/io5";
import { axiosJWT } from '../../../Auth/AddAuthorization';
export default function TextwithiconComponent({ name, type, placeholder, label, value, validations = [], onChange }) {
  const isRequired = validations.some(validation => validation.type === "required");
  
  const [userdetails, setuserdetails] = useState([]);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
       
        const response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": name === "projectManager" ? "projectManager" : "" } }) 
        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          userName: item.employeeName,
          id: item.idEmployee,
          imageUrl: item.imageUrl ? item.imageUrl :'',
          designation: item.designation ? item.designation :'',
        }));
        setuserdetails(optionsData)
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, [name]);




  const userCount = userdetails.length;
  const [selectuser, setselectuser] = useState([]);
  const [isModalOpeninput, setIsModalOpeninput] = useState(false);




    useEffect(() => {
        if (!Array.isArray(value)) {
          setselectuser([]);
            return;
        }
        const selectedOptions = value.map(val => userdetails.find(option => option.id === val)).filter(Boolean);

    setselectuser(selectedOptions)
    }, []);

  const enterfields = () => {
    setIsModalOpeninput(true);
  };
  const closeModalInputselect = () => {
    setIsModalOpeninput(false);
  };
  const submitvaluerec = (value) => {
    const matchedUsers = value.map(val => {
      return userdetails.find(user => user.id === val.value);
    }).filter(user => user !== undefined); // Filter out undefined values
    setselectuser(matchedUsers);
    const outputArray = value.map(item => item.value);
    onChange(outputArray)
    setIsModalOpeninput(false);
  };

  const submitdeleteval = (value) => {
    // Filter out the elements with ids in the value array
    const updatedUserdetails = selectuser.filter(user => !value.includes(user.id));
    setselectuser(updatedUserdetails)
    setIsModalOpeninput(false);
    onChange(value)
  };
  return (
    <>
      <View isOpen={isModalOpeninput} labelText={label} closeModal={closeModalInputselect} userdata={userdetails} submitvaluerec={submitvaluerec} selectuser={selectuser} submitdeleteval={submitdeleteval} value={value}/>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <div className='row align-items-center'>
        <div className='col-md-12'>
          <div className="oxyem-project-members">
            <ul className="oxyem-team-members">
              {selectuser.slice(0, 4).map((detail, index) => (
                <li> <Profile name={detail.userName} imageurl={detail.imageUrl} size={"30"} profilelink={detail.profilelink} /></li>
              ))}
              {selectuser.length > 4 && (
                <li className='countaddicon'> +{userCount - 4}</li>
              )}
              <span className='addicon' onClick={enterfields}><IoPersonAddOutline /></span>
            </ul>
          </div>
        </div> 
      </div>
    </>
  );
}
