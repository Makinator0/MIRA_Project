import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../../services/authService";
import "./HeaderUserAvatar.css"


const UserAvatar = () => {
    const [initials, setInitials] = useState("");
    const [bgColor, setBgColor] = useState("");

    useEffect(() => {
        const user = getUserFromToken();
        if (user) {
            const userFirstName = user.firstName || ''; // Извлекаем имя
            console.log(userFirstName)
            const userLastName = user.lastName || ''; // Извлекаем фамилию
            console.log(userLastName)
            const userInitials = `${userFirstName ? userFirstName.substring(0, 1).toUpperCase() : ''}${userLastName ? userLastName.substring(0, 1).toUpperCase() : ''}`;
            setInitials(userInitials);
        }

        // Массив возможных цветов фона
        const colors = ['green', 'red', 'orange'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setBgColor(randomColor);
    }, []);

    return (
        <div className="avatar" style={{ backgroundColor: bgColor }}>
            <span className="avatar-initials">{initials}</span>
        </div>
    );
};

export default UserAvatar;
