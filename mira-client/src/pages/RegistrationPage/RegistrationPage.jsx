import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from "../../services/registrationservice";
import './RegistrationPage.css'; // Создадим этот файл для стилей

const RegistrationPage = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [project, setProject] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await register(name, surname, email, numberPhone, password, role, project);
            navigate('/kanban', { state: { token } });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <div className="registration-header">
                    <h1>Create an account</h1>
                    <p>Fill in the form to register</p>
                </div>

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Phone number"
                        value={numberPhone}
                        onChange={(e) => setNumberPhone(e.target.value)}
                        className="form-input"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">Choose a role</option>
                        <option value="ROLE_PROJECT_OWNER">Project Owner</option>
                        <option value="ROLE_DEVELOPER">Developer</option>
                        <option value="ROLE_QA">QA</option>
                    </select>

                    <select
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">Select a project</option>
                        <option value="CORE">CORE</option>
                        <option value="DIGITAL">DIGITAL</option>
                    </select>

                    <button type="submit" className="submit-button">Sign up</button>

                    {error && <p className="error-message">{error}</p>}

                    <div className="login-footer">
                        <p>Already have an account? <a href="/" className="login-link">Sign in</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;