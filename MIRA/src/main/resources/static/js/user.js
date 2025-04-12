

function getUserFromToken() {
    const token = getCookie("JWT_TOKEN");
    if (!token) return null;

    // Декодируем JWT токен
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
        userId: payload.userId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        project: payload.project
    };
}

function populateUserSelectors(users) {
    const reporterContainer = document.getElementById('reporterContainer');
    const assigneeContainer = document.getElementById('assigneeContainer');

    // Создаем текстовые поля с автодополнением для репортера и исполнителя
    createAutocompleteField(reporterContainer, users, true);
    createAutocompleteField(assigneeContainer, users, false);
}
