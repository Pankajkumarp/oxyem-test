import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs'
import { axiosJWT } from '../Auth/AddAuthorization';
import View from './View';
import RewardApplyFor from './RewardApplyFor';
import { RiInformationLine } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';

export default function index() {
    const router = useRouter();
const [awardsData, setAwardsData] = useState([]);
    
    const fetchOptions = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/reward/rewardslist`);
          setAwardsData(response.data.data || []);
        } catch (error) {
        //   setError(error.message || 'Failed to fetch options');
        }
      };
  
    useEffect(() => {
        fetchOptions();
    }, []);

    const handelredirectAddPage = (id, description ,path) => {
        router.push({
            pathname: `/rewards-management/${id}`, 
            query: { title: description , path: path} // Passing title as a query param
        }, `/rewards-management/${id}`); // Hides the query param in the URL
    };
    
    const [isHistroyId, setHistroyId] = useState('');
    const [awardImg, setPath] = useState('');
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenApplyFor, setIsModalOpenApplyFor] = useState(false)
          const handleViewReward = (id) => {
            setHistroyId(id);
            setIsModalOpen(true);
         };

        const closeDetailpopup = async () => {
          setHistroyId('');
          setIsModalOpen(false);
          setIsModalOpenApplyFor(false);
        };


        const handelApplyReward = (id ,description ,path) => {
            setHistroyId(id);
            setPath(path);
            setDescription(description);
            setIsModalOpenApplyFor(true);
         };
        

 useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'reward-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);

  return (
    <>
    <Head><title>{pageTitles.RewardsManagement}</title></Head>
    <div className="main-wrapper">
        <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"}  datafor={''} />
        <RewardApplyFor isOpen={isModalOpenApplyFor} closeModal={closeDetailpopup} path={awardImg} isHistroyId={isHistroyId} description={description}/>
                <div className="page-wrapper" id="select-rewards-for-add">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Employee Rewards Management"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                    <div className="row rewards-list">
                                                    {awardsData?.map((award, index) => (
        <div key={index} className="col-md-4 text-center" >
            <h6 className="fs-2 fw-bold d-flex align-items-center justify-content-between">
            <span className='reward-type-description d-flex align-items-center'></span>
                <span className="d-flex align-items-center">
                <RiInformationLine 
                data-tooltip-id="info-tooltip"
                data-tooltip-content={`View Submitted History`}
                  className="ms-2"
                  style={{ cursor: 'pointer' }} 
                  size={17}
                  onClick={() => handleViewReward(award.id)}
                />
            </span>
            </h6>
    <div onClick={() => handelApplyReward(award.id, award.description , award.path)}>
    <img src={award.path} alt={award.description} className="img-fluid" style={{ height: '150px' }} />
    <h6 className="mt-3">{award.description}</h6>
    </div>
    <hr />
  </div>
)) || []}


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

                </div>
            </div>
            <Tooltip 
        id="info-tooltip" 
        place="top" 
        effect="solid"
        multiline
        style={{ whiteSpace: 'pre-line', maxWidth: '350px' ,zIndex:'200', backgroundColor:'#9a91d8' }} // Ensures proper line breaks
      />
</>
  )
}
