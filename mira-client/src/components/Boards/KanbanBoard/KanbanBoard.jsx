// KanbanBoard.jsx
import React, {useEffect, useState} from "react";
import {createSprint} from "../../../services/ticketService";
import "./KanbanBoard.css"
import {getToken, getUserFromToken} from "../../../services/authService";
import useWebSocket from "../../../hooks/useWebSocket";


const KanbanBoard = ({ tickets }) => {
    const [currentSprint, setCurrentSprint] = useState(null);
    const user = getUserFromToken();
    console.log(user)

    // Фильтруем тикеты по текущему проекту
    const breadcrumbText =
        user.project === "CORE"
            ? "Projects / Core"
            : user.project === "DIGITAL"
                ? "Projects / Digital Banking"
                : "Projects / Unknown Project";

    // Фильтруем тикеты по текущему проекту
    const filteredTickets = tickets.filter(
        (ticket) => ticket.project === user.project
    );
    // Распределяем тикеты по статусам
    const columns = {
        TO_DO: [],
        IN_PROGRESS: [],
        IN_REVIEW: [],
        DONE: []
    };
    const {  users, sprints, stompClient } = useWebSocket();
    filteredTickets.forEach((ticket) => {
        if (columns[ticket.status]) {
            columns[ticket.status].push(ticket);
        }
    });

    // Функция для генерации JSX для одного тикета
    const renderTicket = (ticket) => {
        // Генерация префикса ID
        const projectPrefix = ticket.project === "CORE" ? "CORE-" : "DIG-";
        const ticketId = `${projectPrefix}${ticket.id}`;

        // Генерация инициалов для исполнителя, если нет аватара
        const assignee = ticket.assignee || {};
        const initials =
            (assignee.name ? assignee.name[0] : "") +
            (assignee.surname ? assignee.surname[0] : "");

        // Форматирование тегов (предполагается, что ticket.tags — массив строк)
        const formattedTags = ticket.tags
            .map((tag) => `#${tag.trim()}`)
            .join(", ");

        // Генерация прогресс-бара по количеству дней с даты создания
        const creationDate = new Date(ticket.createdAt);
        const currentDate = new Date();
        const daysPassed = Math.floor(
            (currentDate - creationDate) / (1000 * 60 * 60 * 24)
        );
        const maxDays = 30; // Максимальное количество дней для прогресс-бара
        let timeContent;
        if (daysPassed === 0) {
            timeContent = <span className="new-ticket">New</span>;
        } else {
            timeContent = (
                <div className="time-line">
                    {Array.from({ length: Math.min(daysPassed, maxDays) }, (_, i) => (
                        <div key={i} className="time-segment filled"></div>
                    ))}
                </div>
            );
        }

        const priorityIconPath = `/images/priority/${ticket.priority.toLowerCase()}.png`;
        const typeIconPath = `/images/types/${ticket.type.toLowerCase()}.png`;
        const typeText =
            ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1).toLowerCase();
        const priorityText =
            ticket.priority.charAt(0).toUpperCase() +
            ticket.priority.slice(1).toLowerCase();

        return (
            <li key={ticket.id} className="kanban-ticket" data-id={ticket.id}>
                <div className="ticket-title">{ticket.title}</div>
                <span className="ticket-tag">{formattedTags}</span>
                <div className="ticket-priority-line">
                    <div className="priority-icon-container">
                        <img
                            src={priorityIconPath}
                            alt={ticket.priority}
                            className="priority-icon"
                        />
                        <span className="tooltip">{priorityText}</span>
                    </div>
                    <div className="time-line-container">
                        {timeContent}
                        <span className="tooltip">{daysPassed} days</span>
                    </div>
                </div>
                <div className="ticket-footer">
                    <div className="ticket-info">
                        <div className="type-icon-container">
                            <img
                                src={typeIconPath}
                                alt={ticket.type}
                                className="type-icon"
                            />
                            <span className="tooltip">{typeText}</span>
                        </div>
                        <span className="ticket-id">{ticketId}</span>
                    </div>
                    <div className="ticket-avatar">
                        {assignee.avatar ? (
                            <img src={assignee.avatar} alt="Avatar" />
                        ) : (
                            <span className="avatar-initials">{initials.toUpperCase()}</span>
                        )}
                    </div>
                </div>
            </li>
        );
    };
    useEffect(() => {
        if (sprints && sprints.length > 0) {
            console.log("Обновляем спринт:", sprints[sprints.length - 1].name);
            setCurrentSprint(sprints[sprints.length - 1].name);
        } else {
            setCurrentSprint(null);
        }
    }, [sprints]);
    const startNewSprint = async () => {
        try {
            const token = getToken();
            const sprintNumber = currentSprint
                ? parseInt(currentSprint.split(" ")[1]) + 1
                : 1;
            const sprintPayload = {
                name: `Sprint ${sprintNumber}`,
                startDate: new Date().toISOString(),
                project : user.project
            };

            const newSprint = await createSprint(sprintPayload, token);
            console.log("Новый спринт создан:", newSprint);
            // Публикуем обновление спринта через WebSocket

            // Обновление текущего спринта произойдет через подписку в useWebSocket
        } catch (error) {
            console.error("Ошибка при запуске нового спринта:", error);
        }
    };
    return (
        <>
            <nav className="breadcrumb" id="breadcrumb">
                {breadcrumbText}
            </nav>

            <div className="sprint-controls">
  <span className="current-sprint">
    {currentSprint ? currentSprint : "Sprint not started"}
  </span>
                {user && user.role === "[ROLE_PROJECT_OWNER]" && (
                    <button className="btn-new-sprint" onClick={startNewSprint} >
                        Start new sprint
                    </button>
                )}
            </div>


            <div className="kanban-board">
                {/* Колонка "To Do" */}
                <div id="todo" className="kanban-column">
                    <div className="kanban-header">To Do</div>
                    <ul id="todo-tasks" className="kanban-tasks">
                        {columns.TO_DO.map(renderTicket)}
                    </ul>
                </div>

                {/* Колонка "In Progress" */}
                <div id="in-progress" className="kanban-column">
                    <div className="kanban-header">In Progress</div>
                    <ul id="in-progress-tasks" className="kanban-tasks">
                        {columns.IN_PROGRESS.map(renderTicket)}
                    </ul>
                </div>

                {/* Колонка "In Review" */}
                <div id="in-review" className="kanban-column">
                    <div className="kanban-header">In Review</div>
                    <ul id="in-review-tasks" className="kanban-tasks">
                        {columns.IN_REVIEW.map(renderTicket)}
                    </ul>
                </div>

                {/* Колонка "Done" */}
                <div id="done" className="kanban-column">
                    <div className="kanban-header">Done</div>
                    <ul id="done-tasks" className="kanban-tasks">
                        {columns.DONE.map(renderTicket)}
                    </ul>
                </div>
            </div>
        </>
    );

};

export default KanbanBoard;
