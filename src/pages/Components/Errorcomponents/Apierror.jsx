import React, { useState, useEffect } from 'react';

const Apierror = ({ message, type, show, onClose, isclose }) => {
  if (!show) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      {isclose  &&  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>}
    </div>
  );
};

export default Apierror;