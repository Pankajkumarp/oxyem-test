import React, { useState, useEffect, createContext, useContext } from 'react';
import Navbar from '../Header/Navbar.jsx';
import Mobilenavbar from '../Header/Mobilenavbar.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
// import Skolrupfooter from '../Footer/Skolrupfooter.jsx';
import { SocketContext, socket } from '../../Auth/Socket.jsx';
import { InputContext } from '../Header/Headercompnents/InputContext';
// import Policyview from '../Popup/Policyview.jsx';
import { useRouter } from 'next/router';
import TicketIcon from '../TicketIcon/TicketIcon.jsx';
export default function Layout({ children }) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [globalSearch, setglobalSearch] = useState('');
  const handleChange = (value) => {
    setglobalSearch(value);
  };

  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    // Check if the route is '/dashboard' or specific pages
    if (router.pathname === '/Dashboard' || router.pathname === '/me') {
      document.body.classList.add('dashboard-page');
    } else {
      document.body.classList.remove('dashboard-page');
    }

    // Check the screen size and update the state
    const checkScreenSize = () => {
      if (window.innerWidth > 575) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up by removing the class and event listener when the component unmounts or route changes
    return () => {
      document.body.classList.remove('dashboard-page');
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [router.pathname]);
  return (
    <SocketContext.Provider value={socket}>
    <InputContext.Provider value={{ globalSearch, handleChange }}>
      {router.pathname !== '/Ckeditor' && <Navbar />}
      {router.pathname !== '/Ckeditor' && <Mobilenavbar />}
      {showSidebar && (
        <div className='oxyem_dasktop_sidebar'>
          {router.pathname !== '/Chat' && router.pathname !== '/Dashboard' && router.pathname !== '/me' && <Sidebar />}
        </div>
      )}
      <main>{children}</main>
      <TicketIcon />
      <footer className="Footer_footer_oxyem_fixed"><p className="w-100 mb-1 text_footer_b">Copyright © {currentYear} <span>O</span>xyem. All Rights Reserved</p></footer>

      {/* {router.pathname !== '/Ckeditor' && router.pathname !== '/Search-jobs' && <Skolrupfooter /> } */}
      {/* {router.pathname !== '/Ckeditor' && router.pathname !== '/Search-jobs' && <Policyview /> } */}
    </InputContext.Provider>
     </SocketContext.Provider>
  )
}
