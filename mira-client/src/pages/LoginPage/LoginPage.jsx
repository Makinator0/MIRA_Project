import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginInputField from '../../components/InputFields/LoginInputField/LoginInputField';
import LoginErrorMessage from '../../components/ErrorMessages/LoginErrorMessage/LoginErrorMessage';
import LoginButton from '../../components/Buttons/LoginButton/LoginButton';
import { login } from '../../services/authService';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const token = await login(email, password);
            navigate('/kanban', { state: { token } });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Logging in</h1>
                    <p>Enter your credentials</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <LoginInputField
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <LoginInputField
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <LoginErrorMessage message={error} />}

                    <LoginButton type="submit">Sign in</LoginButton>

                    <div className="login-footer">
                        <p>No account? <a href="/registration" className="register-link">Create an account</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;