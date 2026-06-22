import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUsers } from "react-icons/fa";
import { BiSolidDoorOpen } from "react-icons/bi";
import { MdCoPresent } from "react-icons/md";
import { AiTwotoneProject } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function Mobilenavbar() {
	const router = useRouter();
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
