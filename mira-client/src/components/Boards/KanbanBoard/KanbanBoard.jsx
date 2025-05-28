import React, { useEffect, useState } from "react";
import { createSprint, updateTicket } from "../../../services/ticketService";
import "./KanbanBoard.css";
import { getToken, getUserFromToken } from "../../../services/authService";
import useWebSocket from "../../../hooks/useWebSocket";
import { useNavigate } from "react-router-dom";

const KanbanBoard = ({ tickets }) => {
    const [currentSprint, setCurrentSprint] = useState(null);
    const navigate = useNavigate();
    const user = getUserFromToken();
    const { users, sprints, stompClient } = useWebSocket();

    const breadcrumbText =
        user.project === "CORE"
            ? "Projects / Core"
            : user.project === "DIGITAL"
                ? "Projects / Digital Banking"
                : "Projects / Unknown Project";

    const filteredTickets = tickets.filter(
        (ticket) => ticket.project === user.project
    );

    const columns = {
        TO_DO: [],
        IN_PROGRESS: [],
        IN_REVIEW: [],
        DONE: []
    };

    filteredTickets.forEach((ticket) => {
        if (columns[ticket.status]) {
            columns[ticket.status].push(ticket);
        }
    });

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const ticketId = e.dataTransfer.getData("ticketId");
        const token = getToken();

        try {
            await updateTicket(ticketId, { status: newStatus }, token);
            console.log(`Статус тикета ${ticketId} оновлено до ${newStatus}`);
            // Не обов’язково перезавантажувати — зміни прийдуть по WebSocket
        } catch (error) {
            console.error("Не вдалося оновити статус:", error);
        }
    };

    const renderTicket = (ticket) => {
        const ticketId = ticket.displayId;
        const assignee = ticket.assignee || {};
        const initials =
            (assignee.name ? assignee.name[0] : "") +
            (assignee.surname ? assignee.surname[0] : "");

        const formattedTags = ticket.tags
            .map((tag) => `#${tag.trim()}`)
            .join(", ");

        const creationDate = new Date(ticket.createdAt);
        const currentDate = new Date();
        const daysPassed = Math.floor(
            (currentDate - creationDate) / (1000 * 60 * 60 * 24)
        );

        const maxDays = 30;
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
            ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1).toLowerCase();

        return (
            <li
                key={ticket.id}
                className="kanban-ticket"
                data-id={ticket.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("ticketId", ticket.id)}
                onClick={() =>
                    navigate(`/tickets/${ticket.displayId}`, { state: { ticketId: ticket.id } })
                }
                style={{ cursor: "pointer" }}
            >
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
                project: user.project
            };

            const newSprint = await createSprint(sprintPayload, token);
            console.log("Новый спринт создан:", newSprint);
        } catch (error) {
            console.error("Ошибка при запуске нового спринта:", error);
        }
    };

    const renderColumn = (status, title) => (
        <div
            id={status.toLowerCase()}
            className="kanban-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
        >
            <div className="kanban-header">{title}</div>
            <ul className="kanban-tasks">
                {columns[status].map(renderTicket)}
            </ul>
        </div>
    );

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
                    <button className="btn-new-sprint" onClick={startNewSprint}>
                        Start new sprint
                    </button>
                )}
            </div>

            <div className="kanban-board">
                {renderColumn("TO_DO", "To Do")}
                {renderColumn("IN_PROGRESS", "In Progress")}
                {renderColumn("IN_REVIEW", "In Review")}
                {renderColumn("DONE", "Done")}
            </div>
        </>
    );
};

export default KanbanBoard;
