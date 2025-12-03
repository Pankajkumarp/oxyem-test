import Link from 'next/link';
import React, { useState, useEffect, useRef } from "react";
import Cookies from 'js-cookie';

import Profile from '../../../commancomponents/profile';
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io"
import { useRouter } from 'next/router'
import { axiosJWT } from '../../../../Auth/AddAuthorization';
import { FaRegUser, FaTasks } from "react-icons/fa";
import CryptoJS from 'crypto-js';
import { useMsal } from "@azure/msal-react";
function Profiledetail({  }) {

const router = useRouter();
const [profileData, setProfileData] = useState('');
useEffect(() => {
  const fetchProfileOptions = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/employees/getLoggedInEmployee`)
      if (response) {
        setProfileData(response.data.data)
		const secretKey = process.env.NEXT_PUBLIC_ENCRYPT_DECRYPTING;
          const encryptedEmployeeName = CryptoJS.AES.encrypt(response.data.data.employeeName, secretKey).toString();
          sessionStorage.setItem('empN', encryptedEmployeeName);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };
   if(!profileData){
  fetchProfileOptions()
   }

}, []);


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };
  const inputRef = useRef();
    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleClickOutside = (e) => {

        if (inputRef.current && !inputRef.current.contains(e.target)) {

          setIsDropdownOpen(false);
        }

    };
	const { instance } = useMsal();
	  const Logout = async () => {
		  if(profileData.loginType === "MSSTS"){
      Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('isViewAll');
    // Optional: Clear all MSAL accounts
    instance.setActiveAccount(null);
    // 🔁 Redirect after logout
    await instance.logoutRedirect({
      postLogoutRedirectUri: "/login",
    });

    }else{
    // Remove cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('isViewAll');
  
    // Define the number of redirects and the delay
    const numberOfRedirects = 9;
    const delay = 200;
  
    // Create a function to simulate setTimeout using Promises
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    // Use a loop with async/await to push to the "/Log-in" route
    for (let i = 0; i < numberOfRedirects; i++) {
      await wait(i * delay);
      router.push("/login");
    }
	}
  };
    function truncateName(name) {
    if (name && name.length > 16) {
      return name.substring(0, 16) + '..';
    }
    return name || ''; // Return an empty string if name is undefined or null
  }
  return (
      <ul className="nav oxyem-profile-menu" ref={inputRef}>
        <li className="nav-item dropdown noti-dropdown ">
          <span  onClick={toggleDropdown} className="dropdown-toggle  nav-link header-nav-list oxyem-profile-link-head" data-bs-toggle="dropdown" data-tooltip-id="my-tooltip-n" data-tooltip-content={"Notification"}>
            <Profile name={profileData.employeeName} imageurl={profileData.profilePicPath} size={"30"}  />
    
          </span>

          <div className="dropdown-menu notifications" >

            <Link className="oxyem-profile-dropdown-link oxyem-border-bottom" href={"/employeeDashboard"}><FaRegUser /> My Profile</Link>
            <Link className="oxyem-profile-dropdown-link oxyem-border-bottom" href={"/Taskbar"}><FaTasks /> Taskbar</Link>
            <span className="oxyem-profile-dropdown-link" onClick={Logout}><FiLogOut /> Logout</span>
          </div>

        </li>
      </ul>
  )
}

export default Profiledetail
