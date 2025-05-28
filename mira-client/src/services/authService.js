const API_URL = 'http://localhost:8080';
// Утилиты для работы с cookies
export const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};
export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Неверный логин или пароль');
    }

    const token = response.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        throw new Error('Ошибка: токен не найден');
    }

    // Сохраняем токен сразу после получения
    setCookie("JWT_TOKEN", token, 1);

    return token;
};
export const validateToken = async (token) => {
    const response = await fetch(`${API_URL}/auth/validate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        throw new Error("Токен недействителен");
    }

    // Если токен валиден, сохраняем его в localStorage
    setCookie("JWT_TOKEN", token, 1);

    return true;
};
export const getUserFromToken = () => {
    const token = getCookie("JWT_TOKEN");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            userId: payload.userId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            project: payload.project,
            role: payload.role
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
// Функция для получения токена из cookie
export const getToken = () => {
    return getCookie("JWT_TOKEN");
};


