import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { MdDownload } from 'react-icons/md';
import { FiUpload } from 'react-icons/fi';
import { FaRegCheckCircle } from "react-icons/fa";
import Rating from 'react-rating';
import Files from 'react-files'
import { RiDeleteBinLine } from "react-icons/ri";
import { Tooltip } from 'react-tooltip'

const FieldRenderer = ({ field, index, subsectionIndex, fieldIndex, handleFieldChange, handleFileChange, handleGoalSubmit, handleCancel, handleNext, buttonArray , onDeleteClick}) => {
    const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const [fieldValue, setFieldValue] = useState(field);
    const [subinnersectionIndex, setsubInnersectionIndex] = useState(subsectionIndex);
    const [subinnerfieldIndex, setsubInnerfieldIndex] = useState(fieldIndex);
    useEffect(() => {
        setFieldValue(field)
        setsubInnersectionIndex(subsectionIndex)
        setsubInnerfieldIndex(fieldIndex)
    }, [field, subsectionIndex, fieldIndex, index]);

    return (
        <div className='row box_main_all_f'>
            <div className='col-lg-4 col-md-6 box_f_first'>
                <div className='box-all_field first_box_perform'>
				    <span className={`goal_status_btn only_mobile_perform status_btn_per_${fieldValue.status.value === "open" ? 'open' : 'close'}`} data-tooltip-id="my-tooltip" data-tooltip-content={fieldValue.status.value}></span>
                    <span className='bar_lab oxyem-mark-pending'>{fieldValue.typeOfLevel?.value || ''}</span>
                    <h3 className='main_text_i_b'><span>{subinnerfieldIndex + 1}. </span> {fieldValue.goalName?.value}</h3>
                    <div className='input_f_b'>
                        {fieldValue.target.type === "number" && ( 
                            <>
                                <div className='inn_input_field'>
                                    <span className='main_lab_name main_lab_name_f'>Target</span>
                                    <input
                                        type="number"
                                        value={fieldValue.noOrPercentageUpdated?.value || ''}
                                        disabled={fieldValue.status.value === "closed" || fieldValue.isSave.value === false || fieldValue.isAdmin.value === true}
                                        onChange={(e) => handleFieldChange(index, subinnersectionIndex, subinnerfieldIndex, e, fieldValue.noOrPercentageUpdated.attribute)}
                                        name="value"
                                    />
                                    <span className='main_lab_name main_lab_name_b' data-tooltip-id="my-tooltip" data-tooltip-content={"The target value represents the requirement for achieving 100% completion of the goal."}>{fieldValue.noOrPercentage?.value || 0}</span>
                                </div>
                                <span className='performance_error_content'>{fieldValue.target.error}</span>
                            </>
                        )}
                        {fieldValue.target.type === "percentage" && (
                            <>
                                <div className='inn_input_field'>
                                    <span className='main_lab_name main_lab_name_f'>Target</span>
                                    <input
                                        type="number"
                                        value={fieldValue.noOrPercentageUpdated?.value || ''}
                                        disabled={fieldValue.status.value === "closed" || fieldValue.isSave.value === false || fieldValue.isAdmin.value === true}
                                        onChange={(e) => handleFieldChange(index, subinnersectionIndex, subinnerfieldIndex, e, fieldValue.noOrPercentageUpdated.attribute)}
                                        name="value"
                                    />
                                    <span className='main_lab_name main_lab_name_b' data-tooltip-id="my-tooltip" data-tooltip-content={"The target value represents the requirement for achieving 100% completion of the goal."}>{fieldValue.noOrPercentage?.value || 0}%</span>
                                </div>
                                <span className='performance_error_content'>{fieldValue.target.error}</span>
                            </>
                        )}
                        {fieldValue.refreshUrl.attribute === "refreshUrl" && (
                            <>
                                <div className='inn_input_field url_field'>
                                    <span className='main_lab_name main_lab_name_f'>URL :</span>
                                    <Link className='refresh_url_va' target='_blank' href={fieldValue.refreshUrl?.value || ''}>{fieldValue.refreshUrl?.value || ''}</Link>
                                </div>
                                <span className='performance_error_content'>{fieldValue.refreshUrl.error}</span>
                            </>
                        )}
                    </div>
                    {/* Self Rating */}
                    {fieldValue.selfRating.attribute === "selfRating" && (
                        <>
                            <div className={`rating_star_input ${fieldValue.selfRating?.readonly || fieldValue.status.value === "closed" ? 'disabled' : ''}`}>
                                <span className='main_lab_name main_lab_name_f'>{fieldValue.isAdmin.value === true ? (<>Rating</>) : (<>Self Rating</>)}</span>
                                <span className='rating_starnput'>
                                    <Rating
                                        initialRating={fieldValue.selfRating?.value}
                                        onChange={(rating) => handleFieldChange(index, subinnersectionIndex, subinnerfieldIndex, { target: { value: rating } }, fieldValue.selfRating.attribute)}
                                        emptySymbol={<FaRegStar className='sk-rating-empty' />}
                                        fullSymbol={<FaStar />}
                                        fractions={2}
                                        stop={5}
                                        readonly={fieldValue.selfRating?.readonly || fieldValue.status.value === "closed"}
                                    />
                                </span>
                            </div>
                            <span className='performance_error_content'>{fieldValue.selfRating.error}</span>
                        </>
                    )}
                    {/* Reviewer Rating */}
                    {/* Mark as Closed */}
                    {fieldValue.markAsClosed.attribute !== undefined && (
                        <div className='label_rad'>
                            <span className='main_lab_name main_lab_name_f'>Mark as Closed:</span>
                            <span className='checkbox-wrapper-19'>
                                <input
                                    type='checkbox'
                                    disabled={fieldValue.status.value === "closed" || fieldValue.isSave.value === false}
                                    id={`cbtest-${subinnerfieldIndex}`}
                                    checked={fieldValue.markAsClosed?.value === true}
                                    onChange={(e) => handleFieldChange(index, subinnersectionIndex, subinnerfieldIndex, e, fieldValue.markAsClosed.attribute)}
                                />
                                <label htmlFor={`cbtest-${subinnerfieldIndex}`} className='check-box' />
                            </span>
                        </div>
                    )}
                    <div className='label_rad status_box_all_in'>
                        <span className='main_lab_name main_lab_name_f'>Status:</span>
                        {fieldValue.isSelfRatingDone.attribute && (
                            <>
                                {fieldValue.isSelfRatingDone.value === "close" ? (
                                    <div data-tooltip-id="my-tooltip" data-tooltip-content={"Goal closed by self"} className={`status_refl_box ${fieldValue.isSelfRatingDone.value}`}></div>
                                ) : (
                                    <div data-tooltip-id="my-tooltip" data-tooltip-content={"Goal submission pending by self"} className={`status_refl_box ${fieldValue.isSelfRatingDone.value}`}></div>
                                )}
                            </>
                        )}
                        {fieldValue.isAsignReviewerRatingDone.attribute && (
                            <>
                                {fieldValue.isAsignReviewerRatingDone.value === "close" ? (
                                    <div data-tooltip-id="my-tooltip" data-tooltip-content={"Goal closed by Additional Reviewer"} className={`status_refl_box ${fieldValue.isAsignReviewerRatingDone.value}`}></div>
                                ) : (
                                    <div data-tooltip-id="my-tooltip" data-tooltip-content={"Goal submission pending by Additional Reviewer"} className={`status_refl_box ${fieldValue.isAsignReviewerRatingDone.value}`}></div>
                                )}
                            </>
                        )}
                        {fieldValue.isReviewerRatingDone.attribute && (
                            <>
                                {fieldValue.isReviewerRatingDone.value === "close" ? (
                                    <div data-tooltip-id="my-tooltip" data-tooltip-content={"Goal closed by Reviewer"} className={`status_refl_box ${fieldValue.isReviewerRatingDone.value}`}></div>
                                ) : (
                                    <div data-tooltip-id="my-tooltip" data-tooltip-content={"Goal submission pending by Reviewer"} className={`status_refl_box ${fieldValue.isReviewerRatingDone.value}`}></div>
                                )}
                            </>
                        )}
                        {fieldValue.isApproverRatingDone.attribute && (
                            <>
                                {fieldValue.isApproverRatingDone.value === "close" ? (
                                    <div data-tooltip-id="my-tooltip" data-tooltip-content={"Goal closed by Approver"} className={`status_refl_box ${fieldValue.isApproverRatingDone.value}`}></div>
                                ) : (
                                    <div data-tooltip-id="my-tooltip" data-tooltip-content={"Goal submission pending by Approver"} className={`status_refl_box ${fieldValue.isApproverRatingDone.value}`}></div>
                                )}
                            </>
                        )}
                    </div>

                </div>
            </div>
            <div className='col-lg-4 col-md-6  box_f_second  '>
                <div className='box-all_field'>
                    {fieldValue.goalScore.attribute === "goalScore" && (
                        <span className='retrive_percentage_goal' data-tooltip-id="my-tooltip" data-tooltip-content={"This signifies the weight assigned to a goal, indicating its relative importance among various objectives."}>{fieldValue.goalScore.value}</span>
                    )}
                    {fieldValue.filePaths.attribute === "filePaths" && (
                        <>
                            <div className='main_lab_name_input_file'>Goal Details</div>
                            <div className='ck-content'>
                                <div dangerouslySetInnerHTML={{ __html: fieldValue.goalDetails.value }} />
                            </div>
                            <div className="files custom_file_field_b">
                                <Files
                                    className='files-dropzone'
                                    onChange={(files) => handleFileChange(files, fieldValue.idGoal.value, index, subinnersectionIndex, subinnerfieldIndex, fieldValue.filePaths.attribute)}
                                    accepts={['image/png', 'image/jpg', 'image/jpeg', 'image/webp', '.pdf', '.doc', '.docx']}
                                    multiple
                                    maxFileSize={3000000}
                                    minFileSize={0}
                                    clickable={fieldValue.status.value !== "closed" && fieldValue.isSave.value !== false}>
                                    <FiUpload /> Drag & Drop your files or <span className="filepond--label-action">Browse</span>
                                    {fieldValue.filePaths.loader === "uploading" ? (
                                        <span className='fileupload-pending'>
                                            <img src="/assets/img/upload-p.gif" alt="upload" />
                                        </span>
                                    ) : fieldValue.filePaths.loader === "uploaded" ? (
                                        <span className='fileupload-check'>
                                            <FaRegCheckCircle />
                                        </span>
                                    ) : null}
                                </Files>
                            </div>
                            {fieldValue.filePaths.value && fieldValue.filePaths.value.length > 0 ? (
                                <div className='file_table_data_f'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className='f_h'>Title</th>
                                                <th className='d_h'>Dl</th>
                                                <th className='s_h'>Info</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fieldValue.filePaths.value.map((file, index) => (
                                                <tr className='bottom_table_line' key={file.fileName}>
                                                    <td className='name_ic'>
                                                        <div className='highlight_t_s'>{file.submitDate}</div>
                                                        <div>{file.fileName}</div>
                                                    </td>
                                                    <td className='svg_ic'>
                                                        <Link href={file.filePath.startsWith('https') ? file.filePath : `${baseImageUrl}/${file.filePath}`} download>
                                                            <MdDownload />
                                                        </Link>
                                                    </td>
                                                    <td className='type_ic'><div>{file.fileExtenstion}</div><div>({file.fileSize})</div></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (null)}
                        </>
                    )}
                </div>
            </div>
            <div className='col-lg-4 col-md-6 box_f_third '>
                {fieldValue.isDeleted.value?<div className='peformormace-delete-btn' onClick={() => onDeleteClick(fieldValue)} ><RiDeleteBinLine data-tooltip-id="my-tooltip-perform" data-tooltip-content={"Delete Goal"}/></div>:null}
                <div className='box-all_field'>
                    <span className={`goal_status_btn only_desktop_perform status_btn_per_${fieldValue.status.value === "open" ? 'open' : 'close'}`} data-tooltip-id="my-tooltip" data-tooltip-content={fieldValue.status.value}></span>
                    {fieldValue.comments.attribute === "comments" && (
                        <div className='inn_input_field texa-m-r'>
                            <div className='main_lab_name_textarea'>Comments</div>
                            <textarea
                                type="text"
                                disabled={fieldValue.status.value === "closed" || fieldValue.isSave.value === false}
                                value={fieldValue.comments?.changeValue || ''}
                                onChange={(e) => handleFieldChange(index, subinnersectionIndex, subinnerfieldIndex, e, fieldValue.comments.attribute)}
                                name="value"
                            />
                            <span className='performance_error_content'> {fieldValue.comments.error}</span>
                        </div>
                    )}

                    {fieldValue.status.value === "open" ? (
                        <>
                            {fieldValue.isSave.value === true ? (
                                <>
                                    {fieldValue.comments?.changeValue !== "" ? (
                                        <div className="text-end w-100">
                                            <button type="submit" onClick={(e) => handleGoalSubmit(index, subinnersectionIndex, subinnerfieldIndex)} className="btn btn-performance s-btn-perform">Save</button>
                                        </div>
                                    ) : (null)}
                                </>
                            ) : (null)}
                        </>
                    ) : (null)}
                    {fieldValue.selfComments.attribute === "selfComments" && (
                        <div className='texa-m-r'>
                            {fieldValue.selfComments.value && fieldValue.selfComments.value.length > 0 ? (
                                <>
                                    <div className="main_lab_name_textarea">Self Comment</div>
                                    <div className='inn_input_field_self'>
                                        {fieldValue.selfComments.value.map((comment, index) => (
                                            <div key={index} className='comment_area_box_area'>
                                                <div className='comment_area_b'>{comment.comment}</div>
                                                <div className='comment_bottom_info'>
                                                    <span className='c_info_detail'>Posted on <b>{comment.postOn}</b> by <b>{comment.postBy}</b></span>
                                                    <span className='c_rate_detail'>
                                                        {comment.rating ?
                                                            <Rating
                                                                initialRating={comment.rating}
                                                                emptySymbol={<FaRegStar className='sk-rating-empty' />}
                                                                fullSymbol={<FaStar />}
                                                                fractions={2}
                                                                stop={5}
                                                                readonly={true}
                                                            /> : null}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (null)}
                        </div>
                    )}
                </div>
            </div>
            <Tooltip id="my-tooltip-perform" style={{ maxWidth: "300px", backgroundColor: "#7030a0", background: "#7030a0" }} />
        </div>
    );
};

export default FieldRenderer;