"use client";

import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { MdOutlineDocumentScanner } from "react-icons/md";
import Previewimage from "./previewImage";
import { Tooltip } from "react-tooltip";

type BackendDoc = {
  Title: string;
  "Doc Type": string;
  "Uploaded Date": string;
  Size: string;
  download: string;
};

type DocItem = {
  path: string;
  url: string;
  name: string;
  ext: string;
  type: "image" | "pdf" | "other";
  sizeLabel: string;
};

export default function DocumentsEvidence({
  documents,
}: {
  documents: BackendDoc[];
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL!;
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Build preview data directly from backend
  const docs: DocItem[] = (documents || []).map((doc) => {
    const ext = doc["Doc Type"]?.toLowerCase();

    const type: DocItem["type"] =
      ext === "pdf"
        ? "pdf"
        : ["jpg", "jpeg", "png", "webp"].includes(ext)
        ? "image"
        : "other";

    return {
      path: doc.download,
      url: `${BASE_URL}/${doc.download}`,
      name: doc.Title,
      ext,
      type,
      sizeLabel: doc.Size,
    };
  });

  const openModal = (doc: DocItem) => {
    setPreviewDoc(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewDoc(null);
  };

  const formatFileName = (name: string, maxLength = 20) => {
    if (name.length <= maxLength) return name;

    const lastDot = name.lastIndexOf(".");
    if (lastDot === -1) return name.slice(0, maxLength) + "...";

    const extension = name.slice(lastDot);
    const baseName = name.slice(0, maxLength);

    return `${baseName}...${extension}`;
  };

  if (!docs.length) {
    return <p className="text-muted p-4">No documents uploaded yet</p>;
  }

  return (
    <>
      <Previewimage
        isOpen={isModalOpen}
        closeModal={closeModal}
        previewDoc={previewDoc}
      />

      <div className="verify-claim-view-card">
        <div className="card-doc-view-o">
          {docs.map((doc, i) => (
            <div
              key={i}
              className="d-flex align-items-center justify-content-between mb-3 show-document-box"
            >
              <div className="d-flex gap-3 al-c">
                {/* IMAGE */}
                {doc.type === "image" && (
                  <img
                    src={doc.url}
                    alt={doc.name}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                  />
                )}

                {/* PDF */}
                {doc.type === "pdf" && (
                  <iframe
                    src={`/api/pdfpreview?url=${encodeURIComponent(doc.url)}`}
                    width={100}
                    height={100}
                    style={{ border: "none" }}
                  />
                )}

                {/* OTHER */}
                {doc.type === "other" && (
                  <i className="bi bi-file-earmark fs-1 text-secondary" />
                )}

                {/* META */}
                <div className="file-text-box">
                  <div
                    className="fw-semibold file-name-text"
                    data-tooltip-content={doc.name}
                    data-tooltip-id="doc-tooltip"
                  >
                    {formatFileName(doc.name, 25)}
                  </div>

                  <div className="small text-muted">
                    {doc.ext.toUpperCase()} • {doc.sizeLabel}
                  </div>

                  <div className="info-btn-doccument">
                    <div className="info-btn-doccument-preview">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="verify-section-download"
                        data-tooltip-content="Download"
                        data-tooltip-id="doc-tooltip"
                      >
                        <FaDownload />
                      </a>

                      {doc.type !== "other" && (
                        <span
                          className="preview-img-btn"
                          onClick={() => openModal(doc)}
                          data-tooltip-content="Preview"
                          data-tooltip-id="doc-tooltip"
                        >
                          <MdOutlineDocumentScanner />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Tooltip id="doc-tooltip" place="top" />
      </div>
    </>
  );
}
