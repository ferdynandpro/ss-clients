import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchUserDetails } from '../../services/authServices'; // Adjust the import path

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUserDetails(); // Fetch user details using token from cookies
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Or show a spinner/loading animation
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
