import Link from 'next/link';
import { useState } from "react";
// import Modal from '../Popup/Createpost.jsx';
import { SlHome } from "react-icons/sl";
import { FaUserFriends, FaDesktop } from "react-icons/fa";
import { LiaPlusCircleSolid } from "react-icons/lia";
import { MdOutlineDashboardCustomize, MdGroupAdd } from "react-icons/md";
import { FaGroupArrowsRotate } from "react-icons/fa6";
import { useRouter } from 'next/router';
import { FaBookOpen } from "react-icons/fa";
import { TbDeviceIpadHorizontalSearch } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { BiSolidDoorOpen } from "react-icons/bi";
import { MdCoPresent } from "react-icons/md";
import { AiTwotoneProject } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function Mobilenavbar() {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleClick = () => {
        setIsModalOpen(true);
    };
  return (
    <div>
        <nav className="oxyem-mobile-bottom-nav">
		
        <div className="oxyem-mobile-nav">
          <Link href="/admin/user-list" className={`oxyem-nav-link ${router.pathname === '/admin/user-list' ? 'active' : ''}`}> 
            <FaUsers />
            User List
          </Link>
        </div>
		<div className="oxyem-mobile-nav">
          <Link href="/leave" className={`oxyem-nav-link ${router.pathname === '/leave' ? 'active' : ''}`}>
            <BiSolidDoorOpen />
             Leave
          </Link>
        </div>
		
		<div className="oxyem-mobile-nav">
          <Link href="/attendance" className={`oxyem-nav-link ${router.pathname === '/attendance' ? 'active' : ''}`}>
            <MdCoPresent />
            Attendance
          </Link>
        </div>
     <div className="oxyem-mobile-nav">
          <Link href="/Project-dashboard" className={`oxyem-nav-link ${router.pathname === '/Project-dashboard' ? 'active' : ''}`}>
            <AiTwotoneProject />
            Project
          </Link>
        </div>
     <div className="oxyem-mobile-nav">
          <Link href="/timesheet/adminDashboard" className={`oxyem-nav-link ${router.pathname === '/timesheet/adminDashboard' ? 'active' : ''}`}>
            <FaRegCalendarAlt />
            Timesheet
          </Link>
        </div>
		
        
		      
      </nav>
    </div>
  )
}
