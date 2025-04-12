// File 3: ui.js

function updateBoardWithTickets(tickets, currentProject) {
    if (!Array.isArray(tickets)) {
        tickets = [tickets];
    }

    const todoColumn = document.getElementById('todo-tasks');
    const inProgressColumn = document.getElementById('in-progress-tasks');
    const inReviewColumn = document.getElementById('in-review-tasks');
    const doneColumn = document.getElementById('done-tasks');

    tickets.forEach(ticket => {
        // Пропускаем тикеты, которые не принадлежат текущему проекту
        if (ticket.project !== currentProject) {
            return;
        }


        if (document.querySelector(`li[data-id="${ticket.id}"]`)) {
            return; // Пропускаем, если тикет уже есть на доске
        }

        let ticketElement = document.createElement('li');
        ticketElement.className = 'kanban-ticket';
        ticketElement.setAttribute('data-id', ticket.id);

        // Генерация ID с префиксом
        const projectPrefix = ticket.project === 'CORE' ? 'CORE-' : 'DIG-';
        const ticketId = `${projectPrefix}${ticket.id}`;

        // Генерация инициалов
        const assignee = ticket.assignee || {};
        const initials = (assignee.name?.substring(0, 1) || '') +
            (assignee.surname?.substring(0, 1) || '');

        // Преобразование тегов: удаляем пробелы и добавляем #
        const formattedTags = ticket.tags
            .map(tag => `#${tag.trim()}`) // Убираем пробелы и добавляем #
            .join(', '); // Объединяем теги через запятую
        // Генерация прогрес бара
        const creationDate = new Date(ticket.createdAt);
        const currentDate = new Date();
        const daysPassed = Math.floor((currentDate - creationDate) / (1000 * 60 * 60 * 24));
        const maxDays = 30; // Максимальный срок для прогресс-бара
        let timeContent;
        if (daysPassed === 0) {
            timeContent = '<span class="new-ticket">New</span>';
        } else {
            timeContent = Array.from({ length: Math.min(daysPassed, maxDays) }, (_, i) => `
        <div class="time-segment filled"></div>
    `).join('');
        }

        const priorityIconPath = `/images/priority/${ticket.priority.toLowerCase()}.png`; // Формируем путь к изображению
        const typeIconPath = `/images/types/${ticket.type.toLowerCase()}.png`; // Например, "/images/types/bug.png"
        const typeText = ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1).toLowerCase();
        const priorityText = ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1).toLowerCase();

        // Создаем содержимое тикета
        ticketElement.innerHTML = `
            <div class="ticket-title">${ticket.title}</div>
            <span class="ticket-tag">${formattedTags}</span>
            <div class="ticket-priority-line">
        <div class="priority-icon-container">
            <img src="${priorityIconPath}" alt="${ticket.priority}" class="priority-icon">
            <span class="tooltip">${priorityText}</span>
        </div>
        <div class="time-line-container">
            <div class="time-line">
                ${timeContent}
            </div>
            <span class="tooltip">${daysPassed} days</span>
        </div>
    </div>
            <div class="ticket-footer">
        <div class="ticket-info">
            <div class="type-icon-container">
                <img src="${typeIconPath}" alt="${ticket.type}" class="type-icon">
                <span class="tooltip">${typeText}</span>
            </div>
            <span class="ticket-id">${ticketId}</span>
        </div>
        <div class="ticket-avatar">
            ${assignee.avatar
            ? `<img src="${assignee.avatar}" alt="Avatar">`
            : `<span class="avatar-initials">${initials.toUpperCase()}</span>`}
        </div>
    </div>
        `;

        // Определяем колонку
        switch (ticket.status) {
            case 'TO_DO':
                todoColumn.appendChild(ticketElement);
                break;
            case 'IN_PROGRESS':
                inProgressColumn.appendChild(ticketElement);
                break;
            case 'IN_REVIEW':
                inReviewColumn.appendChild(ticketElement);
                break;
            case 'DONE':
                doneColumn.appendChild(ticketElement);
                break;
        }
    });
}
function updateBreadcrumb() {
    const user = getUserFromToken();
    console.log(user.project)

    // Предположим, что эта функция получает данные пользователя
    if (!user) {
        document.getElementById('breadcrumb').innerHTML = `Projects / Unauthorized`;
        return;
    }
    const userFirstName = user.firstName || ''; // Извлекаем имя
    const userLastName = user.lastName || ''; // Извлекаем фамилию
    const initials = `${userFirstName ? userFirstName.substring(0, 1).toUpperCase() : ''}${userLastName ? userLastName.substring(0, 1).toUpperCase() : ''}`;

    // Создаем строку breadcrumb через шаблон
    const breadcrumbTemplate = `Projects / ${user.project === 'CORE'
        ? 'Core'
        : (user.project === 'DIGITAL'
            ? 'Digital Banking'
            : 'Unknown Project')}`;

    // Устанавливаем breadcrumb
    document.getElementById('breadcrumb').innerHTML = breadcrumbTemplate;
    // Вставляем инициал в элемент с id 'avatar-initials' (если нужен такой элемент)
    document.getElementById('avatar-initials').innerHTML = initials;
}
document.addEventListener('DOMContentLoaded', function() {
    updateBreadcrumb();
});


