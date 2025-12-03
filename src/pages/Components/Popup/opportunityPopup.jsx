import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';

const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minHeight: '85vh',
        maxHeight: '85vh',
        minWidth: '75vw'
    },
};

export default function OpportunityPopup({ isOpen, closeModal, opportunityId }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [status, setStatus] = useState("");
    const [summaryCost, setSummaryCost] = useState({});
    console.log("summaryCost", summaryCost)

    const getAttendanceDetails = async (id) => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/opportunity/edit`, {
                params: {
                    id: id,
                },
            });
            if (response && response.data && response.data.data) {
                setStatus(response.data.data.status);
                setSummaryCost(response.data.data.summaryCost);
            }
        } catch (error) {
            console.error("Error occurred while fetching attendance details:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            getAttendanceDetails(opportunityId);
        }
    }, [isOpen, opportunityId]);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            ariaHideApp={false}
            style={customStyles}
        >
            <div className="modal-dialog oxyem-opportiunity-popup">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel"></h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body" id="jobinfo-popup">
                        <div className="container mt-5">
                            <div className="row align-items-center mb-3">
                                <div className="col-8">
                                    <h5 className="text_top_l">
                                        {summaryCost["Opportunity  Information"] && (
                                            <>
                                                {Object.entries(summaryCost["Opportunity  Information"]).map(([key, value]) => {
                                                    if (key === "Opportunity Name") {
                                                        return <>{value}</>;
                                                    }
                                                    return null;
                                                })}
                                            </>
                                        )}
                                    </h5>
                                </div>
                                <div className="col-4 d-flex justify-content-end">
                                    <span className={`oxyem-mark-${status}`}>{status}</span>
                                </div>
                            </div>
                            <div className="row_design_view">
                                {/* Opportunity Information Card */}
                                {summaryCost["Opportunity  Information"] && (
                                    <div className="card oppor_cards">
                                        <div className="card-body card_inform">
                                            <h5 className="card-title">Opportunity Information</h5>
                                            {Object.entries(summaryCost["Opportunity  Information"]).map(([key, value]) => (
                                                <p key={key} className="card-text">
                                                    <span className='card-text-left'>{key}</span>
                                                    <span className='card-text-center'>:</span>
                                                    <span className='card-text-right'>{value}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Resource Information Card */}
                                {summaryCost["Resource  Information"] && (
                                    <div className="card oppor_cards">
                                        <div className="card-body card_resources">
                                            <h5 className="card-title">Resource Information</h5>
                                            <div className='res_opp'>
                                                {Object.entries(summaryCost["Resource  Information"]).map(([key, value], index) => (
                                                    <div key={key} className={index % 2 === 0 ? 'res_opp_left' : 'res_opp_right'}>
                                                        <p className="card-title">{key}</p>
                                                        <p className="card-text-cus">{value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Financial Information Card */}
                                {summaryCost["Financial  Information"] && (
                                    <div className="card oppor_cards">
                                        <div className="card-body card_financial">
                                            <h5 className="card-title">Financial Information</h5>
                                            <div className="card_financial_top">
                                                {Object.entries(summaryCost["Financial  Information"]).map(([key, value]) => {
                                                    if (key === "total") {
                                                        return <p key={key} className="card-text-cus">{value}</p>;
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <div className="row">
                                                {Object.entries(summaryCost["Financial  Information"]).map(([key, value]) => (
                                                    key !== "total" && (
                                                        <div key={key} className="card_oppor_cards">
                                                            <p className="card-text">
                                                                <span className='card-text-left'>{key}</span>
                                                                <span className='card-text-center'>:</span>
                                                                <span className='card-text-right'>{value}</span>
                                                            </p>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Profit Margin Card */}
                                {summaryCost["Profit Margin"] && (
                                    <div className="card oppor_cards">
                                        <div className="card-body card_profit_o">
                                            <h5 className="card-title">Profit Margin</h5>
                                            <div className="card_financial_top">
                                                {Object.entries(summaryCost["Profit Margin"]).map(([key, value]) => {
                                                    if (key === "total") {
                                                        return <p key={key} className="card-text-cus">{value}</p>;
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <div className="row">
                                                {Object.entries(summaryCost["Profit Margin"]).map(([key, value]) => (
                                                    key !== "total" && (
                                                        <div key={key} className="card_oppor_cards">
                                                            <p className="card-text">
                                                                <span className='card-text-left'>{key}</span>
                                                                <span className='card-text-center'>:</span>
                                                                <span className='card-text-right'>{value}</span>
                                                            </p>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
