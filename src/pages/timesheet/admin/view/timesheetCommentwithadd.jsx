import { useState, useEffect, useRef, useMemo, useCallback  } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import { format } from "date-fns";
import Drawer from 'react-modern-drawer'
import Avatar from 'react-avatar';
import { Tooltip } from "react-tooltip";
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";


const TimesheetCommentWithAdd = ({ isOpen, closeModal, SubTaskInfo, mentionUser }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const editorWrapperRef = useRef(null);
  const [CKEditor, setCKEditor] = useState(null);
  const [Editor, setEditor] = useState(null);


  useEffect(() => {
    const loadEditor = async () => {
      const ckeditorModule = await import("@ckeditor/ckeditor5-react");
      const editorModule = await import("ckeditor5-custom-build");

      setCKEditor(() => ckeditorModule.CKEditor);
      setEditor(() => editorModule.default);
    };

    loadEditor();
  }, []);
  const [textData, settextData] = useState("");
  const [useid, setuseid] = useState([]);
  const [editorSize, setEditorSize] = useState("small");
  const [errorMessage, setErrorMessage] = useState('');
  const handleInputChange = (data) => {
    setErrorMessage("");
    settextData(data);
  };
  const [showButton, setShowButton] = useState(true);
 const users = useMemo(() => {
  return mentionUser || [];
}, [mentionUser]);

  useEffect(() => {
    const updatedData = textData.replace(
      /<span class="mention" data-mention="(@\S+)">@\S+<\/span>/g,
      (match, mentionId) => {
        const user = users.find(item => `@${item.id}` === mentionId);
        if (user) {
          if (!useid.includes(user.id)) {
            setuseid(prevState => [...prevState, user.id]);
          }
          return `<span class="mention" data-mention="@${user.id}"><a href="/employeeDashboard/${user.id}" target="_blank">@${user.name}</a></span>`;
        }

        return match;
      }
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    settextData(updatedData);
  }, [textData, users, useid]);



  const feedItems = useMemo(() => {
    return users.map(user => ({
      id: user.id.toString(),
      name: user.name,
      image: user.image || "/assets/img/emp.png",
      qualification: user.qualification,
    }));
  }, [users]);



  function createCustomItem(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('custom-item-for-mention');

    const rowElement = document.createElement('div');
    rowElement.classList.add('mention_main');

    const col1Element = document.createElement('div');
    col1Element.classList.add('mention_img_section');

    const col2Element = document.createElement('div');
    col2Element.classList.add('mention_content_section');

    const imageElement = document.createElement('img');
    imageElement.src = item.avatar;
    imageElement.classList.add('custom-item-image');

    const nameElement = document.createElement('span');
    nameElement.classList.add('custom-item-name');
    nameElement.textContent = item.text;

    const qualificationElement = document.createElement('div');
    qualificationElement.classList.add('custom-item-qualification');
    qualificationElement.textContent = item.qualification;

    col1Element.appendChild(imageElement);
    col2Element.appendChild(nameElement);
    col2Element.appendChild(qualificationElement);

    rowElement.appendChild(col1Element);
    rowElement.appendChild(col2Element);

    itemElement.appendChild(rowElement);
    return itemElement;
  }
  // Updated editor configuration
  const editorConfig = useMemo(() => ({
    licenseKey: "GPL",

    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'alignment',
        'bulletedList', // Add this for bulleted list
        'numberedList', // Add this for numbered list
        '|',
        'link',
        'insertTable',
        'highlight',
        'blockQuote',
        '|',
        'outdent',
        'indent',
        'imageUpload',  // Add image upload to the toolbar
      ],
    },

    mention: {
      feeds: [
        {
          marker: "@",
          minimumCharacters: 0,
          feed: (queryText) => {
            const search = queryText.toLowerCase();

            return feedItems
              .filter(item =>
                item.name.toLowerCase().includes(search)
              )
              .map(item => ({
                id: `@${item.id}`,
                text: item.name,
                name: item.name,
                avatar: item.image,
                qualification: item.qualification,
              }));
          },
          itemRenderer: createCustomItem,
        },
      ],
    },

    placeholder:
      "Write a comment... Use @ to mention a teammate",
  }), [feedItems]);



  const handleEditorFocus = () => {
    setEditorSize("large");
  };
  const handleClickOutside = (event) => {
    if (
      editorWrapperRef.current &&
      !editorWrapperRef.current.contains(event.target)
    ) {
      setEditorSize("small");
    }
  };

  // Add event listener when component mounts
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [SubTask, setSubTask] = useState({});
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return Number.isNaN(d) ? "" : format(d, "dd MMM yyyy");
  };
