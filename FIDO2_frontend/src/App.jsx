// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const App = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const { data: options } = await axios.post('http://localhost:5000/generate-registration-options', { username });
      const attestation = await startRegistration(options);
      const { data } = await axios.post('http://localhost:5000/verify-registration', { username, attestation });
      setMessage(data.success ? 'Registration successful!' : 'Registration failed');
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const { data: options } = await axios.post('http://localhost:5000/generate-authentication-options', { username });
      const assertion = await startAuthentication(options);
      const { data } = await axios.post('http://localhost:5000/verify-authentication', { username, assertion });
      setMessage(data.success ? 'Login successful!' : 'Login failed');
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div>
      <h1>FIDO2 Authentication</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
};

export default App;
