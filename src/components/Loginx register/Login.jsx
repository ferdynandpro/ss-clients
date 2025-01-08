  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { loginUser } from '../../services/authServices';
  import './auth.css';

  const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        const data = await loginUser({ username, password });
        localStorage.setItem("token", data.token);  // Save the token
        localStorage.setItem("username", username);  // Save the username
        localStorage.setItem("role", data.role);  // Save the username
        
        navigate("/admin/dashboard/dashboard");   // Redirect on success
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again later.");
      }
    };

    return (
      <div className="auth--container">
        <div className="auth-container">
          {/* <h2 className="titles">Welcome To</h2> */}
          <h2 className="titles">SUMBER LANCAR</h2>
          <form onSubmit={handleSubmit}>
            <div className="input--div">
              <label>Username:</label>
              <input
                className="login--input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input--div">
              <label>Password:</label>
              <input
                className="pass--input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="login--button" type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  };

  export default Login;
