import React, { useEffect, useState } from 'react';
import { axiosJWT } from '../Auth/AddAuthorization';

export default function RealTimePreview({path ,empName ,description}) {

    const [LoginUser, setLoginUser] = useState("");

    const getFormattedDate = () => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date().toLocaleDateString('en-GB', options); // "12 Jun 2025"
    };

    const props = {
        title: "Certificate of Appreciation",
        awardtaking: empName,
        description: description,
        image: path,
        date: getFormattedDate(),
        awardby: LoginUser.employeeName,
        roleName: LoginUser.designation,
        certificateNo: "1234567890"
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/employees/getLoggedInEmployee`);
                if (response.data.data) {   
                   const data = response.data.data;
                   setLoginUser(data);
                 }
            } catch (error) {
            }
        };
        fetchData();
      }, []);

    return (
        <div id="Awards-detail-section">
            <div className="content-wrapper">
                <div className="content container-fluid card body" style={{ border: 0, padding: 0 }} id="printableContent">
                    <div style={{
                        border: "17px solid #0C5280",
                        padding: "25px",
                        borderRadius: "0rem",
                        backgroundImage: "url(https://oxyemdev.s3.eu-west-1.amazonaws.com/reward_badgets/oxytal-bg.jpg)",
                        backgroundPosition: "center",
                        backgroundSize: "cover"
                    }}>
                        <div style={{ width: "100%" }}>
                            <div style={{ width: "200px", height: "120px", float: "left" }}>
                                <div style={{
                                    float: "left",
                                    lineHeight: "120px",
                                    position: "relative",
                                    textAlign: "center",
                                    zIndex: 1,
                                    padding: "0 20px",
                                    transition: "all .2s ease"
                                }}>
                                    <a style={{
                                        display: "inline-block",
                                        lineHeight: "60px",
                                        fontSize: "36px",
                                        fontWeight: 700,
                                        color: "#000"
                                    }}>
                                        <span style={{ fontSize: "48px", color: "#ff9b44" }}>O</span>XYTAL
                                    </a>
                                </div>
                            </div>
                            <div style={{ width: "200px", height: "120px", float: "right" }}>
                                <img src={props.image} id="award_img" alt="award" style={{ width: "190px", float: "right" }} />
                            </div>
                        </div>

                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <div style={{ padding: "0px 20px", textAlign: "center", position: "relative" }}>
                                <div style={{ width: "900px", padding: "0 60px", textAlign: "center", fontFamily: "Arial, Helvetica, sans-serif" }}>
                                    <h1 style={{ fontFamily: "Cambria, Georgia, serif", fontStyle: "italic", fontSize: "60px", textTransform: "uppercase", color: "#000" }}>
                                        Certificate of
                                    </h1>
                                    <span style={{ fontFamily: "Cambria, Georgia, serif", fontSize: "42px", textTransform: "uppercase", color: "#000", fontStyle: "italic" }}>
                                        Appreciation
                                    </span>
                                    <span style={{ fontSize: "18px", width: "100%", marginTop: "10px", float: "left" }}>
                                        The Certificate is proudly presented to
                                    </span>
                                    <span style={{ fontSize: "30px", fontFamily: "Cambria, Georgia, serif", width: "100%", marginTop: "0px", float: "left" }}>
                                        <p>
                                            <span id="employee_name_id" style={{ textTransform: "capitalize" }}>{props.awardtaking}</span>
                                        </p>
                                    </span>
                                    <div style={{ width: "90%", textAlign: "center", margin: "0 auto" }}>
                                        <span id="award_description" style={{ fontSize: "1rem" }}>{props.description}</span>
                                    </div>
                                    <div style={{ width: "600px", margin: "20px auto 0", padding: "20px 5px", display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
                                        <span style={{ width: "200px", padding: "28px 0px" }} id="award_date">{props.date}</span>
                                        <span style={{ width: "250px" }}>
                                            <span id="award_submitted_by" style={{ fontFamily: "bettina_signatureregular", fontWeight: 600, fontSize: "18px", textTransform: "capitalize" }} className="capitalize">{LoginUser.employeeName}</span><br />
                                            <span id="award_groupid">{props.roleName}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 600 }}>
                                Certificate No. : <span id="award_certificateId">{props.certificateNo}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
