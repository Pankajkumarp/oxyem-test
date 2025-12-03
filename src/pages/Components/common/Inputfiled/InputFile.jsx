import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { IoMdClose } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import DocList from '../../Datatable/documentlist';
export default function InputFileComponent({ type, placeholder, isDisabled, label, validations = [], onChange, files, value }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const policyBaseurl = process.env.NEXT_PUBLIC_S3_BUCKET_URL
  const [innerValue, setInnerValue] = useState("");
  const [downloadValue, setDownloadValue] = useState("");
  const [showValue, setShowValue] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [isDownloadShow, setIsDownloadShow] = useState(true);
  const dropRef = useRef(null);
  useEffect(() => {
    if (value === "") {
      setShowValue(true);
    } else {
      if (typeof value === 'string') {
        // If value is a single string (file path), extract the filename
        const filename = value.split('/').pop();
        setShowValue(false);
        setInnerValue(filename);
        setDownloadValue(value);
      } else if (Array.isArray(value)) {
        if (value.length > 0 && value[0] instanceof File) {
          const filenames = value.map(file => file.name).join(', ');
          setShowValue(false);
          setInnerValue(filenames);
          setDownloadValue(value.map(file => URL.createObjectURL(file)));
        } else {
          const filenames = value.map(file => file.split('/').pop()).join(', ');
          setShowValue(false);
          setInnerValue(filenames);
          setDownloadValue(value.join(','));
        }
      }
    }
  }, [value]);



  useEffect(() => {
    if (files) {
      setSelectedFiles(files);
    }
  }, [files]);

  useEffect(() => {
    const dropArea = dropRef.current;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('drag-over');
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('drag-over');
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('drag-over');

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        setSelectedFiles(filesArray);
        onChange(filesArray); // Send the files array to the parent component
        setIsDownloadShow(false)
        e.dataTransfer.clearData();
      }
    };

    dropArea.addEventListener('dragenter', handleDragEnter);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragenter', handleDragEnter);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      onChange(filesArray);
      setIsDownloadShow(false)
    }
  };

  const handleInputClick = () => {
    if (!isDisabled) {
      fileInputRef.current.click();
    }
  };
  const handleClesrClick = () => {
    setShowValue(true)
    onChange("");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [documentData, setDocumentData] = useState([]);

  const openDetailpopup = (value) => {
    setDocumentData(value);
    setIsModalOpen(true);
  };
  const closeDetailpopup = async () => {
    setIsModalOpen(false)
  }
  const handleDownloadAll = () => {
    if (value.length > 1) {
      // Multiple files, open popup to show the list
      openDetailpopup(value);
    } else if (documents.length === 1) {
      // Single file, download it directly
      const url = `${policyBaseurl}/${value[0]}`;
      window.open(url, '_blank');
    }
  };
  return (
    <>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <DocList isOpen={isModalOpen} closeModal={closeDetailpopup} documentData={documentData} />
      {showValue ? (
        <>
          <div
            ref={dropRef}
            className={`drop-area ${isDisabled ? 'disabled-input-file' : ''}`}
            onClick={handleInputClick}
            style={{ border: '1px dashed #ccc', padding: '11px', textAlign: 'center', cursor: 'pointer' }}
          >
            {selectedFiles.length > 0
              ? selectedFiles.map(file => file.name).join(', ')
              : 'Drag and drop or select file'}
          </div>
          <input
            type="file"
            className="form-control"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </>
      ) : (
        <div
          ref={dropRef}
          className={`drop-area drop_show_prefilled ${isDisabled ? 'disabled-input-file' : ''}`}
          style={{ border: '1px dashed #ccc', padding: '11px', textAlign: 'center', cursor: 'pointer' }}
        >{innerValue}
          {isDownloadShow ? (
            <>
              {Array.isArray(value) ? (
                <span onClick={handleDownloadAll} className="card_img_click cl_bt_dow">
                  <LuDownload />
                </span>
              ) : (
                <Link href={`${policyBaseurl}/${downloadValue}`} download className="card_img_click">
                  <LuDownload />
                </Link>
              )}
            </>
          ) : (null)}
          {isDisabled ? (null) : (
            <span className='oxyem_file_close' onClick={handleClesrClick}><IoMdClose /></span>
          )}
        </div>
      )}
    </>
  );
}



