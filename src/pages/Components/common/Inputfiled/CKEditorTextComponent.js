import React, { useState, useEffect, useRef  } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
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
	List,  // List plugin for handling ordered and unordered lists
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const CKEditorTextComponent = ({ type, readonly, isDisabled, placeholder, label, value, validations = [], onChange }) => {
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

    const userid = "0990f32f-ab18-4e2b-8c1c-9f2d50400a90";

    const handleImageUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('files', file);
        
		console.log(formData);

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

    // Updated editor configuration without image support
    const editorConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'bold',
				'italic',
				'underline',
				'|',
				'numberedList',
				'bulletedList',
			],
			shouldNotGroupWhenFull: false
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
			List,                // List plugin to manage lists
		],
		fontFamily: {
			supportAllValues: false
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22, 24],
			supportAllValues: true
		},
		placeholder: placeholder,
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		}
	};

	const editorRef = useRef(null); 
	useEffect(() => {
		const editor = editorRef.current;
		const lockId = 'manual-readonly-lock';

		if (editor) {
			if (isDisabled) {
				editor.enableReadOnlyMode(lockId);
			} else {
				editor.disableReadOnlyMode(lockId);
			}
		}
	}, [isDisabled]);
  
    return (
        <>
        {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
        <CKEditor
            editor={ClassicEditor}
            data={textData}
            config={editorConfig}
			onReady={(editor) => {
				editorRef.current = editor;
				const lockId = 'manual-readonly-lock';
				if (readonly || isDisabled) {
					editor.enableReadOnlyMode(lockId);
				}
			}}
            onChange={(event, editor) => {
                const data = editor.getData();
                handleInputChange(data);
            }}
        />
        </>
    );
};

export default CKEditorTextComponent;