function createAutocompleteField(container, users, isReporter) {
    // Очистим контейнер
    container.innerHTML = '';
    const currentUser = getUserFromToken();
    // Создаем текстовое поле
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = isReporter ? 'Select reporter' : 'Select an assignee';
    inputField.className = 'autocomplete-input';
    inputField.setAttribute('required', 'true');

    // Создаем контейнер для выпадающего списка
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.display = 'none';
    dropdown.style.transition = 'max-height 0.3s ease'; // Плавное появление

    // Обновление списка пользователей
    const updateDropdown = (query = '', isFocus = false) => {
        dropdown.innerHTML = '';
        dropdown.style.display = 'block';

        // Фильтруем пользователей по вводу
        const filteredUsers = users.filter(user =>
            `${user.name}`.toLowerCase().includes(query)
        ).slice(0, 4); // Показываем только первых 4 пользователей
        console.log('Filtered users:', filteredUsers); // Проверяем фильтр
        // Создаем элементы выпадающего списка
        filteredUsers.forEach((user, index) => {
            const option = document.createElement('div');
            option.className = 'autocomplete-option';
            option.textContent = `${user.name}`;

            // Добавляем пометку для текущего пользователя только при фокусе
            if (currentUser && user.userId == currentUser.userId) {
                option.textContent += ' (Assign to me)';
            }

            option.addEventListener('click', () => {
                inputField.value = `${user.name}`;
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(option);
        });

        // Скрываем выпадающий список, если нет подходящих результатов
        if (filteredUsers.length === 0) {
            dropdown.style.display = 'none';
        }
    };

    // Обрабатываем ввод текста
    inputField.addEventListener('input', () => {
        const query = inputField.value.toLowerCase();
        updateDropdown(query, false);
    });

    // Показываем первых 4 пользователей при фокусе
    inputField.addEventListener('focus', () => {
        updateDropdown('', true);
    });

    // Скрываем выпадающий список при потере фокуса
    inputField.addEventListener('blur', () => {
        setTimeout(() => dropdown.style.display = 'none', 200);
    });

    // Добавляем текстовое поле и выпадающий список в контейнер
    container.appendChild(inputField);
    container.appendChild(dropdown);
}
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname; // Получаем текущий путь URL
    const tabs = document.querySelectorAll('.nav-tab'); // Все вкладки

    tabs.forEach(tab => {
        if (currentPath.includes(tab.getAttribute('href'))) {
            tab.classList.add('active'); // Добавляем класс active на совпавшую вкладку
        }
    });
});
function updateTagInlineSuggestion(inputElement) {
    const suggestions = ["Release", "Feature", "Development"];
    const query = inputElement.value.toLowerCase();
    const suggestionElement = document.getElementById('tagSuggestion');

    // Получаем последний введенный тег
    const tags = query.split(' ');
    const currentTag = tags[tags.length - 1];

    if (currentTag.trim() === '') {
        suggestionElement.textContent = '';
        return;
    }

    const match = suggestions.find(tag => tag.toLowerCase().startsWith(currentTag));

    if (match) {
        const suggestionPart = match.substring(currentTag.length);
        suggestionElement.textContent = inputElement.value + suggestionPart;
        suggestionElement.style.color = 'rgba(0, 0, 0, 0.3)';
    } else {
        suggestionElement.textContent = '';
    }
}
function checkTab(event) {
    if (event.key === 'Tab') {
        event.preventDefault(); // Предотвращаем стандартное поведение Tab
        const inputElement = event.target;
        const suggestionElement = document.getElementById('tagSuggestion');
        inputElement.value = suggestionElement.textContent + ' ';
        suggestionElement.textContent = '';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const tabs = document.querySelectorAll('.nav-tab');

    tabs.forEach(tab => {
        if (currentPath.includes(tab.getAttribute('href'))) {
            tab.classList.add('active');
        }
    });

    // Массив возможных цветов фона
    const colors = ['green', 'red', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Применяем выбранный цвет фона к элементу avatar
    const avatarElement = document.querySelector('.avatar');
    avatarElement.style.backgroundColor = randomColor;

});

function openModal() {
    document.getElementById('createTicketModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('createTicketModal').style.display = 'none';
}

