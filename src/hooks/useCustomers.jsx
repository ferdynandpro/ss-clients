import { useState, useEffect } from 'react';
import api from '../services/api';

const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [relatedDiscounts, setRelatedDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomersAndDiscounts = async () => {
      setLoading(true);
      try {
        const [customersResponse, discountsResponse] = await Promise.all([
          api.get('/customers'),
          api.get('/discounts'),
        ]);

        setCustomers(customersResponse.data);
        const relatedIds = discountsResponse.data.map((discount) => discount.customer_id);
        setRelatedDiscounts(relatedIds);
      } catch (err) {
        setError('Error fetching customers or discounts');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersAndDiscounts();
  }, []);

  const updateCustomer = async (id, name, phoneNumber) => {
    await api.put(`/customers/${id}`, { customer_name: name, phone_number: phoneNumber });

    // Re-fetch the updated customer data from the server to get the latest 'updatedAt'
    const response = await api.get(`/customers/${id}`);
    const updatedCustomer = response.data;

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? updatedCustomer : customer
      )
    );
  };

  const deleteCustomer = async (id) => {
    await api.delete(`/customers/${id}`);
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };


  

  return { customers, loading, error, updateCustomer, deleteCustomer, relatedDiscounts };
};

export default useCustomers;
