import * as  FaIcons from "react-icons/fa";
import * as  BsIcons from "react-icons/bs";
import * as  RxIcons from "react-icons/rx";
import * as  ImIcons from "react-icons/im";
import * as  mdIcons from "react-icons/md";
import * as  Fa6Icons from "react-icons/fa6";
import { VscTypeHierarchySuper } from "react-icons/vsc";

export const leave = [
    {
        "title": "Dashboard",
        "path": "/Dashboard",
        icon:<RxIcons.RxDashboard/>
    },
	
    
	{
        "title": "Admin",
        icon:<FaIcons.FaNewspaper/>,
        "path": "/user",
        "childrens": [

            {
               "title": "Add Employee",
               
               "path": "/user"
            },
            {
                "title": "Leave",
                
                "path": "/leave"
             },
            {
                "title": "Add Leave",
                
                "path": "/addleave"
             }, 
			 {
                "title": "Project Management",
                
                "path": "/Projectmanagement"
             }, 
			 {
                "title": "Project Dashboard",
                
                "path": "/Project-dashborad"
             },
			 {
                "title": "Project Allocation",
                
                "path": "/Project-allocation"
             }
            
        ]
    },
    
]