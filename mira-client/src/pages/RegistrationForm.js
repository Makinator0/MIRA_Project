import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {register} from "../services/registrationservice";

const RegistrationForm = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [project, setProject] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Для перенаправления

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await register(surname,  email, numberPhone, password, role, project);
            navigate('/kanban', { state: { token } });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Фамилия"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Номер телефона"
                value={numberPhone}
                onChange={(e) => setNumberPhone(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Выберите роль</option>
                <option value="ROLE_PROJECT_OWNER">Project Owner</option>
                <option value="ROLE_DEVELOPER">Developer</option>
                <option value="ROLE_QA">QA</option>
            </select>
            <select value={project} onChange={(e) => setProject(e.target.value)}>
                <option value="">Выберите проект</option>
                <option value="CORE">CORE</option>
                <option value="DIGITAL">DIGITAL</option>
            </select>
            <button type="submit">Зарегистрироваться</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default RegistrationForm;
