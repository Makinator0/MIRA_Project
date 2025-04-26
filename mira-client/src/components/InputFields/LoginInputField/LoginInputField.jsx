import React from "react";
import "./LoginInputField.css"
const LoginInputField = ({ type, placeholder, value, onChange, required }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="input-field"
    />
);

export default LoginInputField;
