"use client";

import { useCallback, useState, useEffect } from "react";
import { useController } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiTrash2, FiEye } from "react-icons/fi";

export default function FileUpload({ field, control, errors }: any) {
  const { field: controllerField } = useController({
    name: field.name,
    control,
    rules: {
      validate: (value: File[]) => {
        if (field.required && (!value || value.length === 0)) {
          return `${field.label} is required`;
        }
        return true;
      }
    }
  });
const isImage = (file: File) => file.type.startsWith("image/");
const isPDF = (file: File) => file.type === "application/pdf";
const isDoc = (file: File) =>
  file.type === "application/msword" ||
  file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

const onDrop = useCallback((acceptedFiles: File[]) => {
  if (!acceptedFiles.length) return;

  const newFiles = [...files, ...acceptedFiles];
  setFiles(newFiles);
  controllerField.onChange(newFiles);

  const newPreviews = acceptedFiles.map((file) =>
    URL.createObjectURL(file)
  );

  setPreviews((prev) => [...prev, ...newPreviews]);
}, [files]);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: field.allowedFormats?.reduce((acc: any, ext: string) => {
      acc[`image/${ext}`] = [];
      acc[`application/${ext}`] = [];
      return acc;
    }, {})
  });

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    controllerField.onChange(updatedFiles);

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };
const formatFileName = (name: string, maxLength = 20) => {
  if (name.length <= maxLength) return name;

  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) {
    return name.slice(0, maxLength) + "...";
  }

  const extension = name.slice(lastDot); // ".pdf"
  const baseName = name.slice(0, maxLength);

  return `${baseName}...${extension}`;
};

  return (
    <div className={`single-field col-md-${field.col}`}>
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="error-label-icon">*</span>}
      </label>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`template-file-upload ${
          errors[field.name] ? "border-red-500" : ""
        }`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-2xl text-blue-600 mb-2" />
        <p className="text-sm">Drag & drop files here or click to upload</p>
        <p className="text-xs text-gray-500 mt-1">
          Supported: {field.allowedFormats?.join(", ")} • Max {field.maxSizeMB}MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="preview-image-main-box">
          {files.map((file, index) => (
            <div
              key={index}
              className="preview-image-box-temp"
            >
              <div className="preview-image-box-temp-single">
                {isImage(file) && (
            <img
              src={previews[index]}
              alt="preview"
              className="preview-image-template-one"
            />
          )}
          {isPDF(file) && (
            <iframe
              src={previews[index]}
              className="pdf-preview-frame"
              title={file.name}
            />
          )}
          {isDoc(file) && (
            <img src='/assets/img/doc.png' alt="document File" className="preview-image-template-one" />
          )}
          

                <div className="preview_image-info">
                  <p className="text-sm font-medium t-info-t">{formatFileName(file.name, 10)}</p>
                  <p className="text-xs text-gray-500 s-info-s">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>

              <button type="button" onClick={() => removeFile(index)}>
                <FiTrash2 className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {errors[field.name] && (
        <p className="template-one-form-error-maessage">
          {errors[field.name].message}
        </p>
      )}
    </div>
  );
}