const getCommentDetails = useCallback(async (id) => {
  try {
    const response = await axiosJWT.get(
      `${apiUrl}/timesheet/getSubTaskInfoWithComments`,
      {
        params: {
          idSubTask: id,
        },
      }
    );

    if (response?.data?.data) {
      setSubTask(response?.data?.data);
    }
  } catch (error) {
    console.error(
      "Error occurred while fetching attendance details:",
      error
    );
  }
}, [apiUrl]);
  const handleSubmit = async () => {
    if (textData === "") {
      setErrorMessage("comments value is required.");
      return;
    }

    if (textData.length < 20) {
      setErrorMessage("comments value Minimum 20 characters.");
      return;
    }
    setShowButton(false)

    const payload = {
      id: null,
      idSubTask: SubTaskInfo,
      comment: textData,
      userid: useid,
      event: "add"
    }
    try {
      const response = await axiosJWT.post(`${apiUrl}/timesheet/addorUpdateComment`, payload);

      if (response) {
        setShowButton(true)
        getCommentDetails(SubTaskInfo)
        settextData("")
        setTimeout(() => {
          getCommentDetails(SubTaskInfo)
        }, 1000);
      }
    } catch (error) {
      setShowButton(true)
      console.error(error)
    }
  };
  useEffect(() => {
    if (isOpen) {
      if (SubTaskInfo) {
        const fetchData = async () => {
          await getCommentDetails(SubTaskInfo);
        };

        fetchData();

      }
      document.body.classList.add("hide-body-scroll");
    } else {
      document.body.classList.remove("hide-body-scroll");
    }
  }, [isOpen, SubTaskInfo, getCommentDetails]);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editTextData, setEditTextData] = useState("");
  const handleEditSubmit = async (commentId) => {
    if (editTextData === "") {
      return;
    }
    const payload = {
      id: commentId,
      idSubTask: SubTaskInfo,
      comment: editTextData,
      userid: useid,
      event: "edit"
    };
    try {
      const response = await axiosJWT.post(`${apiUrl}/timesheet/addorUpdateComment`, payload);
      if (response) {
        setEditingCommentId(null);
        setEditTextData("");
        getCommentDetails(SubTaskInfo);
        setTimeout(() => getCommentDetails(SubTaskInfo), 1000);
      }
    } catch (error) { console.error(error) }
  };
  const handleImageUpload = async (file) => {
    setShowButton(false)
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await axiosJWT.post(`${apiUrl}/automationIdea/uploadFile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });


      if (response) {
        setShowButton(true)
        const imageUrl = response.data.data[0].url; // Access the first item in the data array
        return imageUrl;
      }
    } catch (error) {
      console.error("Error occurred during image upload:", error);
    }
  };
  const title = SubTask?.taskName || "";

  const isLongTitle = title.length > 65;
  const rawHtml = SubTask?.description || "";

  // Convert HTML to plain text
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = rawHtml;
  const plainText = tempDiv.textContent || tempDiv.innerText || "";

  const isLong = plainText.length > 150;

  const editEditorRef = useRef(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const handleDelete = async () => {
    if (!deleteCommentId) return;

    const payload = {
      id: deleteCommentId,
      idSubTask: SubTaskInfo,
      event: "delete"
    };

    try {
      await axiosJWT.post(`${apiUrl}/timesheet/addorUpdateComment`, payload);

      setDeleteCommentId(null);
      getCommentDetails(SubTaskInfo);

      setTimeout(() => getCommentDetails(SubTaskInfo), 1000);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  if (!CKEditor || !Editor) {
    return <div>Loading editor...</div>;
  }
  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay'
    >
      {deleteCommentId && (
        <div className="delete-popup">
          <div className="delete-box">
            <p>Are you sure you want to delete this comment?</p>

            <div className="delete-actions">
              <button
                className="btn-r btn-cancel-r"
                onClick={() => setDeleteCommentId(null)}
              >
                Cancel
              </button>

              <button
                className="btn-r btn-primary-r"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-body">
            <div className="main-view-box-opportunity">
              <div className="drawer-container" >
                <div className="drawer-header" style={{ padding: '0px' }}>
                  <h5 className="task-title">
                    {isLongTitle ? (
                      <>
                        {title.slice(0, 65)}
                        <span
                          data-tooltip-id="desc-tooltip-dr"
                          data-tooltip-content={title}
                          style={{ cursor: "pointer", color: "#888" }}
                        >
                          ...
                        </span>
                      </>
                    ) : (
                      title
                    )}
                  </h5>
                  <div className={`o-x-t-s oxyem-mark-${SubTask?.status}`}>
                    {SubTask?.status}
                  </div>
                  <button className="close-btn" onClick={closeModal}>
                    <MdClose />
                  </button>
                </div>
                <div className="drawer-body">
                  <div className="task-meta">
                    <p style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <span className="subtask-code">{SubTask?.generatedSubTaskCode}</span>
                      <span style={{ fontSize: '.75rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', marginRight: '5px' }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        {formatDate(SubTask?.startDate)} - {formatDate(SubTask?.endDate)}</span>
                    </p>
                    <p>

                    </p>
                    <div className="section" style={{ display: 'flex', alignItems: 'center' }}>
                      <h6 style={{ marginRight: '10px', marginBottom: 0 }}>Assignee</h6>
                      <div className="avatar-group">
                        <div className="avatar-item">
                          <Avatar
                            src={SubTask?.assignedTo?.ProfilePic}
                            name={SubTask?.assignedTo?.employeeName}
                            size="28"
                            round
                            textSizeRatio={2}
                          /><span className="mx-2">{SubTask?.assignedTo?.employeeName}</span>
                        </div>

                      </div>
                    </div>
                    <div className="desc  ck-content">
                      <div className="desc ck-content">
                        {isLong ? (
                          <>
                            {plainText.slice(0, 150)}
                            <span
                              data-tooltip-id={`desc-tooltip-${SubTask?.id}`}
                              data-tooltip-content={plainText}
                              style={{ cursor: "pointer", color: "#888" }}
                            >
                              ...
                            </span>

                            <Tooltip
                              id={`desc-tooltip-${SubTask?.id}`}
                              className="custom-tooltip-dr"
                            />
                          </>
                        ) : (
                          plainText
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="section">
                    <h6>Comments & Discussion</h6>
                    <div ref={editorWrapperRef} className={`modal-note-top-section ${editorSize === "large" ? "expand_size_editor" : "expand_size_editor"}`}>
                      {CKEditor && Editor ? (
                        <div className="">
                          <CKEditor
                            editor={Editor}
                            data={textData}
                            config={editorConfig}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              handleInputChange(data);
                            }}
                            onReady={(editor) => {
                              editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                                return {
                                  upload: async () => {
                                    const file = await loader.file;
                                    const imageUrl = await handleImageUpload(file);
                                    return { default: imageUrl };
                                  },
                                };
                              };
                            }}
                            onFocus={handleEditorFocus}
                          />
                          {errorMessage && <span className="error mt-2 d-block">{errorMessage}</span>}
                        </div>
                      ) : (null)}
                    </div>
                    {showButton ? (
                      <div style={{ marginTop: 15, textAlign: 'end', marginBottom: 10 }}>
                        <button className={`btn-r btn-primary-r`} onClick={handleSubmit}>Add Comment</button>
                      </div>
                    ) : (null)}
                    {SubTask?.comments?.length > 0 ? (
                      SubTask.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="user"><Avatar name={comment?.user?.name} src={comment?.user?.ProfilePic} size="28" round textSizeRatio={2} />{comment?.user?.name}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                                <span className="date">{formatDate(comment.date)}</span>
                                <button
                                  className="edit-comment-btn"
                                  style={{ marginLeft: 10 }}
                                  onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditTextData(comment?.description || "");
                                  }}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="edit-comment-btn de-co"
                                  onClick={() => {
                                    setDeleteCommentId(comment.id);
                                  }}
                                >
                                  <RiDeleteBinLine />
                                </button>
                              </div>
                            </div>

                            {editingCommentId === comment.id && CKEditor && Editor ? (
                              <div className="edit-editor-wrapper" style={{ marginTop: 8 }}>
                                <CKEditor
                                  key={`edit-${comment.id}`}
                                  editor={Editor}
                                  data={editTextData}
                                  config={editorConfig}
                                  onReady={(editor) => {
                                    // ✅ Save reference
                                    editEditorRef.current = editor;

                                    // ✅ Image upload adapter
                                    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                                      return {
                                        upload: async () => {
                                          const file = await loader.file;
                                          const imageUrl = await handleImageUpload(file);
                                          return { default: imageUrl };
                                        },
                                      };
                                    };

                                    // ✅ Auto focus
                                    setTimeout(() => {
                                      editor.editing.view.focus();
                                    }, 0);
                                  }}
                                  onChange={(event, editor) => {
                                    setEditTextData(editor.getData());
                                  }}
                                  onFocus={handleEditorFocus}
                                />
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                                  <button
                                    className="btn-r btn-cancel-r"
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditTextData("");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="btn-r btn-primary-r"
                                    onClick={() => handleEditSubmit(comment.id)}
                                  >
                                    Update
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="ck-content">

                                <div style={{ fontSize: '.75rem' }}
                                  dangerouslySetInnerHTML={{ __html: comment?.description }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No comments available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
.drawer-container {padding: 25px 5px;}
.drawer-header{top:auto;}
.drawer-header {position: relative;border-bottom: 1px dotted #ccc; margin-bottom: 15px}
.task-title {font-size: 1.1rem; font-weight: 600; color: #1f2937;  width: 80%; line-height: 1.4;}
.close-btn {position: absolute; right: -10px; top: -40px; border: none; background: transparent; font-size: 1.4rem; cursor: pointer;}
.o-x-t-s{position: absolute; top: 0; right: 0px;}
.drawer-body {font-size: 14px;}
.task-meta p {margin-bottom: 10px; font-size: 0.85rem;}
.desc {color: #6b7280; margin-top: 8px;}
.section {margin-top: 18px;}
.section h6 {font-size: 14px; font-weight: 600; margin-bottom: 10px;}
.avatar-group { display: flex; gap: 8px;}
.comment-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9;}
.comment-content { flex: 1;}
.comment-header {display: flex; justify-content: space-between; font-size: 13px;}
.comment-header .user {font-weight: 600; color: #111827;}
.comment-header .date {color: #9ca3af; font-size: 12px;}
.avatar-group {display: flex; align-items: center;}
.avatar-item {margin-left: -15px; border: 2px solid #fff; border-radius: 50%;}
.avatar-item:first-child { margin-left: 0;}
p.no-comments {
    font-size: .8rem;
    color: gray;
    text-align: center;
    padding: 10px;
    border: 1px solid #e9e8e8;
    border-radius: .375rem;
    margin-top: 10px;
}
    .btn-r{
	font-size: .65rem;
    padding:6px 15px;
        border-radius: .375rem;
    color: #fff;
}
    .btn-primary-r{
	background-color:#004D95;
    border: #004D95;
	border:1px solid #004D95;
}
  .btn-primary-r:hover{
	background-color: #0056A1;
    border: 1px solid #0056A1;
}
.btn-primary-r:active{
	background-color: #0056A1 !important;
    border: 1px solid #0056A1 !important;
}
.btn-primary-r:focus-visible{
	background-color: #0056A1 !important;
    border: 1px solid #0056A1 !important;
	box-shadow:var(--theme-box-shadow) !important;
}
  button.edit-comment-btn {
    border: none;
    background: none;
}
    button.edit-comment-btn svg{
    font-size:1rem;
}
    .de-co svg{
    color:red;}
    .delete-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.delete-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.delete-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}
  .comment-content {
    width: stretch;
}
.btn-cancel-r{
    border: 1px solid #004D95;
    color: #004D95;
        background: transparent;
}
.btn-cancel-r:hover {
    background-color: #004D95 !important;
    border: 1px solid #004D95;
    color: #fff;
}
  .ck-balloon-panel{z-index: 999999 !important;}
    .expand_size_editor .ck-editor__editable {height: auto !important;transition: none !important; min-height:100px !important; max-height:250px !important;}
    .expand_size_editor .ck-reset_all{transition: none !important;}
    .ck-toolbar__items, .ck-placeholder{font-size: .7rem !important;}
    .ck-content p{margin: .275rem 0 !important; font-size: .75rem;}
.avatar-more { margin-left: -15px; width: 38px; height: 38px; background: #e5e7eb; color: #111827; font-size: 12px; font-weight: 600; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff;}
.comment-content .text {margin: 4px 0;color: #374151;font-size: .75rem;
}`}
      </style>
      <Tooltip id="desc-tooltip-dr" className="custom-tooltip-dr" />
    </Drawer>
  );
};

export default TimesheetCommentWithAdd;
