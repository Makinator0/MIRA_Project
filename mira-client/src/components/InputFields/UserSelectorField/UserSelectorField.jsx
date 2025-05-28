import React, {useMemo, useState} from "react";
import AutocompleteDropdown from "../../Dropdowns/AutocompleteDropdown";
import {getUserFromToken} from "../../../services/authService";
import "./UserSelectorField.css"; // подключи CSS

interface UserSelectorFieldProps {
    label: string;
    fieldName: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    users: User[];
    required?: boolean;
    defaultDisplayName?: string; // 🆕 проп
}

const UserSelectorField: React.FC<UserSelectorFieldProps> = ({
                                                                 label,
                                                                 fieldName,
                                                                 value,
                                                                 onChange,
                                                                 setFormData,
                                                                 users,
                                                                 required = false,
                                                                 defaultDisplayName,
                                                             }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const selectedUserName = useMemo(() => {
        const found = users.find(u => u.name === value);
        return found ? `${found.name} ${found.surname}` : value;
    }, [value, users]);
    const handleAssignToMe = () => {
        const currentUser = getUserFromToken();
        if (!currentUser) {
            alert("Cannot assign: user is not logged in.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [fieldName]: `${currentUser.firstName} ${currentUser.lastName}`,
        }));
    };

    const assignLabel = fieldName === "reporter" ? "Report Myself" : "Assign to Me";

    return (
        <div className="user-selector">
            <label htmlFor={fieldName}>{label}:</label>
            <AutocompleteDropdown
                name={fieldName}
                value={value}
                onChange={onChange}
                users={users}
                placeholder={defaultDisplayName || `Select ${label.toLowerCase()}`} // 🧠 тут головне
                required={required}
                className="dropdown-input"
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
            />
                <button type="button" className="assign-button" onClick={handleAssignToMe}>
                    {assignLabel}
                </button>
        </div>
    );
};

export default UserSelectorField;
