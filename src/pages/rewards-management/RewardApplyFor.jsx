import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useRouter } from 'next/router';
import { FaUser, FaUsers } from "react-icons/fa";

const AssetHistory = ({ isOpen, closeModal, path, isHistroyId, description }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handelredirectAddPage = () => {
        if (!selectedOption || !isHistroyId || !description || !path) {
            return;
        }
        setLoading(true); // Show spinner
        router.push({
            pathname: `/rewards-management/${isHistroyId}`,
            query: { title: description, path: path, nominationType: selectedOption }
        }, `/rewards-management/${isHistroyId}`);
        setLoading(false);
    };

    return (
        <Drawer
            open={isOpen}
            onClose={closeModal}
            direction="right"
            className="custom-drawer custom-drawer-history"
            overlayClassName="custom-overlay"
            
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <hr />
                    <div className="modal-body text-center" id="rewards-management-popup">
                        <div className="row">
                            <div className="col-md-12">
                                <img src={path} alt="Nomination" className="img-fluid" style={{ height: '150px' }} />
                            </div>
                            <div className="col-md-12">
                                <h6 className="mb-4 mt-3">Who are you nominating?</h6>
                                <div className="d-flex justify-content-center gap-3">
                                    <button
                                        className={`reward-team-individual-btn btn btn-reward d-flex flex-column align-items-center p-3 ${selectedOption === 'individual' ? 'active' : ''}`}
                                        style={selectedOption === 'individual' ? { color: 'var(--theme-white-color)', backgroundColor: '#7030A0', borderColor: '#7030A0' } : {}}
                                        onClick={() => setSelectedOption('individual')}
                                    >
                                        <FaUser size={30} className="mb-2" />
                                        <span className="reward-team-individual-name">Individual</span><span className="reward-team-individual-text">Recognize and appreciate individual team members' contributions, fostering motivation and a positive work culture.</span>
                                    </button>

                                    <button
                                        className={`reward-team-individual-btn btn btn-reward d-flex flex-column align-items-center p-3 ${selectedOption === 'team' ? 'active' : ''}`}
                                        style={selectedOption === 'team' ? { color: 'var(--theme-white-color)', backgroundColor: '#7030A0', borderColor: '#7030A0'} : {}}
                                        onClick={() => setSelectedOption('team')}
                                    >
                                        <FaUsers size={30} className="mb-2" />
                                        <span className="reward-team-individual-name">Team</span><span className="reward-team-individual-text">Recognizing and rewarding the entire team for their dedication and achievements.</span>
                                    </button>
                                </div>

                                <button 
                                    className="btn btn-primary mt-4 btn-reward-module" 
                                    onClick={handelredirectAddPage} 
                                    disabled={!selectedOption || loading}
                                >
                                    {loading ? (
                                        <div className="spinner">
                                            <div className="bounce1"></div>
                                            <div className="bounce2"></div>
                                            <div className="bounce3"></div>
                                        </div>
                                    ) : "Next"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default AssetHistory;