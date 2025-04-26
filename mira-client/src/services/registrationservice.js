const API_URL = 'http://localhost:8080';

export const register = async (name, surname,  email, numberPhone, password, role, project) => {
        const response = await fetch('http://localhost:8080/registration', {
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
            throw new Error( errorText || 'Ошибка при регистрации');
        }
    const token = response.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        throw new Error('Ошибка: токен не найден');
    }
    return token;
};