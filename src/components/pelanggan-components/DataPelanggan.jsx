import React, { useState, useEffect } from 'react';
import AddCustomerForm from '../Customer/AddCustomerForm';
import ManageCustomer from '../Customer/ManageCustomer';
import api from "../../services/api"; // Ensure api service is imported correctly
import '../../assets/styles/components/data-pelanggan.css';

const DataPelanggan = () => {
  const [customers, setCustomers] = useState([]); // State for managing customers

  // Fetch customers data from the server when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array to run only once when component mounts

  // Function to add new customer to the list and immediately update the list
  const addCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]); // Adds new customer to the state
  };

  return (
    <div className="container">
      <div className="titles">Data Pelanggan</div>
      {/* <div className="data--pelanggan-container"> */}
        <AddCustomerForm onAddCustomer={addCustomer} /> {/* Pass addCustomer function */}
        <ManageCustomer customers={customers} /> {/* Pass customers list as prop */}
      {/* </div> */}
    </div>
  );
};

export default DataPelanggan;
