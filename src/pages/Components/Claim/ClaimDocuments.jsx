import { useState } from "react";
import { IoDownloadOutline } from "react-icons/io5";

export default function ClaimDocuments({ documents }) {
  const handleDownload = (filePath) => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const fileUrl = `${baseUrl}/${filePath}`;
    window.open(fileUrl, "_blank");
  };

  const [docs] = useState([
    {
      title: "Invoice",
      fileName: "REG1072_Invoice.pdf",
      size: "150 KB",
      icon: "bi-file-earmark-text",
      valid: true,
    },
    {
      title: "Quotation",
      fileName: "REG1072_Quotation.pdf",
      size: "80 KB",
      icon: "bi-file-earmark-ruled",
      valid: true,
    },
  ]);

  return (
    <div className="card shadow-sm border-0 rounded-1 card-bg-gray claim-summary">
      <div className="card-body pt-0">
        <h5 className="fw-semibold claim-doc-title mb-0 rounded-1 ">
          Documents & Evidence
        </h5>

        <div className="p-3 border rounded-bottom-1 card-bg-white ">
          {documents && Object.keys(documents).length > 0 ? (
            Object.entries(documents).map(([docName, docPath], index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center pb-2 pt-2 bb-1px"
              >
                {/* Left */}
                <div className="d-flex align-items-center gap-3 w-80">
                  {/* Meta */}
                  <div>
                    <div className="fw-semibold">{docName}</div>

                    <small className="text-muted d-block">10mb</small>
                  </div>
                  <div className="text" style={{ width: '10%' }}>
                                    <IoDownloadOutline size={25} onClick={() => handleDownload(docPath)} />
                                  </div>
                </div>

                {/* Right actions */}
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-success rounded-pill px-3 py-2">
                    Valid
                  </span>
                </div>
                <hr></hr>
              </div>
            ))
          ) : (
            <p>No documents Uploaded</p>
          )}

          {docs.map((d, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center pb-2 pt-2 bb-1px"
            >
              {/* Left */}
              <div className="d-flex align-items-center gap-3 w-80">
                {/* Meta */}
                <div>
                  <div className="fw-semibold">{d.title}</div>

                  <small className="text-muted d-block">
                    {d.fileName} ({d.size})
                  </small>
                </div>
              </div>

              {/* Right actions */}
              <div className="d-flex align-items-center gap-3">
                {/* Validity Badge */}
                {d.valid ? (
                  <span className="badge bg-success rounded-pill px-3 py-2">
                    Valid
                  </span>
                ) : (
                  <span className="badge bg-danger rounded-pill px-3 py-2">
                    Invalid
                  </span>
                )}
              </div>
              <hr></hr>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
