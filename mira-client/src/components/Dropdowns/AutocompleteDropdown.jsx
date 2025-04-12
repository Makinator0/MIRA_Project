import React, { useState, useRef } from "react";
import { getUserFromToken } from "../../services/authService";

const AutocompleteDropdown = ({
                                  name,
                                  value,
                                  onChange,
                                  users = [],
                                  placeholder,
                                  required = false,
                              }) => {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);
    const currentUser = getUserFromToken();

    const updateDropdown = (query) => {
        if (!query) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter((user) =>
                user.name.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }
    };

    const handleInputChange = (e) => {
        onChange(e); // Обновляем значение поля в родительском состоянии
        const query = e.target.value.toLowerCase();
        updateDropdown(query);
        setShowDropdown(true);
    };

    const handleFocus = () => {
        updateDropdown(value.toLowerCase());
        setShowDropdown(true);
    };

    const handleBlur = () => {
        // Немного задерживаем скрытие, чтобы клик по элементу зарегистрировался
        setTimeout(() => setShowDropdown(false), 150);
    };

    const handleOptionClick = (user) => {
        onChange({
            target: { name, value: user.name },
        });
        setShowDropdown(false);
    };

    return (
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                required={required}
                ref={inputRef}
                style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                }}
            />
            {showDropdown && filteredUsers.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "#2c3e50",
                        border: "1px solid #ccc",
                        maxHeight: "150px",
                        overflowY: "auto",
                        zIndex: 1000,
                    }}
                >
                    {filteredUsers.map((user) => (
                        <div
                            key={user.userId}
                            onClick={() => handleOptionClick(user)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            {user.name}{" "}
                            {currentUser && user.userId === currentUser.userId ? "(Assign to me)" : ""}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutocompleteDropdown;
