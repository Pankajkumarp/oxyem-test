import React, { useState, useEffect, useContext, useRef } from 'react';
import { InputContext } from './InputContext.jsx';
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import SearchResults from './SearchResults.jsx';
export default function SearchBar({employelist}) {
    const router = useRouter();
    const { globalSearch, handleChange } = useContext(InputContext);

    const inputRef = useRef();
    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleClickOutside = (e) => {
        if (router.pathname === '/Search') {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setClicked(false);
                handleChange("")
            }
        } else {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setClicked(false);
                handleChange('');
            }
        }
    };
    const [clicked, setClicked] = useState(false);
    const handleChange2 = (event) => {
        
        handleChange(event.target.value);
    };
    return (
        <form ref={inputRef} className={clicked ? 'oxyem-form-clicked' : 'oxyem-form'}>
            <input
                type="text"
                className={'form-control'}
                placeholder="Search Here"
                value={globalSearch}
                onChange={handleChange2}
                onFocus={() => setClicked(true)}

            />
            <span className={clicked ? 'btn oxyem-btn-clicked' : 'btn'}><FaSearch /></span>
            <div className={`oxyem-search-data ${!globalSearch ? 'oxyem-search-empty' : ''}`} style={router.pathname === '/Search' ? { display: 'none' } : {}}>
                <SearchResults searchTerm1={globalSearch} section={"resultbar"} employelist={employelist}/>
            </div>
        </form>
    );
}