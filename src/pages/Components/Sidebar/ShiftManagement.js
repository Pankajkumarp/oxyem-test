import * as  FaIcons from "react-icons/fa";
import * as  BsIcons from "react-icons/bs";
import * as  RxIcons from "react-icons/rx";
import * as  ImIcons from "react-icons/im";
import * as  mdIcons from "react-icons/md";
import * as  Fa6Icons from "react-icons/fa6";
import * as  GrIcons from "react-icons/gr";
import * as  TbIcons from "react-icons/tb";
import { VscTypeHierarchySuper } from "react-icons/vsc";


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