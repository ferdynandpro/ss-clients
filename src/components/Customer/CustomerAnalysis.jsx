import React from 'react';
import useCustomers from '../../hooks/useCustomers'; // Assuming you have this hook
import "../../assets/styles/components/customer-analysis.css"

const CustomerAnalysis = () => {
  const { customers } = useCustomers(); // Retrieve customer data

  // Total number of customers
  const totalCustomers = customers.length;

  return (
    <div className="customer-analysis">
      <h3>Customer Analysis</h3>
      <div className="analysis-stats">
        <p><strong>Total Customers:</strong> {totalCustomers}</p>
      </div>
    </div>
  );
}

export default CustomerAnalysis;
