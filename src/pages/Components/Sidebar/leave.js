import * as  FaIcons from "react-icons/fa";
import * as  GiIcons from "react-icons/gi";
export const leave = [
    {
        "title": "Admin",
        "path": "/leave/admin",
        icon:<FaIcons.FaRegCalendarAlt/>,
        "childrens": [
            {
                "title": "Add Leave",          
                "path": "/addleave/admin"
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