import React, { useState, useEffect } from 'react';
import AddCustomerForm from '../Customer/AddCustomerForm';
import ManageCustomer from '../Customer/ManageCustomer';
import api from "../../services/api";
import '../../assets/styles/components/data-pelanggan.css';

const DataPelanggan = () => {
  const [customers, setCustomers] = useState([]);

  // Fetch customers when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data pelanggan.:', error);
      }
    };

    fetchCustomers();
  }, []);

  const addCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
  };

  const updateCustomers = async () => {
    try {
      const response = await api.get('/customers'); // Fetch updated customer list
      setCustomers(response.data); // Update the state with the latest data
    } catch (error) {
      console.error('gagalmemperbaharui data:', error);
    }
  };

  return (
    <div className="container">
      <div className="titles">Data Pelanggan</div>
      <AddCustomerForm onAddCustomer={addCustomer} onCustomersUpdate={updateCustomers} />
      <ManageCustomer customers={customers} onCustomersUpdate={updateCustomers} />
    </div>
  );
};

export default DataPelanggan;
