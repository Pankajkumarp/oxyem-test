/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable react-hooks/refs */
import React, { useState, useEffect, useRef } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';


const MyEditor = ({ placeholder, label, value, validations = [], onChange }) => {

	  const editorRef = useRef(null);
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
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const isRequired = validations.some(validation => validation.type === "required");

    const [textData, settextData] = useState(value);
    useEffect(() => {
      settextData(value);
    }, [value]);

    const handleInputChange = (data) => {
        settextData(data);
        onChange(data);
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('files', file);
        try {
            const response = await axiosJWT.post(`${apiBaseUrl}/automationIdea/uploadFile`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

			
            if (response) {
				const imageUrl = response.data.data[0].url; // Access the first item in the data array
                return imageUrl;
            }
        } catch (error) {
            console.error("Error occurred during image upload:", error);
        }
    };

    // Updated editor configuration
    const editorConfig = {
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

  placeholder:placeholder,
}



    return (
        <>
        {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
		{editorLoaded ?(
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
        />
		):(null)}
        </>
    );
};

export default MyEditor;
