import React from 'react';
import '../../components/Alert/DeleteAlert' // Pastikan sudah ada styling yang tepat
import '../../assets/styles/components/delete-alert.css'

const DeleteAlert = ({ onDeleteConfirm, onCancel }) => {
  return (
    <div className="modal">

    <div className="alert">
      <div className="modal-content">
        <p className='vldt'>Are you sure you want to delete this customer?</p>
        <div className="vldt">
        <button onClick={onDeleteConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DeleteAlert;
