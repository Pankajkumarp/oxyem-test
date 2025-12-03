import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaAngleRight } from "react-icons/fa";
import * as ReactIcons from "react-icons/fa"; // Import all icons from 'react-icons/fa' (you can change 'fa' to any other icon library like 'io' or 'bs')

export default function SidebarItem({ item }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const IconComponent = ReactIcons[item.icon]; // Dynamic selection of icon component

    const handleClick = (event) => {
        // Prevent the default link behavior
        event.preventDefault();
        // Add your custom logic here
      };

    if (item.childrens) {
        return (
            <div id={item.title} className={open ? "sidebar-item open" : "sidebar-item"}>
                <li id={item.title} className={`submenu main_head_text_menu ${router.pathname === item.path ? 'active' : ''}`}>
                    {/* <Link href={item.path !=="/" || "#"} className="" alt={item.title}>
                        {IconComponent && <IconComponent />} 
                        <span>{item.title}</span>
                    </Link> */}

{item.path !== "/" ? (
    <Link href={item.path} className="" alt={item.title}>
        {IconComponent && <IconComponent />} {/* Render the icon dynamically */}
        <span>{item.title}</span>
    </Link>
) : (
    <Link href={"#"} onClick={handleClick} className="" alt={item.title}>
      {IconComponent && <IconComponent />} {/* Render the icon dynamically */}
      <span>{item.title}</span>
    </Link>
)}

                    
                    <i onClick={() => setOpen(!open)}><FaAngleRight /></i>
                </li>
                <div className="sidebar-content">
                    {item.childrens.map((child, index) => <SidebarItem key={index} item={child} />)}
                </div>
            </div>
        );
    } else {
        return (
            <li id={item.title} className={`submenu ${router.pathname === item.path ? 'active' : ''}`}>
                <Link href={item.path || "#"} className="" alt={item.title}>
                    {IconComponent && <IconComponent />} {/* Render the icon dynamically */}
                    <span>{item.title}</span>
                </Link>
            </li>
        );
    }
}
