import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { InputContext } from './InputContext.jsx';
import Notificationtext from '../../commancomponents/Notificationtext';
export default function SearchResults({searchTerm1, section, employelist}) {
	const router = useRouter();
	const { globalSearch, handleChange } = useContext(InputContext);
	
	const [fillterresultlist, setfillterResultlist] = useState('');
	 

  useEffect(() => {
    if (searchTerm1.length < 1) {
        setfillterResultlist([]);
        return;
    }
   const filteredData = employelist ? employelist.filter((item) =>
			(item.name && item.name.toLowerCase().includes(searchTerm1.toLowerCase())) ||
			(item.email && item.email.toLowerCase().includes(searchTerm1.toLowerCase()))
		) : [];

    const fetchedOptions = filteredData.slice(0, router.pathname === '/Search' ? 200 : 4).map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        serchtype: item.serchtype,
        profileimg: item.profileimg
    }));

    setfillterResultlist(fetchedOptions);
}, [globalSearch]);


	

	return (
		<>
			{fillterresultlist.length > 0 ? (
				<>
						{fillterresultlist && fillterresultlist.map((item, index) => (
							<Notificationtext id={item.id} name={item.name} imageUrl={item.profileimg} profilelink={item.slug} toptext={item.name} maintext={""} bottomtext={item.serchtype} iconsize={"38"}/>
						))}
					
				</>
			) : (
				<></>
			)}

</>
	)
}
