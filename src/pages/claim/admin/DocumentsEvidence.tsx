"use client";

import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { MdOutlineDocumentScanner } from "react-icons/md";
import Previewimage from './previewImage';
import { Tooltip } from "react-tooltip";

type DocumentInput =
  | string
  | {
    path: string;
    isValid?: boolean;
  };

type DocItem = {
  path: string;
  url: string;
  name: string;
  ext: string;
  type: "image" | "pdf" | "other";
  size: number | null;
  isValid?: boolean | string;
};


export default function DocumentsEvidence({
  documents,
}: {
  documents: DocumentInput[];
}) {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL!;

  useEffect(() => {
    if (!documents?.length) return;

    const loadDocs = async () => {
      const results = await Promise.all(
        documents.map(async (item) => {

          // ⭐ Normalize input
          const path = typeof item === "string" ? item : item.path;
          const isValid =
            typeof item === "string" ? undefined : item.isValid;

          const url = `${BASE_URL}/${path}`;

          const meta = await fetch(
            `/api/fileMeta?url=${encodeURIComponent(url)}`
          ).then((r) => r.json());

          return {
            path,
            url,
            name: meta.name,
            ext: meta.ext,
            type: meta.type,
            size: meta.size,
            isValid,
          };
        })
      );


      setDocs(results);
    };

    loadDocs();
  }, [documents, BASE_URL]);
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
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (doc: DocItem) => {
    setPreviewDoc(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewDoc(null);
  };
  return (
    <>
      <Previewimage isOpen={isModalOpen} closeModal={closeModal} previewDoc={previewDoc} />
      <div className="verify-claim-view-card">
        <div className="card-body">
          {docs.map((doc, i) => (
            <div
              key={i}
              className="d-flex align-items-center justify-content-between mb-3 show-document-box"
            >
              <div className="d-flex  gap-3">
                {/* IMAGE */}
                {doc.type === "image" && (
                  <img
                    src={doc.url}
                    alt={doc.name}
                    width={75}
                    height={75}
                    style={{ objectFit: "cover" }}
                  />
                )}

                {/* PDF */}
                {doc.type === "pdf" && (
                  <iframe
                    src={`/api/pdfpreview?url=${encodeURIComponent(doc.url)}`}
                    width={75}
                    height={75}
                    style={{ border: "none" }}
                  />
                )}

                {/* OTHER */}
                {doc.type === "other" && (
                  <i className="bi bi-file-earmark fs-1 text-secondary" />
                )}

                {/* META */}
                <div className="file-text-box">
                  <div className="fw-semibold file-name-text" data-tooltip-content={doc.name}
                    data-tooltip-id={`my-tooltip-p`}>{formatFileName(doc.name, 10)}</div>
                  <div className="small text-muted">
                    {doc.ext.toUpperCase()} • {formatBytes(doc.size)}
                  </div>
                  <div className="info-btn-doccument">
                    <div className="info-btn-doccument-preview">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="verify-section-download"
                        data-tooltip-content={"Download"}
                        data-tooltip-id={`my-tooltip-p`}
                      >
                        <FaDownload />
                      </a>
                      <span className="preview-img-btn" onClick={() => openModal(doc)} data-tooltip-content={"Preview"}
                        data-tooltip-id={`my-tooltip-p`}><MdOutlineDocumentScanner /></span>
                    </div>
                    {doc.isValid !== "" && (
                      <span
                        className={
                          doc.isValid
                            ? "oxyem-mark-valid"
                            : "oxyem-mark-invalid"
                        }
                      >
                        {doc.isValid ? "Valid" : "Invalid"}
                      </span>
                    )}


                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Tooltip id="my-tooltip-p" place="top" />
      </div>
    </>
  );
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";
  const sizes = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;

  while (value >= 1024 && i < sizes.length - 1) {
    value /= 1024;
    i++;
  }

  return `${value.toFixed(2)} ${sizes[i]}`;
}
