import React, { useState } from "react";
import api from "../../services/api"; // Import API service
import '../../assets/styles/components/add-customer.css'

const AddCustomerForm = ({ onAddCustomer }) => {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!customerName || !phoneNumber) {
      setMessage("Name and phone number are required!");
      return;
    }

    const phoneRegex = /^08\d+$/;
    if (!phoneRegex.test(phoneNumber)) {
      setMessage("Phone number must start with '08' and contain only numbers.");
      return;
    }

    try {
      const response = await api.post("/customers", {
        customer_name: customerName,
        phone_number: phoneNumber,
      });

      // Pass the new customer to the parent component (DataPelanggan)
      onAddCustomer(response.data); // Update state with the new customer

      setMessage(`Pelanggan baru berhasil ditambahkan!`);

      // Clear form fields
      setCustomerName("");
      setPhoneNumber("");
    } catch (error) {
      setMessage("Error adding customer!");
    }
  };

  return (
    <div className="container add-customer">
      <div className="title">Tambah Pelanggan</div>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="form--container">
        <label htmlFor="customerName">Nama Pelanggan</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="form-input"
          required
        />
        
        <label htmlFor="phoneNumber">No. Hp</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="form-input"
          required
        />
        
        <button type="submit" className="form-submit">Tambah Pelanggan</button>
      </form>
    </div>
  );
};

export default AddCustomerForm;
