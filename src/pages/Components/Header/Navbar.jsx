import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Logo from './Headercompnents/Logo.jsx';
import Headersearchbar from './Headercompnents/Headersearchbar.jsx';
import Mobileprofiledetail from './Headercompnents/Profile/Mobileprofiledetail.jsx';
import Profiledetail from './Headercompnents/Profile/Profiledetail.jsx';
import Menutoggle from './Headercompnents/Menutoggle.jsx';
import Notification from './Headercompnents/Notification.jsx';
import Combinemenu from './Headercompnents/combinemenu.jsx';
import { useRouter } from 'next/router';
import CheckinCheckout from '../Attendance/CheckinCheckout.jsx';
import { FaRegSmile, FaTasks, FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import Sidebar from '../Sidebar/Sidebar.jsx';
import {SocketContext } from '../../Auth/Socket.jsx';
import { Toaster, toast } from 'react-hot-toast';
import Profile from '../commancomponents/profile.jsx';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { BiSolidLike } from "react-icons/bi";
import NewShortCut from "./Headercompnents/NewShortCut.jsx";
const formatTimeAgo = (time) => {
  const seconds = Math.floor((new Date() - time) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  return `${Math.floor(seconds / 3600)} hrs ago`;
};
export default function Navbar() {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [timeUpdated, setTimeUpdated] = useState(new Date());
  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 575);
    };

    // Initialize the state based on the current window size
    handleResize();

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setShowMobileNav(false);
  }, [router.pathname]);

  const socket = useContext(SocketContext);
  
  useEffect(() => {
    const handleCertificateAdded = async (msg) => {
      if (msg && typeof msg === "object" && msg.text && msg.idDepartment) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/employees/getLoggedInEmployee`);
          const loggedInUser = response.data.data;
  
          if (loggedInUser?.idDepartment === msg.idDepartment) {
            const notificationTime = new Date();
            setTimeUpdated(notificationTime)
            const id =  loggedInUser?.idDepartment;
            toast.success(({id}) => (
              <>
              <BiSolidLike className='like-svg' size={20}/>
              <div className='main-soket-box' style={{
                display: "flex",
                alignItems: "flex-start",
                borderRadius: "12px",
                maxWidth: "350px",
                borderRadius: "5px",
              }}>
                
                {/* Profile Image */}
                <Profile
                  name={loggedInUser.employeeName}
                  imageurl={loggedInUser.profilePicPath || ""}
                  size={"45"}
                  profilelink={loggedInUser.profilePicPath || ""}
                  style={{ borderRadius: "50%", marginRight: "10px" }}
                />
                
                {/* Content */}
                
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: "5px 0px", color: "#333" }}>
                    {loggedInUser.employeeName}
                  </h2>
                  <p style={{ fontSize: "0.9em", margin: "12px 0px", color: "#555" }} dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                  <span style={{ fontSize: "12px", color: "#999" }}>{formatTimeAgo(notificationTime)}</span>
                </div>
  
                {/* Close Button */}
                <button 
                  onClick={() => toast.dismiss(id)} 
                  style={{
                    background: "none",
                    border: "none",
                    color: "#999",
                    fontSize: "16px",
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    cursor: "pointer"
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              
              </>
            ), {
              id: id,
              icon: null,
              duration: 3600000,
              className: 'main-soket-box-top',
            });
          }
        } catch (error) {
          // console.error("Error fetching logged-in user:", error);
        }
      } else {
        console.error("Invalid message format received:", msg);
      }
    };
  
    socket.on("certificateAdded", handleCertificateAdded);
  
    return () => {
      socket.off("certificateAdded", handleCertificateAdded);
    };
  }, [socket]);
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdated(new Date());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      
      {isMobileView ? (
        <div className="m-nav" id="header_mobile">
          <div className="header-log logo-mobile">
          <Logo />
          </div>
          <div className="mobile-menu-bar" onClick={toggleMobileNav}>
            <FaBars />
          </div>
          <div className="sk-input-icons-form">
            <Headersearchbar />
          </div>
          <div className='sk-iconss-img-noti'>
            <Notification />
          </div>
          <div className='sk-combine-menu-mobile'>
            <Combinemenu />
          </div>
          <div className='sk-iconss-img sk-iconss-img-prof'>
            <Mobileprofiledetail setShowDiv={setShowMobileNav} />
          </div>
          <div className={`oxyem_mobile_sidebar ${showMobileNav ? 'at_add_data' : 'at_remove_data'}`}>
            <Sidebar />
          </div>
        </div>
      ) : (
        <div className={`header ${router.pathname === "/reward-dashboard" || router.pathname ==="/rewards-management" || router.pathname ==="/rewards" || router.pathname.startsWith("/rewards-management/") ? "header-reward" : ""}`} id="header_desktop">
          <Logo />
          <Menutoggle />
          <CheckinCheckout />
          <div className='oxyem-navbar-search'>
            <Headersearchbar />
            <NewShortCut/>
            <div className="oxyem-navbar-task">
              <Link className="oxyem-comb-tsk" href={"/Taskbar"}><FaTasks /></Link>
            </div>
            <Notification />
            <Combinemenu />
            <Profiledetail />
          </div>
        </div>
      )}
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
    </div>
    
  );
}