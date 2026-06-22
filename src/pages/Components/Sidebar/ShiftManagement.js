import * as  FaIcons from "react-icons/fa";


export const ShiftManagement = [
	
    {
        "title": "Admin",
        "path": "/shift-management",
        icon:<FaIcons.FaRegCalendarAlt/>,
        "childrens": [
            
            {
                "title": "Shift Dashboard",     
                "path": "/shift-management"
            },	
            {
                "title": "Sift list",     
                "path": "/shift-management/admin"
            },	
            {
                "title": "Add",          
                "path": "/shift-management/create"
            },	
        ]
    },
    {
        "title": "User",
        "path": "/leave",
        icon:<FaIcons.FaRegCalendarAlt/>,
        "childrens": [
            {
                "title": "Add Leave",          
                "path": "/addleave"
            },	
        ]
    }
]