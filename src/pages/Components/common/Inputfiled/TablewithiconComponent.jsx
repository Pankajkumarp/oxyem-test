import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import Profile from '../../commancomponents/profile';
import View from '../../Popup/TimeManMember';
import { IoPersonAddOutline } from "react-icons/io5";
import { axiosJWT } from '../../../Auth/AddAuthorization';
export default function TextwithiconComponent({ name, type, placeholder, label, value, validations = [], onChange, projectid, projectStauts  }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [userdetails, setuserdetails] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await axiosJWT.get(`${apiUrl}/project/getResource`, { params: { "idProject": projectid } })
        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          userName: item.employeeName,
          id: item.idEmployee,
          imageUrl: item.profilePicPath ? item.profilePicPath : '',
          designation: item.designation ? item.designation : '',
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

  const [selectuserdetail, setselectuserdetail] = useState();
  const submitvaluerec = (value) => {


    // Extract idEmployee from the new value format
    const employeeIds = value.map(item => item.idEmployee);

    // Find matching users using the extracted ids and merge the taskPercentage
    const matchedUsers = employeeIds.map(id => {
      const user = userdetails.find(user => user.id === id);
      if (user) {
        const taskPercentage = value.find(item => item.idEmployee === id).taskPercentage;
        return {
          ...user,
          idEmployee: id,
          taskPercentage: taskPercentage
        };
      }
      return undefined;
    }).filter(user => user !== undefined); // Filter out undefined values

    setselectuser(matchedUsers);

    // Pass the extracted ids to the onChange callback
    onChange(value);

    // Optionally, close the modal if needed
    setIsModalOpeninput(false);
  };

  useEffect(() => {
    if(value){
    submitvaluerec(value);
    }
  }, [userdetails]);

  const submitdeleteval = (value) => {

    // Filter out the elements with ids in the value array
    const updatedUserdetails = selectuser.filter(user => !value.includes(user.id));
    setselectuser(updatedUserdetails)
    setIsModalOpeninput(false);
    const transformedUserDetails = updatedUserdetails.map(user => ({
      idEmployee: user.idEmployee,
      taskPercentage: user.taskPercentage
    }));
    onChange(transformedUserDetails)
  };
  const getsubmitonchangeformdata = (value) => {
    onChange([value])
    setIsModalOpeninput(false);
  };
  return (
    <>
      <View isOpen={isModalOpeninput} labelText={label} closeModal={closeModalInputselect} userdata={userdetails} submitvaluerec={submitvaluerec} selectuser={selectuser} submitdeleteval={submitdeleteval} value={value} dynamicform={"Team_allocation"} getsubmitonchangeformdata={getsubmitonchangeformdata} />
      <div className="oxyem-project-members">
        <ul className="oxyem-team-members">
          {selectuser.slice(0, 4).map((detail, index) => (
            <li> <Profile name={detail.userName} imageurl={detail.imageUrl} size={"30"} profilelink={detail.profilelink} /></li>
          ))}
          {selectuser.length > 4 && (
            <li className='countaddicon'> +{userCount - 4}</li>
          )}
          {projectStauts === "open" ? (
          <span className='addicon' onClick={enterfields}><IoPersonAddOutline /></span>
          ):(
          <span className='addicon addicon_disable' ><IoPersonAddOutline /></span>
          )}
        </ul>
      </div>
    </>
  );
}
