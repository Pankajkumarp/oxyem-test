import React, { useState } from "react";
const AlertWithButton = ({ message, type = "warning", actionLabel, onAction }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="alert-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        className={`alert alert-${type} text-center`}
        style={{
          minWidth: "350px",
          maxWidth: "500px",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          background: "#fff",
          position: "relative",
          height: "150px",
           border: "none",  
        }}
        role="alert"
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="btn-close"
          style={{ position: "absolute", top: "10px", right: "10px",padding: "2px", }}
          onClick={() => setVisible(false)}
        ></button>

        {/* MESSAGE */}
        <div
          style={{ marginBottom: "15px", marginTop: "15px", color: "black", }}
          dangerouslySetInnerHTML={{ __html: message }}
        ></div>

        {/* ACTION BUTTON */}
        {actionLabel && (
          <button
            className="btn btn-primary"
            onClick={() => {
              onAction && onAction();
              setVisible(false);
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertWithButton;
