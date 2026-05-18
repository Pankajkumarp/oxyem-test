import React, { useState, useEffect, useRef } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

const CKEditorTextComponent = ({
  type,
  readonly,
  isDisabled,
  placeholder,
  label,
  value,
  validations = [],
  onChange
}) => {

  // 👇 keep your existing ref (for modules)
  const editorRef = useRef(null);

  // 👇 NEW ref only for editor instance
  const editorInstanceRef = useRef(null);

  const CKEditor = editorRef.current?.CKEditor;
  const Editor = editorRef.current?.Editor;

  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("ckeditor5-custom-build")
    };
    setEditorLoaded(true);
  }, []);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isRequired = validations.some(v => v.type === "required");

  const [textData, settextData] = useState(value);

  useEffect(() => {
    settextData(value);
  }, [value]);

  const handleInputChange = (data) => {
    settextData(data);
    onChange(data);
  };

  const editorConfig = {
    licenseKey: "GPL",
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'bulletedList',
        'numberedList',
      ],
    },
    placeholder
  };

  // ✅ FIXED: readonly toggle uses editorInstanceRef
  useEffect(() => {
    const editor = editorInstanceRef.current;
    const lockId = 'manual-readonly-lock';

    if (!editor) return;

    if (isDisabled) {
      editor.enableReadOnlyMode(lockId);
    } else {
      editor.disableReadOnlyMode(lockId);
    }
  }, [isDisabled]);

  return (
    <>
      {isRequired
        ? <LabelMandatory labelText={label} />
        : <LabelNormal labelText={label} />
      }

      {editorLoaded && CKEditor && Editor ? (
        <CKEditor
          editor={Editor}
          data={textData}
          config={editorConfig}
          onReady={(editor) => {
            // 👇 editor instance stored here ONLY
            editorInstanceRef.current = editor;

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
      ) : null}
    </>
  );
};

export default CKEditorTextComponent;
