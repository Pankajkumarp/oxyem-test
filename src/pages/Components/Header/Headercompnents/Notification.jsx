import { useContext, useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import Link from 'next/link';
import Notificationtext from '../../commancomponents/Notificationtext';

import { axiosJWT } from '../../../Auth/AddAuthorization';
import {SocketContext} from '../../../Auth/Socket';
const NotificationDropdown = () => {

  const socket = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [count, setCount] = useState(0);

  const handlenotify = async () => {
    
		axiosJWT.get(`${apiUrl}/taskbar/getAllNotifications` , { params: { "isfor": "notify" } })
			.then((response) => {
				setNotifications(response.data.data);
				setIsLoading(false)
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}

  useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosJWT.get(`${apiUrl}/taskbar/getAllNotifications`, {
					params: {
						'isfor': "count",
					}
				});
        const count = response.data.data[0].count;
				setCount(count);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
if(!count){
		fetchData();
}
	}, [apiUrl]);

  useEffect(() => {
		socket.on("msg-recieve", (msg) => {
			setBelcolor("#004D95")
			setCount(count => count + 1); // Increment the count
			toast.success(msg, toastOptions);
			setNotifications((prevNotifications) => [...prevNotifications, { title: "New Message", body: msg, time: new Date().toLocaleString() }]);
		});
	}, [socket]);



  return (
    <ul className="nav oxyem-user-menu">

      <li className="nav-item dropdown noti-dropdown me-3">
        <Link href="" className="dropdown-toggle nav-link header-nav-list" data-bs-toggle="dropdown" data-tooltip-id="my-tooltip-n" data-tooltip-content={"Notification"} onClick={handlenotify} >
          <FaRegBell />
          {count > 0 && (
            <span className="position-absolute start-100 translate-middle badge rounded-pill">
              {count > 99 ? "99+" : count}
              <span className="visually-hidden">unread messages</span>
            </span>
          )}
        </Link>

        <div className="dropdown-menu notifications">
          <div className="topnav-dropdown-header">
            <span className="notification-title">Notifications</span>
            <span className="clear-noti" > Clear All </span>
          </div>
          <div className="noti-content">
            {notifications.slice(0, 3).map((notification,index) => (
              <Notificationtext key={index} id={notification.id} name={notification.name} imageUrl={notification.imageUrl} profilelink={notification.profilelink} toptext={""}
              maintext={
                `${notification.name ? notification.name : ""} 
                 ${notification.message ? notification.message : ""} 
                 ${notification.dateRange ? notification.dateRange : ""}`
              }
               bottomtext={notification.createdtime} iconsize={"38"}/>
            ))}
          </div>
          <div className="topnav-dropdown-footer">
            <Link href="">View all Notifications</Link>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default NotificationDropdown;
