import React from 'react';

const LoginErrorMessage = ({ message }) => {
    return message ? <p style={{ color: 'red' }}>{message}</p> : null;
};

export default LoginErrorMessage;