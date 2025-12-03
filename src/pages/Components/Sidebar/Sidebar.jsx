import React, { useEffect, useState } from 'react'
import SidebarItem from "./SidebarItem"
import { useRouter } from 'next/router';
import { axiosJWT } from '../../Auth/AddAuthorization';
import CryptoJS from 'crypto-js';
export default function Sidebar() {
	const router = useRouter();
	const { pathname } = useRouter();
	const pathParts = pathname.split("/");
	const moduleName = pathParts[1];
	const [menuMainText, setmenuMainText] = useState("");
	const [mainMenuItem, setmainMenuItem] = useState([]);
	const [showmenu, setshowMenu] = useState(false);
	const fetchsubMainOptions = async (value) => {
		setshowMenu(false)
		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const responseid = await axiosJWT.get(`${apiUrl}/getMenuItem`, {
				params: {
					slug: router.pathname
				}
			});
			if (responseid) {
				setshowMenu(true)
				const arr = responseid?.data?.data;
				if (!Array.isArray(arr) || arr.length === 0) {
  					console.error("Menu data is missing:", arr);
  					return;
				}
				const maintext = responseid.data.data[0].menuName
				setmenuMainText(maintext)
				const menuitem = responseid.data.data[0].children
				const transformMenuItem = (item) => ({
					id: item.id,
					title: item.menuName,
					path: item.slug,
					childrens: item.children ? item.children.map(transformMenuItem) : null,
					icon: item.menuImage ? item.menuImage : ""
				});

				const menuitemData = responseid.data.data[0].children.map(transformMenuItem);
				setmainMenuItem(menuitemData)

			}
		} catch (error) {
			console.error('Error fetching options:', error);
		}
	};
	const fetchSessionMainOptions = async (moduleGetName) => {
		setshowMenu(false);
		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const responseid = await axiosJWT.get(`${apiUrl}/getMenuItem`, {
				params: {
					slug: `/${moduleGetName}`
				},
				paramsSerializer: (params) => {
					return `slug=${params.slug}`;
				}
			});
			if (responseid) {
				setshowMenu(true);
				const maintext = responseid.data.data[0].menuName;
				sessionStorage.setItem('sidebarData', JSON.stringify(responseid.data.data));
				setmenuMainText(maintext);
				const menuitem = responseid.data.data[0].children;
				const transformMenuItem = (item) => ({
					id: item.id,
					title: item.menuName,
					path: item.slug,
					childrens: item.children ? item.children.map(transformMenuItem) : null,
					icon: item.menuImage ? item.menuImage : ""
				});

				const menuitemData = responseid.data.data[0].children.map(transformMenuItem);
				setmainMenuItem(menuitemData);

				sessionStorage.setItem('mainsidebarText', maintext);
			}
		} catch (error) {
			console.error('Error fetching options:', error);
		}
	};
	useEffect(() => {
		setmenuMainText("");
		const secretKey = process.env.NEXT_PUBLIC_ENCRYPT_DECRYPTING;

		const allowedModules = ["performance", "leave", "claim", "attendance", "basket-of-allowance", "project", "shifts", "holiday", "stock-management", "automation-ideas", "policies", "createInvoice", "reports"];
		if (allowedModules.includes(moduleName)) {
			const existingModule = sessionStorage.getItem("moduleName");
			let existingModuleName = "";

			if (existingModule) {
				const bytes = CryptoJS.AES.decrypt(existingModule, secretKey);
				existingModuleName = bytes.toString(CryptoJS.enc.Utf8);
			}
			if (!existingModuleName || existingModuleName !== moduleName) {
				const encryptedModuleName = CryptoJS.AES.encrypt(moduleName, secretKey).toString();
				sessionStorage.setItem("moduleName", encryptedModuleName);
				fetchSessionMainOptions(moduleName);
			} else {
				const sidebarData = sessionStorage.getItem("sidebarData");
				const mainsidebarText = sessionStorage.getItem("mainsidebarText");
				if (sidebarData && mainsidebarText) {
					const transformMenuItem = (item) => ({
						id: item.id,
						title: item.menuName,
						path: item.slug,
						childrens: item.children ? item.children.map(transformMenuItem) : null,
						icon: item.menuImage ? item.menuImage : ""
					});
					setmenuMainText(mainsidebarText);
					const parsedData = JSON.parse(sidebarData);
					const getValue = parsedData[0].children.map(transformMenuItem);
					setmainMenuItem(getValue);
					setshowMenu(true);
				}
			}
		} else {
			fetchsubMainOptions();
		}
	}, [router.query]);


	return (
		<div className={`sidebar ${router.pathname === "/reward-dashboard" ||
			router.pathname === "/rewards-management" ||
			router.pathname === "/rewards" ||
			router.pathname.startsWith("/rewards-management/")
			? "sidebar-reward"
			: ""
			}`} id="sidebar">
			<div className="sidebar-inner slimscroll">
				<div id="sidebar-menu" className="sidebar-menu">
					<ul className={showmenu ? 'oxy-Sidebar-visible' : 'oxy-Sidebar-hidden'}>
						<li className="menu-title">
							<span>{menuMainText}</span>
						</li>
						{mainMenuItem.map((item, index) => <SidebarItem key={index} item={item} />)}
					</ul>
				</div>
			</div>
		</div>
	)
}
