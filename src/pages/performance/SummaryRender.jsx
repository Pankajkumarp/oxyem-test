import Link from "next/link";
import React, { useState, useEffect } from "react";
import { GrDocumentPerformance } from "react-icons/gr";
import Rating from "react-rating";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TbNotes } from "react-icons/tb";
import { TbMapStar } from "react-icons/tb";
import TextareaComponent from "../Components/common/Inputfiled/TextAreaComponentcomman";
import { IoMdAddCircleOutline } from "react-icons/io";
import ImprovmentStrength from "../Components/Popup/ImprovmentStrength";
import { FiUpload } from "react-icons/fi";
import Files from "react-files";
import { axiosJWT } from "../Auth/AddAuthorization";
import { MdDownload } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { FaCircleChevronUp, FaCircleChevronDown } from "react-icons/fa6";
import SelectComponent from "../Components/common/SelectOption/SelectComponent";
import { IoMdHappy } from "react-icons/io";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
const SummaryRenderer = ({
    summaryValue,
    id,
    refreshSummaryData,
    handleCancel,
    handleNext,
    buttonArray,
    renderLength,
    handleCycleInitiate
}) => {
    const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const [performanceData, setperformanceData] = useState([]);
    const [behaviorData, setbehaviorData] = useState([]);
    const [learningData, setlearningData] = useState([]);
    const [recommendedRating, setRecommendedRating] = useState({});
    const [summaryData, setSummaryData] = useState(summaryValue);
    const [allStrengthImprove, setallStrengthImprove] = useState([]);
    const [strengthsData, setStrengthsData] = useState([]);
    const [improvementData, setImprovementData] = useState([]);
    const [filesData, setFilesData] = useState([]);
    const [isPublishToEmployee, setisPublishToEmployee] = useState();
    const [isSubmitEmployee, setisSubmitEmployee] = useState();
    const [history, setHistory] = useState([]);
    const [isAddOtherReq, setIsAddOtherReq] = useState();
    const [userType, setUserType] = useState("");
    const [isClosed, setIsClosed] = useState();
    const [finalMsg, setFinalMsg] = useState("");
    const [canCycleInitiate, setCycleInitiate] = useState(false);
    useEffect(() => {
        setSummaryData(summaryValue);
        if (summaryValue && summaryValue.summary) {
            const performanceData = summaryValue.summary.filter(
                (item) => item.name === "Performance Goals"
            );
            setperformanceData(performanceData);
            const behaviorData = summaryValue.summary.filter(
                (item) => item.name === "Behavior Goals"
            );
            setbehaviorData(behaviorData);
            const learningData = summaryValue.summary.filter(
                (item) => item.name === "Learning Goals"
            );
            setlearningData(learningData);
        }
        if (summaryValue && summaryValue.strengths) {
            setallStrengthImprove(summaryValue.strengths);
            const ImprovementData = summaryValue.strengths.filter(
                (item) => item.name === "Improvement"
            );
            setImprovementData(ImprovementData);
            const StrengthData = summaryValue.strengths.filter(
                (item) => item.name === "Strength"
            );
            setStrengthsData(StrengthData);
        }
        if (summaryValue && summaryValue.files) {
            setFilesData(summaryValue.files);
        }
        if (summaryValue && summaryValue.recommendedRating) {
            setRecommendedRating(summaryValue.recommendedRating);
        }
        if (summaryValue && summaryValue.history) {
            setHistory(summaryValue.history);
        }
        if (summaryValue && summaryValue.canCycleInitiate) {
            setCycleInitiate(summaryValue.canCycleInitiate);
        }
        if (summaryValue) {
            setisPublishToEmployee(summaryValue.isPublishToEmployee);
            setisSubmitEmployee(summaryValue.isSubmit);
            setIsAddOtherReq(summaryValue.isAddOtherReq);
            setUserType(summaryValue.userType);
            setIsClosed(summaryValue.isClosed);
            setFinalMsg(summaryValue.finalMsg);
        }
    }, [summaryValue]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openPopupAdd = () => {
        setIsModalOpen(true);
    };
    const openPopupClose = () => {
        setIsModalOpen(false);
    };
    const [error, setError] = useState("");
    const [loader, setLoader] = useState("");
    const handleFileChange = async (updatedFiles) => {
        setError("");
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const formData = new FormData();
        updatedFiles.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("id", id);
        formData.append("isFor", "review");
        setLoader("uploading");
        try {
            const response = await axiosJWT.post(
                `${apiUrl}/performance/uploadFiles`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            if (response) {
                setLoader("uploaded");
                refreshSummaryData();
                setTimeout(() => {
                    setLoader("");
                }, 2500);
            }
        } catch (error) {
            setError("Something error in file upload");
            setLoader("");
            console.error("Error:", error);
        }
    };
    const [textareaValue, setTextareaValue] = useState("");
    const [errorText, setErrorText] = useState("");
    const handleTextareaChange = (value) => {
        setTextareaValue(value);
        setErrorText("");
    };
    const [errorRating, setErrorRating] = useState("");
    const [finalRating, setFinalRating] = useState("");
    const [submitLoader, setSubmitLoader] = useState(false);
    const handleFinalSubmit = async () => {
        if (textareaValue.trim() === "") {
            setErrorText("Remarks cannot be empty.");
            return;
        }
        if (userType === "approver" || userType === "Approver") {
            if (finalRating === "") {
                setErrorRating("Final Rating is Required.");
                return;
            }
        }
        setErrorText("");
        setErrorRating("");
        setSubmitLoader(true);
        const payload = {
            idReview: id,
            remarks: textareaValue,
            recommendedRating: recommendedRating,
        };
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(
                `${apiUrl}/performance/submitFinalPerformance`,
                payload
            );
            if (response) {
                setTextareaValue("");
                setSubmitLoader(false);
                refreshSummaryData();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const [publishLoader, setPublishLoader] = useState(false);
    const handlePublishSubmit = async () => {
        if (textareaValue.trim() === "") {
            setErrorText("Remarks cannot be empty.");
            return;
        }

        setErrorText("");
        setPublishLoader(true);
        const payload = {
            idReview: id,
            remarks: textareaValue,
            isPublishToEmployee: true,
        };
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(
                `${apiUrl}/performance/submitFinalPerformance`,
                payload
            );
            if (response) {
                setTextareaValue("");
                setPublishLoader(false);
                refreshSummaryData();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const [isVisible, setIsVisible] = useState(true);
    const handleFinalRatingChange = (selectedOption) => {
        setRecommendedRating({
            ...recommendedRating,
            finalRating: selectedOption ? selectedOption.value : "",
        });
        setErrorRating("");
        setFinalRating(selectedOption ? selectedOption.value : "");
    };
    const toggleVisibilityHis = () => {
        setIsVisible(!isVisible);
    };
    const markup = { __html: finalMsg };
    return (
        <>
            <ImprovmentStrength
                isOpen={isModalOpen}
                closeModal={openPopupClose}
                id={id}
                refreshSummaryData={refreshSummaryData}
                allStrengthImprove={allStrengthImprove}
            />
            <div className="row rating_display_section">
                {isClosed === true && finalMsg !== "" ? (
                    <div className="col-md-12">
                        <div className="final_rating_succes_msg">
                            <IoMdHappy />
                            <p dangerouslySetInnerHTML={markup}></p>
                        </div>
                    </div>
                ) : null}

                <div className="col-md-9">
                    <div className="performace_summary_heading">
                        <GrDocumentPerformance />{" "}
                        <p>
                            Check your goals summary to ensure a balanced evaluation of{" "}
                            <b>productivity and workplace</b> conduct
                        </p>
                    </div>
                    {performanceData.length > 0 && (
                        <div className="table_content_data_perform">
                            <h3>
                                Performance<span>{renderLength.Performance}</span>
                            </h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rating</th>
                                        <th>Self</th>
                                        <th>Reviewer</th>
                                        <th>Approver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performanceData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className={`rating_star_input`}>
                                                    <span className="rating_starnput">
                                                        <Rating
                                                            initialRating={item.rating || 0}
                                                            emptySymbol={
                                                                <FaRegStar className="sk-rating-empty" />
                                                            }
                                                            fullSymbol={<FaStar />}
                                                            fractions={2}
                                                            stop={5}
                                                            readonly={true}
                                                        />
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{item.selfRating}</td>
                                            <td>{item.reviewerRating}</td>
                                            <td>{item.approverRating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {behaviorData.length > 0 && (
                        <div className="table_content_data_perform">
                            <h3>
                                Behavior<span>{renderLength ? renderLength.Behavior : ""}</span>
                            </h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rating</th>
                                        <th>Self</th>
                                        <th>Reviewer</th>
                                        <th>Approver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {behaviorData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className={`rating_star_input`}>
                                                    <span className="rating_starnput">
                                                        <Rating
                                                            initialRating={item.rating || 0}
                                                            emptySymbol={
                                                                <FaRegStar className="sk-rating-empty" />
                                                            }
                                                            fullSymbol={<FaStar />}
                                                            fractions={2}
                                                            stop={5}
                                                            readonly={true}
                                                        />
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{item.selfRating}</td>
                                            <td>{item.reviewerRating}</td>
                                            <td>{item.approverRating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {learningData.length > 0 && (
                        <div className="table_content_data_perform">
                            <h3>
                                Learning<span>{renderLength ? renderLength.Learning : ""}</span>
                            </h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rating</th>
                                        <th>Self</th>
                                        <th>Reviewer</th>
                                        <th>Approver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {learningData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className={`rating_star_input`}>
                                                    <span className="rating_starnput">
                                                        <Rating
                                                            initialRating={item.rating || 0}
                                                            emptySymbol={
                                                                <FaRegStar className="sk-rating-empty" />
                                                            }
                                                            fullSymbol={<FaStar />}
                                                            fractions={2}
                                                            stop={5}
                                                            readonly={true}
                                                        />
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{item.selfRating}</td>
                                            <td>{item.reviewerRating}</td>
                                            <td>{item.approverRating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="col-md-3">
                    <div className="performace_full_section_upload">
                        <div className="performace_summary_upload">
                            <GrDocumentUpdate />{" "}
                            <p>Please upload any additional supporting documents.</p>
                        </div>
                        <div className="summary_upload_section_f">
                            <div className="files custom_file_field_b">
                                <Files
                                    className="files-dropzone"
                                    onChange={(files) => handleFileChange(files)}
                                    accepts={[
                                        "image/png",
                                        "image/jpg",
                                        "image/jpeg",
                                        "image/webp",
                                        ".pdf",
                                        ".doc",
                                        ".docx",
                                    ]}
                                    multiple
                                    maxFileSize={3000000}
                                    minFileSize={0}
                                    clickable={isAddOtherReq !== false}
                                >
                                    <FiUpload /> Drag & Drop your files or{" "}
                                    <span className="filepond--label-action">Browse</span>
                                    {loader === "uploading" ? (
                                        <span className="fileupload-pending">
                                            <img src="/assets/img/upload-p.gif" alt="upload" />
                                        </span>
                                    ) : loader === "uploaded" ? (
                                        <span className="fileupload-check">
                                            <FaRegCheckCircle />
                                        </span>
                                    ) : null}
                                </Files>
                            </div>
                            <div className="error">{error}</div>
                            {filesData && filesData.length > 0 ? (
                                <div className="file_table_data_f">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="f_h">Title</th>
                                                <th className="d_h">Dl</th>
                                                <th className="s_h">Info</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filesData.map((file, index) => (
                                                <tr className="bottom_table_line" key={file.fileName}>
                                                    <td className="name_ic">
                                                        <div className="highlight_t_s">
                                                            {file.submitDate}
                                                        </div>
                                                        <div>{file.fileName}</div>
                                                    </td>
                                                    <td className="svg_ic">
                                                        <Link
                                                            href={
                                                                file.filePath.startsWith("https")
                                                                    ? file.filePath
                                                                    : `${baseImageUrl}/${file.filePath}`
                                                            }
                                                            download
                                                        >
                                                            <MdDownload />
                                                        </Link>
                                                    </td>
                                                    <td className="type_ic">
                                                        <div>{file.fileExtenstion}</div>
                                                        <div>({file.fileSize})</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row align-items-center">
                <div className="col-md-9">
                    <div className="performace_summary_heading middle">
                        <TbNotes /> <p>Add your Strength and Improvement areas</p>
                    </div>
                </div>
                <div className="col-md-3 text-end btn-add-improvement">
                    {isAddOtherReq !== false && (
                        <button onClick={openPopupAdd} className="btn btn-performance">
                            <IoMdAddCircleOutline /> Add
                        </button>
                    )}
                </div>
            </div>
            <div className="row improve_strength_section">
                <div className="col-md-6">
                    <h3>My Strength</h3>
                    <div className="strength_list_section both_improv_strength">
                        <div className="row top_heding_improv_strength">
                            <div className="col-2 col-md-1">
                                <span>#</span>
                            </div>
                            <div className="col-10 col-md-11">
                                <span>Description</span>
                            </div>
                        </div>
                        {strengthsData.length > 0 ? (
                            strengthsData.map((item, index) => (
                                <div className="row list_data_value_si" key={index}>
                                    <div className="col-2 col-md-1">
                                        <span>{index + 1}</span>
                                    </div>
                                    <div className="col-10 col-md-11">
                                        <h3> {item.remarks}</h3>
                                    </div>
                                    <div className="col-12 text-end list_data_comment_l">
                                        Added by {item.addedBy}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="message_empy">Please add your Strength</p>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <h3>My Improvement Areas</h3>
                    <div className="improvement_list_section both_improv_strength">
                        <div className="row top_heding_improv_strength">
                            <div className="col-2 col-md-1">
                                <span>#</span>
                            </div>
                            <div className="col-10 col-md-11">
                                <span>Description</span>
                            </div>
                        </div>
                        {improvementData.length > 0 ? (
                            improvementData.map((item, index) => (
                                <div className="row list_data_value_si" key={index}>
                                    <div className="col-2 col-md-1">
                                        <span>{index + 1}</span>
                                    </div>
                                    <div className="col-10 col-md-11">
                                        <h3> {item.remarks}</h3>
                                    </div>
                                    <div className="col-12 text-end list_data_comment_l">
                                        Added by {item.addedBy}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="message_empy">Please add your Improvement areas</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="row summary_remarks_section">
                {isClosed === true ? null : (
                    <div className="col-md-12">
                        <TextareaComponent
                            label={"Add Remarks"}
                            value={textareaValue}
                            validations={[
                                {
                                    message: "Remarks is required",
                                    type: "required",
                                },
                            ]}
                            onChange={handleTextareaChange}
                            name="addRemarks"
                        />
                        {errorText && <div className="error mt-2">{errorText}</div>}
                    </div>
                )}
            </div>
            <div className="row summary_recommendedRating_section">
                <div className="col-md-3">
                    <div className="performace_summary_heading bottom">
                        <TbMapStar /> <p>Recommended Rating</p>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="list_recommed_section_main">
                        <div className="list_recommed_section">
                            <p className="t_rcommd_c">Auto by System</p>
                            <p className="b_rcommd_c">
                                {recommendedRating.autoBySystem || 0}
                            </p>
                        </div>
                        <div className="list_recommed_section">
                            <p className="t_rcommd_c">Reviewer Rating</p>
                            <p className="b_rcommd_c">
                                {recommendedRating.finalReviewerRating || 0}
                            </p>
                        </div>
                        <div className="list_recommed_section">
                            <p className="t_rcommd_c">Approver Rating</p>
                            <p className="b_rcommd_c">
                                {recommendedRating.finalApproverRating || 0}
                            </p>
                        </div>
                        <div className="list_recommed_section">
                            <p className="t_rcommd_c">Final Rating</p>
                            <p className="b_rcommd_c">{recommendedRating.finalRating || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
            {(userType === "approver" || userType === "Approver") && (
                <div className="row">
                    {isClosed === true ? null : (
                        <div className="col-md-4">
                            <div className="final_rate_summary_box">
                                <SelectComponent
                                    label="Final Rating"
                                    name="finalRating"
                                    isDisabled={false}
                                    validations={[
                                        {
                                            message: "Final Rating is required",
                                            type: "required",
                                        },
                                    ]}
                                    options={[
                                        { value: "1", label: "1" },
                                        { value: "2", label: "2" },
                                        { value: "3", label: "3" },
                                        { value: "4", label: "4" },
                                        { value: "5", label: "5" },
                                    ]}
                                    value={finalRating}
                                    onChange={handleFinalRatingChange}
                                />
                                {errorRating && <div className="error mt-2">{errorRating}</div>}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="text-end w-100 mt-4">
                {buttonArray.map((buttonssection, buttonsIndex) =>
                    buttonssection.buttontype === "cancel" ? (
                        <button
                            key={buttonsIndex}
                            type="button"
                            className={`btn ${buttonssection.class}`}
                            disabled={buttonssection.isDisabled}
                            onClick={handleCancel}
                        >
                            {buttonssection.label}
                        </button>
                    ) : buttonssection.buttontype === "submit" ? (
                        <>
                            {isSubmitEmployee === false ? null : (
                                <button
                                    key={buttonsIndex}
                                    type="submit"
                                    className={`btn ${buttonssection.class}`}
                                    disabled={buttonssection.isDisabled || submitLoader}
                                    onClick={handleFinalSubmit}
                                >
                                    {submitLoader ? (
                                        <div className="spinner">
                                            <div className="bounce1"></div>
                                            <div className="bounce2"></div>
                                            <div className="bounce3"></div>
                                        </div>
                                    ) : (
                                        <>{buttonssection.label}</>
                                    )}
                                </button>
                            )}
                        </>
                    ) : buttonssection.buttontype === "publish" ? (
                        <>
                            {isPublishToEmployee === false ? null : (
                                <button
                                    key={buttonsIndex}
                                    type="submit"
                                    className={`btn ${buttonssection.class}`}
                                    disabled={buttonssection.isDisabled || publishLoader}
                                    onClick={handlePublishSubmit}
                                >
                                    {publishLoader ? (
                                        <div className="spinner">
                                            <div className="bounce1"></div>
                                            <div className="bounce2"></div>
                                            <div className="bounce3"></div>
                                        </div>
                                    ) : (
                                        <>{buttonssection.label}</>
                                    )}
                                </button>
                            )}
                        </>
                    ) : null
                )}
            </div>

            <div className="row comment_his_section">
                <div className="col-md-12">
                    <div className="comment_his_top_head">
                        <h3>History</h3>
                        <button onClick={toggleVisibilityHis} className="toggle-button">
                            {isVisible ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </button>
                    </div>
                    {isVisible && (
                        <div className="comment_his_section_list">
                            {history.length > 0 ? (
                                history.map((item, index) => (
                                    <div className="comment_his_main_box" key={index}>
                                        <div className="comment_his_section_box">
                                            <p> {item.comment}</p>
                                        </div>
                                        <span>
                                            Added on {item.addedOn} by {item.addedBy}.
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <h3 className="message_empy">History Data not available</h3>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {canCycleInitiate ? (
                <div className="text-end w-100 mt-4 mb-5">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCycleInitiate}
                    >
                        Cycle Initiate
                    </button>
                </div>
            ) : null}
        </>
    );
};

export default SummaryRenderer;
