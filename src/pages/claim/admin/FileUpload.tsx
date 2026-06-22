/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi";

export default function FileUpload({
  field,
  isfor,
  error,
  onChange
}) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const isRequired = isfor === "employee" && field.required;

  const isImage = (file) => file.type.startsWith("image/");
  const isPDF = (file) => file.type === "application/pdf";
  const isDoc = (file) =>
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      onChange?.(newFiles);

      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index]);

    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onChange?.(updatedFiles);
  };

  const formatFileName = (name, maxLength = 12) => {
    if (name.length <= maxLength) return name;
    const ext = name.slice(name.lastIndexOf("."));
    return name.slice(0, maxLength) + "..." + ext;
  };

  return (
    <div className={`single-field col-md-${field.col}`}>
      <label className="text-sm font-medium">
        {field.label}
        {isRequired && <span className="error-label-icon">*</span>}
      </label>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`template-file-upload ${error ? "border-red-500" : ""}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-2xl text-blue-600 mb-2" />
        <p className="text-sm">Drag & drop files here or click to upload</p>
        {field.allowedFormats && (
          <p className="text-xs text-gray-500">
            Supported: {field.allowedFormats.join(", ")}
          </p>
        )}
      </div>

      {/* Preview */}
      {files.length > 0 && (
        <div className="preview-image-main-box">
          {files.map((file, index) => (
            <div key={index} className="preview-image-box-temp">
              <div className="preview-image-box-temp-single">
                {isImage(file) && (
                  <img
                    src={previews[index]}
                    alt="preview"
                    className="preview-image-template-one"
                    width={80}
                    height={80}
                  />
                )}

                {isPDF(file) && (
                  <iframe
                    src={previews[index]}
                    className="pdf-preview-frame"
                    title={file.name}
                    width={80}
                    height={80}
                  />
                )}

                {isDoc(file) && (
                  <img
                    src="/assets/img/doc.png"
                    alt="document"
                    className="preview-image-template-one"
                  />
                )}

                <div className="preview_image-info">
                  <p className="text-sm font-medium">
                    {formatFileName(file.name)}
                  </p>
                  <p className="text-xs text-gray-500">
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
      {error && (
        <p className="template-one-form-error-maessage">{error}</p>
      )}
    </div>
  );
}
