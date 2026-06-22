import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import Profile from '../../commancomponents/profile';
import View from '../../Popup/selectuserAllocate';
import { IoPersonAddOutline } from "react-icons/io5";
import { axiosJWT } from '../../../Auth/AddAuthorization';
export default function AllocateEmployeComponent({ name, label, value, validations = [], onChange, projectStartDate, projectEndDate }) {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setselectuser([]);
      return;
    }

    // CASE 1: value already full objects (from modal)
    if (value.length && typeof value[0] === "object") {
      setselectuser(value);
      return;
    }

    // CASE 2: value is ID array (from API)
    if (userdetails.length) {
      const selected = value
        .map(id => userdetails.find(u => u.id === id))
        .filter(Boolean);

      setselectuser(selected);
    }
  }, [value, userdetails]);

  const enterfields = () => {
    setIsModalOpeninput(true);
  };
  const closeModalInputselect = () => {
    setIsModalOpeninput(false);
  };
  const submitvaluerec = (value) => {
    setselectuser(value);   // full objects
    onChange(value);        // full objects
    setIsModalOpeninput(false);
  };



  return (
    <>
      <View isOpen={isModalOpeninput} labelText={label} closeModal={closeModalInputselect} userdata={userdetails} submitvaluerec={submitvaluerec} selectuser={selectuser} value={value} projectStartDate={projectStartDate} projectEndDate={projectEndDate} />
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <div className='row align-items-center'>
        <div className='col-md-12'>
          <div className="oxyem-project-members">
            <ul className="oxyem-team-members">
              {selectuser.slice(0, 4).map((detail) => (
                <li key={detail.id}>
                  <Profile
                    name={detail.userName}
                    imageurl={detail.imageUrl}
                    size="30"
                  />
                </li>
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
