"use client";
import { useState } from "react";

export default function ClaimHistoryEnhanced() {

  // Track open collapsed threads
   const items = [
    {
      name: "Sundeep Bawals",
      avatar: "/avatar1.png",
      role: "Admin",
      date: "01 Sep 2025",
      email: "sundeep.bawals@company.com",
      message: "Duplicated quotation detected.",
      thread: [
        {
          date: "01 Sep 2025 20:37",
          by: "Sandeep",
          text: "Required additional information."
        },
        {
          date: "04 Sep 2025 11:00",
          by: "System",
          text: "Reminder sent to user."
        }
      ]
    },
    {
      name: "Anoop Kumar Sharma",
      avatar: "/avatar2.png",
      role: "Reviewer",
      date: "02 Sep 2025",
      email: "anoop.sharma@company.com",
      message: "Requested additional information email sent.",
      thread: []
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleThread = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="card shadow-sm border-0 rounded-4">

      <div className="card-body">

        {/* Header row */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">History & Comments</h5>

          <div>
            <button className="btn btn-outline-danger btn-sm me-2 rounded-3">
              Reject
            </button>
            <button className="btn btn-primary btn-sm rounded-3">
              <i className="bi bi-plus-circle me-1"></i>
              Add Comment
            </button>
          </div>
        </div>

        {/* Timeline List */}
        <div className="list-group">

          {items.map((item, index) => (
            <div key={index} className="list-group-item border-0">

              <div className="d-flex">

                {/* Avatar */}
                <img
                  src={item.avatar}
                  alt=""
                  className="rounded-circle me-3"
                  width={44}
                  height={44}
                />

                <div className="w-100">

                  {/* Header row */}
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{item.name}</strong>

                      {item.role && (
                        <span className="badge bg-primary-subtle text-primary ms-2 rounded-pill">
                          {item.role}
                        </span>
                      )}

                      <span className="text-muted ms-2 small">{item.date}</span>
                    </div>

                    {/* Toggle thread */}
                    {item.thread && (
                      <button
                        className="btn btn-sm btn-light rounded-circle"
                        onClick={() => toggleThread(index)}
                      >
                        {openIndex === index ? (
                          <i className="bi bi-chevron-up"></i>
                        ) : (
                          <i className="bi bi-chevron-down"></i>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Main comment */}
                  <div className="mt-1 mb-2">
                    {item.message}
                  </div>

                  {/* Email / meta */}
                  {item.email && (
                    <div className="small text-muted">
                      {item.email}
                    </div>
                  )}

                  {/* Nested thread */}
                  {openIndex === index && item.thread && (
                    <div className="mt-3 ms-4 border-start ps-3">

                      {item.thread.map((reply, rIndex) => (
                        <div key={rIndex} className="mb-2">

                          <div className="small text-muted">
                            {reply.date} by {reply.by}
                          </div>

                          <div>{reply.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
