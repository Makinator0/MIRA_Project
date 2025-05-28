const API_URL = 'http://localhost:8080';

export const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const register = async (name, surname, email, numberPhone, password, role, project) => {
    const response = await fetch(`${API_URL}/registration`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            surname,
            email,
            numberPhone,
            password,
            role,
            project,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Ошибка при регистрации');
    }

    const token = response.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        throw new Error('Ошибка: токен не найден');
    }

    // Сохраняем токен после регистрации
    setCookie("JWT_TOKEN", token, 1);

    console.log(token);
    return token;
};
