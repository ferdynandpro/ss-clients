// components/Alert/ErrorModal.js

import React from 'react';
import '../../assets/styles/components/manage-customer.css'

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{message}</h3>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-button modal-button--confirm">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
