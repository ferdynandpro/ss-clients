import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '../src/assets/styles/global/global.css'
import Login from './components/Loginx register/Login';
import Register from './components/Loginx register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import ManageCustomer from './components/Customer/ManageCustomer';
import AddCustomerForm from './components/Customer/AddCustomerForm';
import ProductForm from './components/Product/ProductForm';
import ProductList from './components/Product/ProductList';
import DiscountForm from './components/Discount/DiscountForm';
import DiscountList from './components/Discount/DiscountList';
import AuthManage from './components/auth-components/AuthManage';
import DataPelanggan from './components/pelanggan-components/DataPelanggan';
import DiskonPage from './pages/Discount-page/DiskonPage';
import LogsTable from './components/Logs/LogsTable';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};


function App() {
  return (
    <Router
    basename="/sumbersari"
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<PrivateRoute element={<DashboardLayout />} />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* Customer */}
          <Route path="add-customer" element={<PrivateRoute element={<AddCustomerForm />} />} />
          <Route path="customer" element={<PrivateRoute element={<ManageCustomer />} />} />
          <Route path="product-form" element={<PrivateRoute element={<ProductForm />} />} />
          <Route path="product-list" element={<PrivateRoute element={<ProductList />} />} />

          {/* Discounts */}
          <Route path="Discount-form" element={<PrivateRoute element={<DiscountForm />} />} />
          <Route path="Discount-list" element={<PrivateRoute element={<DiscountList />} />} />

          {/* Auth */}
          <Route
            path="auth-list"
            element={<PrivateRoute element={<AuthManage />} roleRequired="owner" />}
          />
          {/* data pelanggan */}
          <Route path="data-pelanggan" element={<PrivateRoute element={<DataPelanggan />} />} />

          {/*diskon page */}
          <Route path="discount-page" element={<PrivateRoute element={<DiskonPage/>} />} />

          {/*Logs */}
          <Route path="logs" element={<PrivateRoute element={<LogsTable/>} />} />

          
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
