import * as  FaIcons from "react-icons/fa";
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