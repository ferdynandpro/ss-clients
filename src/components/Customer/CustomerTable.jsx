import React, { useState } from 'react';
import ConfirmationModal from '../../components/Alert/ConfirmationModal';
import '../../assets/styles/components/customers-table.css';

const CustomerTable = ({
  customers,
  onUpdate,
  onDelete,
  editingCustomer,
  setEditingCustomer,
  updatedName,
  updatedPhoneNumber,
  setUpdatedName,
  setUpdatedPhoneNumber,
  nameError,
  phoneError,
  relatedDiscounts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const handleDeleteClick = (customerId) => {
    setCustomerToDelete(customerId);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete) {
      await onDelete(customerToDelete);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="table-container">
      <table className="data-table responsive-table">
        <thead>
          <tr>
            <th className="id">ID</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th className="last-updated">Last Updated</th>
            <th className="action">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            const hasDiscounts = relatedDiscounts.includes(customer.id);
            return (
              <tr key={customer.id}>
  <td className="id">{customer.id}</td>
  <td>
    {editingCustomer === customer.id ? (
      <input
        type="text"
        value={updatedName}
        onChange={(e) => setUpdatedName(e.target.value)}
        className="editable-input"
      />
    ) : (
      customer.customer_name
    )}
    {nameError && <p className="error-text">{nameError}</p>}
  </td>
  <td>
    {editingCustomer === customer.id ? (
      <input
        type="text"
        value={updatedPhoneNumber}
        onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
        className="editable-input"
      />
    ) : (
      customer.phone_number
    )}
    {phoneError && <p className="error-text">{phoneError}</p>}
  </td>
  <td className="last-updated">
    {new Date(customer.updatedAt).toLocaleString()}
  </td>
  <td className="action">
    {editingCustomer === customer.id ? (
      <>
        <button
          onClick={() =>
            onUpdate(customer.id, updatedName, updatedPhoneNumber)
          }
          className="action-button confirm-button"
        >
          Simpan
        </button>
        <button
          onClick={() => setEditingCustomer(null)}
          className="action-button cancel-button"
        >
          Batal
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => setEditingCustomer(customer.id)}
          className="action-button edit-button"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteClick(customer.id)}
          disabled={hasDiscounts}
          className={`action-button delete-button ${
            hasDiscounts ? 'disabled-delete' : ''
          }`}
        >
          Hapus
        </button>
      </>
    )}
  </td>
</tr>

            );
          })}
        </tbody>
      </table>

      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this customer?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default CustomerTable;
