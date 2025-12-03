import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TbGridDots } from "react-icons/tb";
import { axiosJWT } from '../../../Auth/AddAuthorization';
export default function Combinemenu() {
  const router = useRouter();
  const [showDiv, setShowDiv] = useState(false);
  const toggleDiv = () => {
    setShowDiv(!showDiv);
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

      setShowDiv(false);
    }

  };
  const handleClickLinkside = (id, e) => {
    sessionStorage.setItem('Clickid', JSON.stringify(id));
    setShowDiv(false);
  };

  const [preiconData, seticonPreData] = useState([
    {
      "id": "3bfd9900-ebe2-4ca5-926a-e73107b2fe11",
      "menuName": "Dashboard",
      "slug": "/employeeDashboard",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/dashboard.png"
    },
    {
      "id": "820646ea-6079-4b07-a512-8d4771b3ffe9",
      "menuName": "Leave",
      "slug": "/leave",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/leave.png"
    },
    {
      "id": "0c2c8e7e-4573-4ec5-80cc-4849692b2aae",
      "menuName": "Attendance",
      "slug": "/attendance",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/attendance.png"
    },
    {
      "id": "1756ff0b-b0dc-401d-a5a6-967d6f9e3103",
      "menuName": "Shift Management",
      "slug": "/admin/add-shift",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/shift-management.png"
    },
    {
      "id": "ae48b97a-b243-4609-9deb-4edd6471f90b",
      "menuName": "Claim Management",
      "slug": "/admin/claim",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/claim.png"
    },
    {
      "id": "b9816f9e-d10f-4da5-98e4-d66bcbcaf761",
      "menuName": "Holiday",
      "slug": "/holiday",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/holidays.png"
    },
    {
      "id": "e2f89352-6c8a-4537-b319-230f34c84e3c",
      "menuName": "Policy Management",
      "slug": "/policy-management",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/policy_mangment.png"
    },
    {
      "id": "e5a1e74f-6407-4479-8a0e-de82013039be",
      "menuName": "Rewards Management",
      "slug": "/reward-dashboard",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/medal.png"
    },
    {
      "id": "789a234a-dc99-43d8-9177-d96a96bdcdef",
      "menuName": "Reports",
      "slug": "/reports",
      "children": "",
      "menuImage": "https://oxytal.s3.eu-west-1.amazonaws.com/Menu/report.png"
    }
  ]);
  const [iconData, seticonData] = useState(preiconData);
  useEffect(() => {
    const fetchMenuOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/getMenuItem`, { params: { "isFor": "main" } })
        if (response) {

          const optionsData = response.data.data.map((item) => ({ // Access response.data.data
            id: item.id ? item.id :"",
            menuName: item.menuName ? item.menuName: "",
            slug: item.slug ? item.slug: "",
            children: item.children ? item.children: "",
            menuImage: item.menuImage ? item.menuImage : ""
          }));
          seticonData(optionsData)
          sessionStorage.setItem('MenuData', JSON.stringify(optionsData));
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    const storedIconData = sessionStorage.getItem('MenuData');
    const parsedData = JSON.parse(storedIconData);
    if (storedIconData === null) {
      fetchMenuOptions()
    }else{
      seticonData(parsedData)
      if (parsedData.length === 0) {
        fetchMenuOptions()
        seticonData(preiconData);
      }
    }

  }, []);

  const iconElements = iconData.map((icon, index) => (
    <Link key={index} href={icon.slug} className='inner-icon-box' onClick={(e) => handleClickLinkside(icon.id, e)}>
      <img src={icon.menuImage} alt={icon.menuName} />
      <span>{icon.menuName}</span>
    </Link>
  ));
  return (
    <div className='oxyem-navbar-combine' ref={inputRef}>
      <span className='oxyem-comb-ic' onClick={toggleDiv}><TbGridDots /></span>


      {showDiv &&
        <div className='oxyem-combine-icons'>
          <div className='oxyem-header-combine-icons'>
            {iconElements}
          </div>
        </div>
      }
    </div>
  )
}
