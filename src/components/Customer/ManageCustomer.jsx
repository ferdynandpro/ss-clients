import React, { useState } from 'react';
import useCustomers from '../../hooks/useCustomers';
import ConfirmationModal from '../../components/Alert/ConfirmationModal';
import '../../assets/styles/components/manage-customer.css';
import '../../assets/styles/components/customers-table.css';

const ManageCustomer = ({ customers, onCustomersUpdate }) => {
  const { updateCustomer, deleteCustomer, relatedDiscounts } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const handleUpdate = async (id, name, phoneNumber) => {
    try {
      if (!name || !phoneNumber) {
        setNameError('Nama dan nomor telepon wajib diisi!');
        return;
      }
      if (!/^08\d{8,12}$/.test(phoneNumber)) {
        setPhoneError('Nomor telepon harus dimulai dengan 08 dan terdiri dari 10-15 digit.');
        return;
      }
      await updateCustomer(id, name, phoneNumber);
      await onCustomersUpdate(); // Refresh the customer list after updating
      setEditingCustomer(null);
      setUpdatedName('');
      setUpdatedPhoneNumber('');
      setNameError('');
      setPhoneError('');
    } catch (err) {
      setPhoneError('Gagal memperbaharui data');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      await onCustomersUpdate(); // Refresh the list after deletion
    } catch (err) {
      console.error('gagal menghapus data:', err);
    }
  };

  const handleDeleteClick = (customerId) => {
    setCustomerToDelete(customerId);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete) {
      await handleDelete(customerToDelete);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer.id);
    setUpdatedName(customer.customer_name);
    setUpdatedPhoneNumber(customer.phone_number);
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const name = customer.customer_name ? customer.customer_name.toLowerCase() : '';
      const phone = customer.phone_number ? customer.phone_number : '';
      return (
        name.includes(searchQuery.toLowerCase()) || 
        phone.includes(searchQuery)
      );
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort by updatedAt, newest first
    .slice(0, 50); // Limit to the latest 50 customers

  return (
    <div className="manage-container">
      <input
        type="text"
        placeholder="Cari nama atau nomor hp..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="table-container">
        <table className="data-table responsive-table">
          <thead>
            <tr>
              <th className="id">ID</th>
              <th>Nama Pelanggan</th>
              <th>No.Hp</th>
              <th className="last-updated">Terakhir diperbaharui</th>
              <th className="action">aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => {
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
                    {nameError && editingCustomer === customer.id && <p className="error-text">{nameError}</p>}
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
                    {phoneError && editingCustomer === customer.id && <p className="error-text">{phoneError}</p>}
                  </td>
                  <td className="last-updated">
                    {new Date(customer.updatedAt).toLocaleString()}
                  </td>
                  <td className="action">
                    {editingCustomer === customer.id ? (
                      <>
                        <button
                          onClick={() =>
                            handleUpdate(customer.id, updatedName, updatedPhoneNumber)
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
                          onClick={() => handleEditClick(customer)}
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
          message={`Apakah anda ingin menghapus customer ini?`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
};

export default ManageCustomer;
