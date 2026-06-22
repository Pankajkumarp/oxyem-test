import React, { useState, useEffect, useRef } from 'react';
import Drawer from "react-modern-drawer";
import { MdClose } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import "react-modern-drawer/dist/index.css";

const DescriptionDrawer = ({
    isOpen,
    closeModal,
    initialValue = "",
    onSave,
}) => {

    const editorRef = useRef(null);
    // eslint-disable-next-line react-hooks/refs
    const CKEditor = editorRef.current?.CKEditor;
    // eslint-disable-next-line react-hooks/refs
    const Editor = editorRef.current?.Editor;

    useEffect(() => {
        editorRef.current = {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            Editor: require("ckeditor5-custom-build")
        };
    }, []);
    const [editorLoaded, setEditorLoaded] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditorLoaded(true);
    }, []);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setValue(initialValue || "");
        }
    }, [isOpen, initialValue]);

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
                'bulletedList',
                'numberedList',
                '|',
                'link',
                '|',
                'outdent',
                'indent'
            ],
        },
        placeholder: "Enter description..."
    };
    const handleSave = () => {
        onSave(value);
        closeModal();
    };

    return (
        <Drawer
            open={isOpen}
            onClose={closeModal}
            direction="right"
            size={400}
            className="custom-drawer"
            overlayClassName="custom-overlay"
        >
            <div className="drawer-container">
                <div className="drawer-header-t">
                    <FiFileText />
                    <div className='drawer-header-d'>
                    <h4>Task Description</h4>
                    <p>Provide additional details to clarify the scope and expectations of this task.</p>
                    </div>
                    <button onClick={closeModal} className="oxyem-btn-close">
                        <MdClose />
                    </button>
                </div>

                <div className="drawer-body">
                    {editorLoaded && (
                        // eslint-disable-next-line react-hooks/refs
                        <CKEditor
                            // eslint-disable-next-line react-hooks/refs
                            editor={Editor}
                            data={value}
                            config={editorConfig}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setValue(data);
                            }}
                        />
                    )}
                </div>

                <div className="drawer-footer mt-3 text-end">
                    <button
                        className="btn btn-secondary me-2"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
            <style>{`
        .ck-editor__editable{min-height: 120px;}
         `}</style>
        </Drawer>
    );
};

export default DescriptionDrawer;