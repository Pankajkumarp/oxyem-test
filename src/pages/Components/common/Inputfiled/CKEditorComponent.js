import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// Import CKEditor plugins for image handling
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
	Image,               // Image plugin
	ImageToolbar,        // Image toolbar for resizing and aligning
	ImageUpload,         // Image upload plugin
	ImageResize,         // Image resize plugin
	ImageStyle           // Image style plugin
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const MyEditor = ({ type, readonly, isDisabled, placeholder, label, value, validations = [], onChange }) => {
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

    // Updated editor configuration
    const editorConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'findAndReplace',
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
				'strikethrough',
				'code',
				'|',
				'specialCharacters',
				'horizontalLine',
				'link',
				'insertTable',
				'highlight',
				'blockQuote',
				'|',
				'alignment',
				'|',
				'outdent',
				'indent',
				'imageUpload',  // Add image upload to the toolbar
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
			Image,               // Image plugin for image handling
			ImageToolbar,        // Toolbar for image actions
			ImageUpload,         // Enables image upload functionality
			ImageResize,         // Allows resizing images
			ImageStyle,          // Adds image style options
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
		placeholder: placeholder,
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



    return (
        <>
        {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
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
        />
        </>
    );
};

export default MyEditor;
