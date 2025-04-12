function getCookie(name) {
    const nameEq = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(nameEq) === 0) {
            return cookie.substring(nameEq.length);
        }
    }
    return null;
}

let tokene = getCookie("JWT_TOKEN");
fetch('/kanban', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${tokene}`,  // Здесь отправляем токен через заголовок
    }
})
function assignToMe(containerId) {
    const currentUser = getUserFromToken();
    if (!currentUser) {
        alert('Cannot assign: user is not logged in.');
        return;
    }

    const container = document.getElementById(containerId);
    const inputField = container.querySelector('input');

    if (inputField) {
        inputField.value = `${currentUser.firstName}`;
    } else {
        alert('Input field not found.');
    }
}
// Отправка формы для создания тикета
document.getElementById("createTicketForm").onsubmit = function (event) {
    event.preventDefault(); // Чтобы форма не перезагружала страницу

    // Получаем данные из формы
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var priority = document.getElementById("priority").value;
    var status = document.getElementById("status").value;
    var type = document.getElementById("type").value;
    var project = document.getElementById("project").value;
    var tagsInput = document.getElementById("tags").value;

    // Преобразуем строку тегов в массив, разделяя их по запятым
    var tags = tagsInput.split(' ').map(tag => tag.trim()).filter(tag => tag !== "");

    // Получаем значения из полей автозаполнения
    const reporterInput = document.querySelector("#reporterContainer .autocomplete-input");
    const assigneeInput = document.querySelector("#assigneeContainer .autocomplete-input");

    const reporterName = reporterInput ? reporterInput.value : null;
    const assigneeName = assigneeInput ? assigneeInput.value : null;

    // Получаем ID репортера и исполнителя из данных пользователей
    const author = allUsers.find(user => user.name === reporterName);
    const assignee = allUsers.find(user => user.name === assigneeName);
    console.log(author)
    console.log(assignee)
    // Проверяем наличие авторов
    if (!author) {
        alert("Author not found");
        return;
    }

    // Получаем токен из куки
    var token = getCookie("JWT_TOKEN");

    if (!token) {
        alert("No token found. Please log in.");
        window.location.href = "/login"; // Перенаправление на страницу логина, если токен не найден
        return;
    }

    // Отправляем запрос на сервер для создания тикета
    fetch("/api/tickets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token // Добавляем токен в заголовок
        },
        body: JSON.stringify({
            title: title,
            description: description,
            priority: priority,
            status: status,
            type: type,
            project: project,
            author: {
                id: author.id // Указываем ID автора
            },
            assignee: assignee ? { id: assignee.id } : null,
            tags: tags // Добавляем массив тегов
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (stompClient && stompClient.connected) {
                stompClient.send('/kanban', {}, JSON.stringify(data));
            }
            // Закрываем модальное окно
            closeModal();
        })
        .catch(error => {
            console.error("Error:", error);
        });
};