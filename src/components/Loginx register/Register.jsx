import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authServices'; // Ensure this is the correct import path
import './auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default to admin role
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await registerUser({ username, password, role });
      setSuccessMessage('Registrasi Berhasil, mengarahkan ke bagian login...');
      setError('');
      setUsername('');
      setPassword('');
      setRole('admin');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="add-customer">
      <h2 className="title">Buat akun baru</h2>
      <form className="form--container" onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          className="form-input"
          type="text"
          placeholder="masukkan username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          className="form-input"
          type="password"
          placeholder="masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Role:</label>
        <select
          className="form-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
        {error && <p className="message">{error}</p>}
        {successMessage && <p className="message">{successMessage}</p>}
        <button className="form-submit" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
