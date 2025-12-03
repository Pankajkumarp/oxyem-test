// components/CKEditor.js
import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
const MyEditor = ({ type, readonly, isDisabled, placeholder, label, value, validations = [], onChange }) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    const isRequired = validations.some(validation => validation.type === "required");

    const [textData, settextData] = useState(value);
    useEffect(() => {
      // Synchronize internal state with props
      settextData(value);
    }, [value]);
    
    const handleInputChange = (data) => {
        settextData(data);
        onChange(data);
    };

    const userid = "0990f32f-ab18-4e2b-8c1c-9f2d50400a90"

    const handleImageUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('idEmployee', userid);

        try {
            const response = await axiosJWT.post(`${apiBaseUrl}/employees/uploadProfilePic`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.status === 200) {
                const imageUrl = "http://hghhgm"
                return imageUrl;
            }
        } catch (error) {
            console.error("Error occurred during image upload:", error);
        }
    };
    const editorConfiguration = {
        placeholder: placeholder,
        height: 500,
        toolbar: [
            'heading',
            'SimpleBox',
            '|',
            'bold',
            'italic',
            'fontColor', // Add font color option
            'fontSize',   // Add font size option
            'fontBackgroundColor',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            // Add html embed button
            'undo',
            'redo',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            'codeBlock', // Add code block button
            //'htmlEmbed',
            'outdent',
            'indent',

        ],



    };
    return (
        <>
        {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
        <CKEditor
            editor={ClassicEditor}
            data={textData}
            config={editorConfiguration}
            onChange={(event, editor) => {
                const data = editor.getData();
                handleInputChange(data)
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
        </>
    );
};

export default MyEditor;
