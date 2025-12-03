import React, {useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SearchBar from './SearchBar';
import { InputContext } from './InputContext.jsx';
import  SearchResults from './SearchResults.jsx';
import { axiosJWT } from '../../../Auth/AddAuthorization';
export default function Headersearchbar() {
	const router = useRouter();
	const { globalSearch } = useContext(InputContext);
	const [employelist, setEmployelist] = useState('');


	useEffect(() => {
		const fetchProfileOptions = async (value) => {
			try {
				const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
				const response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": "" } })
				if (response) {
					const optionsData = response.data.data.map((item) => ({ // Access response.data.data
						name: item.employeeName,
						id: item.idEmployee,
						profileimg: item.profilePicPath ? item.profilePicPath : "",
						slug: item.idEmployee ? item.idEmployee : "",
						serchtype: item.designation ? item.designation : "",
					}));
					setEmployelist(optionsData)
				}
			} catch (error) {
				console.error('Error fetching options:', error);
			}
		};
		if(!employelist){
		fetchProfileOptions()
		}

	}, []);
	
	return (
		<div className="top-nav-search">
			<SearchBar employelist={employelist}/>

		</div>
	)
}
