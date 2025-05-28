import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {getTicketById, updateTicket} from "../../services/ticketService";
import {getToken, getUserFromToken} from "../../services/authService";
import './TicketDetailsPage.css';
import Header from "../../components/Headers/KanbanHeader";
import useWebSocket from "../../hooks/useWebSocket";
import UserSelectorField from "../../components/InputFields/UserSelectorField/UserSelectorField";

const TicketDetailsPage = () => {
    const { ticketDisplayId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const { users, stompClient} = useWebSocket();
    const ticketId = location.state?.ticketId;
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const token = getToken();
                const fetchedTicket = await getTicketById(ticketId, token);
                setTicket(fetchedTicket);
                console.log(fetchedTicket)
            } catch (error) {
                console.error("Ошибка загрузки тикета:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [ticketId]);
    const [formData, setFormData] = useState({
        project: "CORE",
        title: "",
        description: "",
        reporter: "",
        assignee: "",
        type: "TASK",
        status: "TO_DO",
        priority: "MINOR",
        tags: "",
    });
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = getToken();
            const ticketToUpdate = {
                ...ticket,
                author: { id: reporterUser?.id || ticket.author.id },
                assignee: assigneeUser ? { id: assigneeUser.id } : null,
            };
            await updateTicket(ticketId, ticketToUpdate, token);

            // Обновляем данные тикета после сохранения
            const updatedTicket = await getTicketById(ticketId, token);
            setTicket(updatedTicket);

            // Можно добавить уведомление об успешном сохранении
            alert("Ticket saved successfully!");
        } catch (error) {
            console.error("Ошибка при сохранении тикета:", error);
            alert("Failed to save ticket");
        } finally {
            setIsSaving(false);
        }
    };
    const reporterUser = users.find(
        (user) => `${user.name || ''} ${user.surname || ''}`.trim() === formData.reporter
    );

    const assigneeUser = users.find(
        (user) => `${user.name || ''} ${user.surname || ''}`.trim() === formData.assignee
    );

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'MINOR': return 'priority-low';
            case 'MAJOR': return 'priority-medium';
            case 'CRITICAL': return 'priority-high';
            default: return '';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'CORE': return 'type-core';
            case 'FEATURE': return 'type-feature';
            case 'BUG': return 'type-bug';
            default: return '';
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const currentUser = getUserFromToken();
    const breadcrumbText =
        currentUser.project === "CORE"
            ? "Projects / Core"
            : currentUser.project === "DIGITAL"
                ? "Projects / Digital Banking"
                : "Projects / Unknown Project";

    if (loading) return <div>Loading...</div>;
    if (!ticket) return <div>Тикет не найден.</div>;

    return (
        <>
            <Header/>
            <nav className="breadcrumb" id="breadcrumb">
                {breadcrumbText}
            </nav>
            <div className="ticket-details-container">
                <div className="ticket-layout">
                    {/* Левая часть - основное содержимое */}
                    <div className="ticket-main-content">
                        <div className="ticket-header">
                            <input
                                type="text"
                                className="ticket-title-input"
                                value={ticket.title || "Untitled Ticket"}
                                onChange={(e) => setTicket({...ticket, title: e.target.value})}
                            />
                            <span className={`ticket-status ${ticket.status.toLowerCase().replace('_', '-')}`}>
    {ticket.status.replace('_', ' ')}
  </span>
                        </div>


                        <div className="ticket-section">
                            <h3 className="section-label">Description</h3>
                            <textarea
                                className="ticket-description-input"
                                value={ticket.description || ""}
                                onChange={(e) => setTicket({...ticket, description: e.target.value})}
                                placeholder="No description provided"
                            />
                        </div>


                    </div>

                    {/* Вертикальная разделительная линия */}
                    <div className="ticket-divider"></div>

                    {/* Правая часть - боковая панель */}
                    <div className="ticket-sidebar">
                        {/* Секция статуса */}
                        <div className="sidebar-section">
                            <h3 className="label">Status</h3> {/* Добавлен класс "label" */}
                            <select
                                className="status-select"
                                value={ticket.status}
                                onChange={(e) => setTicket({...ticket, status: e.target.value})}
                            >
                                <option value="TO_DO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="IN_REVIEW">In Review</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>

                        {/* Секция Assigner и Reporter */}
                        <div className="sidebar-section">
                            <h3 className="label">People</h3>

                            <div className="assignee-reporter-container">
                                {/* Assignee */}
                                <br/>
                                <UserSelectorField
                                    label="Assignee"
                                    fieldName="assignee"
                                    value={formData.assignee}
                                    onChange={handleChange}
                                    setFormData={setFormData}
                                    users={users}
                                    required
                                    defaultDisplayName={`${ticket.assignee.name} ${ticket.assignee.surname}`}
                                />

                                <br/>
                                <UserSelectorField
                                    label="Reporter"
                                    fieldName="reporter"
                                    value={formData.reporter}
                                    onChange={handleChange}
                                    setFormData={setFormData}
                                    users={users}
                                    required
                                    defaultDisplayName={`${ticket.author.name} ${ticket.author.surname}`}
                                />
                            </div>
                        </div>

                        {/* Секция Development (пока пустая) */}
                        <div className="sidebar-section">
                            <h3 className="label">Development</h3>
                            <div className="development-content">
                                {/* Здесь будет контент для Development */}
                                <p>Development info will be here</p>
                            </div>
                        </div>

                        {/* Секция Tags */}
                        <div className="sidebar-section">
                            <h3 className="label">Tags</h3>
                            <div className="tags-container">
                                {ticket.tags && ticket.tags.length > 0 ? (
                                    ticket.tags.map((tag, index) => (
                                        <span key={index} className="tag">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <p>No tags</p>
                                )}
                            </div>
                        </div>

                        {/* Секция Priority и Type */}
                        <div className="sidebar-section">
                            {/* Priority */}
                            <div className="sidebar-item">
                                <label htmlFor="priority" className="label">Priority:</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    className="modal-select"
                                    value={ticket.priority}
                                    onChange={(e) => setTicket({...ticket, priority: e.target.value})}
                                >
                                    <option value="MINOR">Minor</option>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="HIGHEST">Highest</option>
                                </select>
                            </div>

                            {/* Type */}
                            <div className="sidebar-item">
                                <label htmlFor="type" className="label">Type:</label>
                                <select
                                    id="type"
                                    name="type"
                                    className="modal-select"
                                    value={ticket.type}
                                    onChange={(e) => setTicket({...ticket, type: e.target.value})}
                                >
                                    <option value="BUG">BUG</option>
                                    <option value="FEATURE">Feature</option>
                                    <option value="TASK">Task</option>
                                    <option value="STORY">Story</option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="ticket-actions">
                    <button
                        onClick={() => navigate(-1)}
                        className="back-button"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={handleSave}
                        className="save-button"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default TicketDetailsPage;