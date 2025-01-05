// ConfirmationModal.js
import React from 'react';
import '../../assets/styles/components/manage-customer.css'

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p className='vldt'>{message}</p>
        <div className="vldt">
          <button onClick={onConfirm} className="modal-button modal-button--confirm">
            Ya
          </button>
          <button onClick={onCancel} className="modal-button modal-button--cancel">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
