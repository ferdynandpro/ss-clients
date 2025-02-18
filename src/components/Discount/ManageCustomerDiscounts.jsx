import React, { useState } from 'react';
import useCustomers from '../../hooks/useCustomers';
import CustomerTable from './CustomerTable';
import '../../assets/styles/components/manage-customer.css';

const ManageCustomer = () => {
  const { customers, loading, error, updateCustomer, deleteCustomer } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleEdit = (customer) => {
    setEditingCustomer(customer.id);  // Set the customer ID as the one being edited
    setUpdatedName(customer.customer_name);  // Populate the form with existing name
    setUpdatedPhoneNumber(customer.phone_number);  // Populate the form with existing phone number
  };

  const handleUpdate = async (id, name, phoneNumber) => {
    try {
      if (!name || !phoneNumber) {
        setNameError('Name and Phone Number are required.');
        return;
      }
      if (!/^08\d{8,12}$/.test(phoneNumber)) {
        setPhoneError('Phone number must start with 08 and be 10-15 digits long.');
        return;
      }
      await updateCustomer(id, name, phoneNumber);
      setEditingCustomer(null); 
      setUpdatedName('');
      setUpdatedPhoneNumber('');
      setNameError('');
      setPhoneError('');
    } catch (err) {
      setPhoneError('Failed to update customer.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone_number.includes(searchQuery)
  );

  return (
    <div className="manage-container">
      <h2 className="titles">List Pelanggan</h2>
      <input
        type="text"
        placeholder="Search by name or phone number"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <CustomerTable
        customers={filteredCustomers}
        onUpdate={handleUpdate}
        onDelete={handleDelete}  
        editingCustomer={editingCustomer}
        setEditingCustomer={setEditingCustomer}
        updatedName={updatedName}
        updatedPhoneNumber={updatedPhoneNumber}
        setUpdatedName={setUpdatedName}
        setUpdatedPhoneNumber={setUpdatedPhoneNumber}
        nameError={nameError}
        phoneError={phoneError}
        onEdit={handleEdit}  // Pass the handleEdit function to CustomerTable
      />
    </div>
  );
};

export default ManageCustomer;
