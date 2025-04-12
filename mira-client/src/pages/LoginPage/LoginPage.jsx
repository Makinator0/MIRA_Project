import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginInputField from '../../components/InputFields/LoginInputField/LoginInputField';
import LoginErrorMessage from '../../components/ErrorMessages/LoginErrorMessage/LoginErrorMessage';
import LoginButton from '../../components/Buttons/LoginButton/LoginButton';
import { login } from '../../services/authService';

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
        <div>
            <h1>Авторизация</h1>
            <form onSubmit={handleLogin}>
                <LoginInputField
                    type="email"
                    placeholder="Эл. почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <LoginInputField
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <LoginButton type="submit">Войти</LoginButton>
            </form>
            {error && <LoginErrorMessage message={error} />}
            <a href="/registration">Зарегистрироваться</a>
        </div>
    );
};

export default LoginPage;
