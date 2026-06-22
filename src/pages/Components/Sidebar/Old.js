import * as  FaIcons from "react-icons/fa";
import * as  RxIcons from "react-icons/rx";

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