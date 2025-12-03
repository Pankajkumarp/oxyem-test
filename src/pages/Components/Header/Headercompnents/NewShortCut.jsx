import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { axiosJWT } from '../../../Auth/AddAuthorization';

const NewShortCut = () => {
  const [iconData, seticonData] = useState([]);
  const fetchMenuOptions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/basicMenuList`)
      if (response) {

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data

          menuName: item.menuName ? item.menuName : "",
          slug: item.slug ? item.slug : "",

        }));
        seticonData(optionsData)

      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  }


  return (
    <ul className="nav oxyem-user-menu" id='shortcut-navbar'>
      <li className="nav-item dropdown noti-dropdown me-3">
        <p className='dropdown-toggle nav-link header-nav-list' data-bs-toggle="dropdown" data-tooltip-id="my-tooltip-n" data-tooltip-content={"QuickLinks"} onClick={fetchMenuOptions}><FaPlus /></p>
        <div className="dropdown-menu notifications custom_padding_wid_noti">
          <div className="topnav-dropdown-header">
            <span>Quick Links</span>
          </div>
          <div className="noti-content ">
            {iconData.length > 0 ? (
              iconData.map((item, index) => (
                <Link
                  key={index}
                  href={`/${item.slug}`}
                  className="dropdown-item widget_noti widget_noti_"
                >
                  {item.menuName}
                </Link>
              ))
            ) : (
              <div className="text-center p-2">No links available</div>
            )}
          </div>
        </div>
      </li>
    </ul>
  );
};

export default NewShortCut;
