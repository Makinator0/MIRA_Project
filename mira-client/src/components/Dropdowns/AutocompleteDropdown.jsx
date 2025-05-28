import React, { useState, useRef, useEffect } from "react";
import { getUserFromToken } from "../../services/authService";
import "./AutocompleteDropdown.css";

const AutocompleteDropdown = ({
                                  name,
                                  value,
                                  onChange,
                                  users = [],
                                  placeholder,
                                  required = false,
                                  onOpen,
                                  onClose,
                              }) => {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);
    const currentUser = getUserFromToken();

    useEffect(() => {
        if (showDropdown) onOpen?.();
        else onClose?.();
    }, [showDropdown]);

    const updateDropdown = (query) => {
        if (!query) {
            // При пустом запросе - текущий пользователь + 3 других
            const otherUsers = users.filter(user =>
                currentUser ? user.userId !== currentUser.userId : true
            ).slice(0, 4);

            setFilteredUsers(otherUsers);
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = users.filter((user) => {
                const nameMatch = user.name?.toLowerCase().startsWith(lowerQuery);
                const surnameMatch = user.surname?.toLowerCase().startsWith(lowerQuery);
                return nameMatch || surnameMatch;
            });

            // Сортируем - сначала текущий пользователь, затем остальные

            setFilteredUsers(filtered.slice(0, 4));
        }
    };

    const handleInputChange = (e) => {
        onChange(e);
        updateDropdown(e.target.value.toLowerCase());
        setShowDropdown(true);
    };

    const handleFocus = () => {
        updateDropdown(value.toLowerCase());
        setShowDropdown(true);
    };

    const handleBlur = () => {
        setTimeout(() => setShowDropdown(false), 150);
    };

    const handleOptionClick = (user) => {
        const fullName = `${user.name || ''} ${user.surname || ''}`.trim();
        onChange({
            target: { name, value: fullName },
        });
        setShowDropdown(false);
    };

    return (
        <div className="autocomplete-wrapper">
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
                className="autocomplete-input"
            />
            {showDropdown && filteredUsers.length > 0 && (
                <div className="autocomplete-dropdown">
                    {filteredUsers.map((user) => {
                        const fullName = `${user.name || ''} ${user.surname || ''}`.trim();
                        return (
                            <div
                                key={user.userId || user.id}
                                onClick={() => handleOptionClick(user)}
                                className="autocomplete-option"
                            >
                                {fullName || 'No name'}{" "}
                                {currentUser && user.userId === currentUser.userId
                                    ? "(Assign to me)"
                                    : ""}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AutocompleteDropdown;
