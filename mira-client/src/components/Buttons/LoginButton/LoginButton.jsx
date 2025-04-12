import React from 'react';
import './LoginButton.css';

const LoginButton = ({ onClick, children }) => (
    <button className="login-button" onClick={onClick}>
        {children}
    </button>
);

export default LoginButton;
