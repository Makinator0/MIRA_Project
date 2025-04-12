import React, { useEffect, useState } from "react";
import './HeaderNavTab.css';
import CreateTicketModal from "../ModalWindows/CreateTicketModal/CreateTicketModal";
import useWebSocket from "../../hooks/useWebSocket";
import { getUserFromToken } from '../../services/authService'; // Путь на два уровня вверх

const NavTabs = () => {
    const [activeTab, setActiveTab] = useState("");
    useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes("/backlog")) {
            setActiveTab("backlog");
        } else if (currentPath.includes("/kanban")) {
            setActiveTab("kanban");
        } else if (currentPath.includes("/reports")) {
            setActiveTab("reports");
        } else if (currentPath.includes("/chat")) {
            setActiveTab("chat");
        } else if (currentPath.includes("/tempo")) {
            setActiveTab("tempo");
        }
    }, []);
    const openModal = () => {
        setModalOpen(true);
    };
    const user = getUserFromToken();
    // Подключаем WebSocket через кастомный хук
    const { users, stompClient} = useWebSocket();

    const closeModal = () => {
        setModalOpen(false);
    };
    const [isModalOpen, setModalOpen] = useState(false);
    return (
        <div className="nav-tabs">
            <a href="/backlog" className={`nav-tab ${activeTab === "backlog" ? "active" : ""}`}>Backlog</a>
            <a href="/kanban" className={`nav-tab ${activeTab === "kanban" ? "active" : ""}`}>Active Sprint</a>
            {user && user.role === "[ROLE_PROJECT_OWNER]" && (
                <a href="/reports" className={`nav-tab ${activeTab === "reports" ? "active" : ""}`}>Reports</a>
            )}
            <a href="/chat" className={`nav-tab ${activeTab === "chat" ? "active" : ""}`}>Chat</a>
            <a href="/tempo" className={`nav-tab ${activeTab === "tempo" ? "active" : ""}`}>Tempo</a>
            <button className="btn-create" onClick={openModal}>Create</button>
            <CreateTicketModal
                isOpen={isModalOpen}
                onClose={closeModal}
                allUsers={users}
                stompClient={stompClient}
            />
        </div>
    );
};

export default NavTabs;
