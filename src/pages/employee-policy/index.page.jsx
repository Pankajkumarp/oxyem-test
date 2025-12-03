import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import SelectComponent from '../Components/common/SelectOption/SelectComponent.jsx';
import Input from '../Components/common/Inputfiled/TextComponent';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';

export default function employeepolicy() {
	const policyBaseurl = process.env.NEXT_PUBLIC_POLICY_IMAGE_BASE_URL
  const router = useRouter();
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [leaveType, setLeaveType] = useState(""); // State to manage active tab index
  const [countvalue, setcountvalue] = useState(4); // State to manage active tab index
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/policy/policyTypeDropdown`);

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          label: item.collectionName,
          value: item.collectionid,
        }));
        setLeaveTypeList(optionsData);
        if (optionsData.length > 0) {
          setLeaveType(optionsData[0].value);  // Set the first item
        }
      } catch (error) {

        //setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, []);

  const [sectionName, setsectionName] = useState("");
  const [sectionCardList, setsectionCardList] = useState([]);
  const fetchlistOptions = async (value) => {
    const apipayload = {
      "collectionid": value,
      "count": countvalue
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.post(`${apiUrl}/policy/policyTypeList`, apipayload);
      if (response) {
        setsectionName(response.data.policyDetail.policiesName)
        setsectionCardList(response.data.policyDetail.policies)
      }
    } catch (error) {


    }
  };
  useEffect(() => {


    if (leaveType !== "") {
      fetchlistOptions(leaveType)
    }
  }, [leaveType, countvalue]);

  const onChangeLeaveType = (value) => {
    if (value !== null) {
      setLeaveType(value.value);
      setcountvalue(4)
    } else {
      setLeaveType();
      setcountvalue(4)
    }
  };
  const handleReadMoreClick = () => {
    setcountvalue((prevCount) => prevCount + 4);
  };





  const [searchText, setSearchText] = useState('');  // State for input
  const [resultsSearch, setResultsSearch] = useState([]);  // State to store API response
  const [countSearchvalue, setcountSearchvalue] = useState(4);
  const fetchResults = async (query) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/policy/policySearch`, {
        params: {
          searchText: query,
          count: countSearchvalue
        }
      });
      if (response) {
        setResultsSearch(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (searchText.length > 0) {
      fetchResults(searchText);
    } else {
      setResultsSearch([]);
      setcountSearchvalue(4)
    }
  }, [searchText, countSearchvalue]);
  
  const handleSearchReadMoreClick = () => {
    setcountSearchvalue((prevCount) => prevCount + 4);
  };

  return (
    <>
    <Head><title>{pageTitles.EmployeePolicy}</title></Head>
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs maintext={"Employee Policy"} />
          <div className="row">
            <div className="col-12 col-lg-12 col-xl-12">
              <div className="row">
                <div className="col-12 col-lg-12 col-xl-12 d-flex">
                  <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                    <div className="center-part">
                      <div className="card-body oxyem-mobile-card-body">
                        <div className="row mt-3">
                          <div className="col-md-7">
                            <div className="form-group">
                              <Input
                                value={searchText}
                                label={"Search policy with policy name"}
                                placeholder={"Search..."}
                                onChange={(value) => setSearchText(value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-5">
                            <div className="form-group">
                              <SelectComponent label={"Filter Data by Leave Type"} placeholder={"Select Leave Type..."} options={leaveTypeList} onChange={onChangeLeaveType} value={leaveType} />
                            </div>
                          </div>

                        </div>
                        {searchText === ""?(
                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border policy__employee_page">
                          {sectionName && <h2 className='policy_oxyem_heading'>{sectionName}</h2>}

                          <div className="row">
                            {
                              sectionCardList && sectionCardList.length > 0 ? (
                                sectionCardList.map((card, index) => (
                                  <div className="col-12 col-md-3" key={index}>
                                    <div className="card policy_oxyem_card" >
									<Link href={`${policyBaseurl}/${card.policyDocument}`} download className="card_img_click">
                                      {card.docType.startsWith('image/') ? (
                                        <img
                                          src="/assets/img/img.png"
                                          className="card-img-top policy_oxyem_card_img"
                                          alt="icon"
                                        />
                                      ) : card.docType.startsWith('video/') ? (
                                        <img
                                          src="/assets/img/youtube.png"
                                          className="card-img-top policy_oxyem_card_img"
                                          alt="Video"
                                        />
                                      ) : card.docType.startsWith('application/') ? (
                                        <img
                                          src="/assets/img/docs.png"
                                          className="card-img-top policy_oxyem_card_img"
                                          alt="Document"
                                        />
                                      ) : null}
									</Link>
                                      <div className="card-body">
                                        <Link href={`${policyBaseurl}/${card.policyDocument}`} download className="card-title">{card.policyName}</Link>
                                        <p className="card-text">{card.policyDescription.slice(0, 120)}{card.policyDescription.length > 120 && '...'}</p>
                                        <div className='row policy_oxyem_card_bottom'>
                                          <div className="col-6 left_ca_o" >
                                            Last Update
                                          </div>
                                          <div className="col-6 right_ca_o" >
                                            {new Date(card.lastUpdate || card.createDate).toLocaleDateString('en-GB', {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className='oxyem_policy_nofound_box'>
                                  <p>No Policy found</p>
                                </div>
                              )
                            }
                          </div>
                          {sectionCardList.length === countvalue && (
                            <div className='oxyem_policy_btn_box'>
                              <button className='oxyem_policy_read_more' onClick={handleReadMoreClick}>View More</button>
                            </div>
                          )}
                        </div>
                        ):(
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border policy__employee_page">
                          <div className="row">
                            {
                              resultsSearch && resultsSearch.length > 0 ? (
                                resultsSearch.map((card, index) => (
                                  <div className="col-12 col-md-3" key={index}>
                                    <div className="card policy_oxyem_card policy_oxyem_card_search" >
                                    <span className="policy_oxyem_card_label">{card.collectionName.slice(0, 20)}{card.collectionName.length > 20 && '..'}</span>
									<Link href={`${policyBaseurl}/${card.policyDocument}`} download className="card_img_click">
                                      {card.docType.startsWith('image/') ? (
                                        <img
                                          src="/assets/img/img.png"
                                          className="card-img-top policy_oxyem_card_img"
                                          alt="icon"
                                        />
                                      ) : card.docType.startsWith('video/') ? (
                                        <img
                                          src="/assets/img/youtube.png"
                                          className="card-img-top policy_oxyem_card_img"
                                          alt="Video"
                                        />
                                      ) : card.docType.startsWith('application/') ? (
                                        <img
                                          src="/assets/img/docs.png"
                                          className="card-img-top policy_oxyem_card_img"
                                          alt="Document"
                                        />
                                      ) : null}
									</Link>
                                      <div className="card-body">
										 <Link href={`${policyBaseurl}/${card.policyDocument}`} download className="card-title">{card.policyName}</Link>
                                        <p className="card-text">{card.policyDescription.slice(0, 120)}{card.policyDescription.length > 120 && '...'}</p>
                                        <div className='row policy_oxyem_card_bottom'>
                                          <div className="col-6 left_ca_o" >
                                            Last Update
                                          </div>
                                          <div className="col-6 right_ca_o" >
                                            {new Date(card.lastUpdate || card.createDate).toLocaleDateString('en-GB', {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className='oxyem_policy_nofound_box'>
                                  <p>No Policy found</p>
                                </div>
                              )
                            }
                          </div>
                          {resultsSearch.length === countSearchvalue && (
                            <div className='oxyem_policy_btn_box'>
                              <button className='oxyem_policy_read_more' onClick={handleSearchReadMoreClick}>View More</button>
                            </div>
                          )}
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
