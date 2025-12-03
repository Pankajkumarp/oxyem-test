import React, { useContext, useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { axiosJWT } from '../../Auth/AddAuthorization';
import Profile from '../commancomponents/profile';
import { SocketContext } from '../../Auth/Socket';

import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoLink,
  Autosave,
  BlockQuote,
  Bold,
  Code,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  bulletedList,
  List,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Mention,
  Paragraph,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  Undo,
  Image,
  ImageToolbar,
  ImageUpload,
  ImageResize,
  ImageStyle
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

const Notes = ({ isOpen, closeModal, id, type }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const editorRef = useRef(null);
  const [opportunityId, setOpportunity] = useState(id);
  useEffect(() => {
    setOpportunity(id)
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
    if (isOpen) {
      getExistingDetails(id);
    }
  }, [isOpen, id]);
  const [editorSize, setEditorSize] = useState("small");
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
        //getExistingDetails(id);
        settextData("")
        setEditorSize("small")
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    socket.on("commentAdded", (id, text) => {
      const socketid = id.id
      if (socketid === opportunityId) {
        getExistingDetails(opportunityId);
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
  const [showEditor, setshowEditor] = useState(false);
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
          setshowEditor(true)
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchProfileOptions();
  }, []);

  const feedItems = users.map((user) => ({
    id: user.id,
    name: user.name,
    image: user.image || '/assets/img/emp.png',
    qualification: user.qualification
  }));

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
  const editorConfig = {
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
        'code',
        '|',
        'horizontalLine',
        'link',
        'insertTable',
        'highlight',
        'blockQuote',
        '|',
        'alignment',
        'List',
        'bulletedList', // Add this for bulleted list
        'numberedList', // Add this for numbered list
        '|',
        'outdent',
        'indent',
        'imageUpload',  // Add image upload to the toolbar
      ],
      shouldNotGroupWhenFull: false
    },
    mention: {
      feeds: [
        {
          marker: '@',
          feed: (queryText) => {
            // Filter the feed items based on the search query
            return feedItems
              .filter(item => item.name.toLowerCase().includes(queryText.toLowerCase()))
              .map(item => {
                return {
                  id: '@' + item.id, // Prefix with '@' to make it work with CKEditor
                  label: item.name,
                  avatar: item.image || 'path/to/default-avatar.png', // Optional: Default avatar if not present
                  qualification: item.qualification || '', // Optional: Qualification information
                };
              });
          },
          itemRenderer: (item) => createCustomItem(item), // Use custom item renderer
        },
      ],
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoLink,
      Autosave,
      BlockQuote,
      Bold,
      Code,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      Indent,
      IndentBlock,
      Italic,
      List,
      Link,
      Paragraph,
      RemoveFormat,
      SelectAll,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      Underline,
      Undo,
      Image,               // Image plugin for image handling
      ImageToolbar,        // Toolbar for image actions
      ImageUpload,         // Enables image upload functionality
      ImageResize,         // Allows resizing images
      ImageStyle,          // Adds image style options
      Mention,
    ],
    fontFamily: {
      supportAllValues: true
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22, 24],
      supportAllValues: true
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph'
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1'
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2'
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3'
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4'
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5'
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6'
        }
      ]
    },
    style: {
      definitions: [
        {
          name: 'Article category',
          element: 'h3',
          classes: ['category']
        },
        {
          name: 'Title',
          element: 'h2',
          classes: ['document-title']
        },
        {
          name: 'Subtitle',
          element: 'h3',
          classes: ['document-subtitle']
        },
        {
          name: 'Info box',
          element: 'p',
          classes: ['info-box']
        },
        {
          name: 'Side quote',
          element: 'blockquote',
          classes: ['side-quote']
        },
        {
          name: 'Marker',
          element: 'span',
          classes: ['marker']
        },
        {
          name: 'Spoiler',
          element: 'span',
          classes: ['spoiler']
        },
        {
          name: 'Code (dark)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-dark']
        },
        {
          name: 'Code (bright)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-bright']
        }
      ]
    },
    placeholder: "Add your comments or observations\nType @ to mention a teammate and notify them about this notes",
    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'imageTextAlternative',
        'imageResize'    // Add resizing option in the toolbar
      ]
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    }
  };

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
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      setEditorSize("small");  // Set editor size to "small" when clicked outside
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
  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay'
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content notes_content_main">
          <div className="modal-header mb-2 notes_header drawer-header ">
            <h4 className="modal-title" id="myLargeModalLabel"> Add Notes</h4>
			{showButton ?(
				<button className={`btn btn-primary notes_header_btn`} onClick={handleSubmit}>Save</button>
			):(null)}	
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body  oxyem-note-popup">
            <div className={`modal-note-top-section ${editorSize === "large" ? "expand_size_editor" : "reduce_size_editor"}`}>
              {showEditor ? (
                <div className="" ref={editorRef}>
                  <CKEditor
                    editor={ClassicEditor}
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
                          imageurl={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${comment.profilePicPath}`}
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
        </div>
      </div>
    </Drawer>
  );
};

export default Notes;
