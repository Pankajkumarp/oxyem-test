import React, { useContext, useState, useEffect, useRef, useMemo  } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization';
import Profile from '../../Components/commancomponents/profile';
import { SocketContext } from '../../Auth/Socket';


const Activity = ({ id, type }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const editorRef = useRef(null);
  const editorWrapperRef = useRef(null);
    const CKEditor = editorRef.current?.CKEditor;
const Editor = editorRef.current?.Editor;

    useEffect(() => {
      editorRef.current = {
        CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
        Editor: require("ckeditor5-custom-build")
      };
    }, []);
    const [editorLoaded, setEditorLoaded] = useState(false);
    useEffect(() => {
        setEditorLoaded(true);
      }, []);
  const [moduleId, setModuleId] = useState(id);
  useEffect(() => {
    setModuleId(id)
  }, [id]);
  const [textData, settextData] = useState("");
  const [useid, setuseid] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const getExistingDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/getNotes`, {
        params: {
          id: id,
        },
      });
      if (response && response.data && Object.keys(response.data.data).length > 0) {
        setCommentData(response.data.data);
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };
  const socket = useContext(SocketContext);
  useEffect(() => {
    if (id) {
      getExistingDetails(id);
    }
  }, [id]);
  const [editorSize, setEditorSize] = useState("large");
    const [errorMessage, setErrorMessage] = useState('');
    const handleInputChange = (data) => {
    setErrorMessage("");
    settextData(data);
  };
  const handleSubmit = async () => {
          if (textData === "") {
      setErrorMessage("Notes value is required.");
      return;
    }
  
    if (textData.length < 20) {
      setErrorMessage("Notes value Minimum 20 characters.");
      return; 
    }
    const payload = {
      id: id,
      type: type,
      userid: useid,
      text: textData,
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const response = await axiosJWT.post(`${apiUrl}/addNotes`, payload);

      if (response) {
        getExistingDetails(id);
        settextData("")
        setEditorSize("large")
        setTimeout(() => {
  getExistingDetails(id);
}, 1000);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    socket.on("commentAdded", (id, text) => {
      const socketid = id.id
      if (socketid === moduleId) {
        getExistingDetails(moduleId);
      }
    });
  }, [socket]);

    const [showButton, setShowButton] = useState(true);
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
  const [users, setUsers] = useState([]);
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
    settextData(updatedData);
  }, [textData, users, useid]);

  useEffect(() => {
    const fetchProfileOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": "" } })
        if (response) {
          const optionsData = response.data.data.map((item) => ({
            name: item.employeeName,
            id: item.idEmployee,
            image: item.profilePicPath ? item.profilePicPath : "",
            qualification: item.designation ? item.designation : "",
          }));
          setUsers(optionsData);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchProfileOptions();
  }, []);

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
    nameElement.textContent = item.label;

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
          return feedItems
            .filter(item =>
              item.name.toLowerCase().includes(queryText.toLowerCase())
            )
            .map(item => ({
              id: `@${item.id}`,
              label: item.name,
              avatar: item.image,
              qualification: item.qualification,
            }));
        },
        itemRenderer: createCustomItem,
      },
    ],
  },

  placeholder:
    "Add your comments or observations\nType @ to mention a teammate",
}), [feedItems]);


  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Format the date part (day, month, year)
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-GB', dateOptions); // Example: 27 Dec 2024

    // Format the time part (hours, minutes, seconds)
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      //timeZoneName: 'short', // UTC time
    };
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions); // Example: 10:58:13 AM UTC

    return `${formattedDate}, ${formattedTime}`;
  };
  const [expandedComments, setExpandedComments] = useState({});

  // Function to handle Read more toggle for each comment
  const toggleExpand = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle the specific comment's expanded state
    }));
  };
 
  const handleEditorFocus = () => {
    setEditorSize("large");
  };
const handleClickOutside = (event) => {
  if (
    editorWrapperRef.current &&
    !editorWrapperRef.current.contains(event.target)
  ) {
    setEditorSize("large");
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
  const editorKey = users.length;
  return (
        <div className="notes_content_main notes_content_activity">
          <div className="modal-body  oxyem-note-popup">
            <div className="modal-note-bottom-section">
              {commentData.map((comment) => {
                const isExpanded = expandedComments[comment.id] || false;
                const truncatedText = comment.text.slice(0, 500) + (comment.text.length > 500 ? '...' : '');

                return (
                  <div key={comment.id} className="notes_section_each">
                    <div className="profile-section-user-n">
                      <div className="img-section-user-n">
                        <Profile
                          name={comment.userName}
                          imageurl={`${comment.userProfilePic}`}
                          size={"32"}
                          profilelink={`/employeeDashboard/${comment.idEmployee}`}
                        />
                      </div>
                      <div className="text-section-user-n">
                        <h2>{comment.userName}</h2>
                        <p>{formatDateTime(comment.CreatedDate)}</p>
                      </div>
                    </div>
                    <div className="maincontent-section-user-n  ck-content">
                      <div className="txt"
                        dangerouslySetInnerHTML={{
                          __html: isExpanded ? comment.text : truncatedText,
                        }}
                      ></div>
                      {comment.text.length > 500 && (
                        <button
                          onClick={() => toggleExpand(comment.id)}
                          className="read-more-btn-n"
                        >
                          {isExpanded ? 'Read less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
		  <div ref={editorWrapperRef} className={`modal-note-top-section  ${editorSize === "large" ? "expand_size_editor" : "reduce_size_editor"}`}>
              {editorLoaded && editorLoaded ? (
                <>
                  <CKEditor
                  key={editorKey}
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
                </>
              ) : (null)}
            </div>
			 {showButton ?(
                <button className={`btn btn-primary activity-button-c-3 mt-3`} onClick={handleSubmit}>Save</button>
            ):(null)}
        </div>
  );
};

export default Activity;
