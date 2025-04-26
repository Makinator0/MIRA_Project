import React, { useState } from "react";
import {getToken, getUserFromToken} from "../../../services/authService";
import "./CreateTicketModal.css"
import TagInput from "../../InputFields/TagInput/TagInput";
import AutocompleteDropdown from "../../Dropdowns/AutocompleteDropdown";
import {createTicket} from "../../../services/ticketService";
import useWebSocket from "../../../hooks/useWebSocket";


const CreateTicketModal = ({
                               isOpen,
                               onClose,
                               allUsers
                           }) => {
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
    const { stompClient} = useWebSocket();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAssignToMe = (field) => {
        const currentUser = getUserFromToken();
        if (!currentUser) {
            alert("Cannot assign: user is not logged in.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [field]: currentUser.firstName,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagsArray = formData.tags
            .split(" ")
            .map((tag) => tag.trim())
            .filter(Boolean);

        const reporterUser = allUsers.find(
            (user) => user.name === formData.reporter
        );
        const assigneeUser = allUsers.find(
            (user) => user.name === formData.assignee
        );

        // Здесь формируем объект тикета
        const ticketPayload = {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            status: formData.status,
            type: formData.type,
            project: formData.project,
            author: { id: reporterUser.id },
            assignee: assigneeUser ? { id: assigneeUser.id } : null,
            tags: tagsArray,
        };

        try {
            const token = getToken(); // Получаем токен
            const data = await createTicket(ticketPayload, token);
            if (stompClient && stompClient.connected) {
                stompClient.publish({ destination: "/kanban", body: JSON.stringify(data) });

            }
            onClose();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div id="createTicketModal" className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Create New Ticket</h3>
                <form id="createTicketForm" onSubmit={handleSubmit}>
                    {/* Здесь поля формы, как в предыдущем примере */}
                    <label htmlFor="project">Project:</label>
                    <select
                        id="project"
                        name="project"
                        required
                        class="modal-select"
                        value={formData.project}
                        onChange={handleChange}

                    >
                        <option value="CORE">CORE</option>
                        <option value="DIGITAL">DIGITAL</option>
                    </select>
                    <br/>

                    <label htmlFor="title">Summary:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        class="modal-input"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <br/>

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        class="modal-textarea"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                    <br/>

                    <label htmlFor="reporter">Reporter:</label>
                    <AutocompleteDropdown
                        name="reporter"
                        value={formData.reporter}
                        onChange={handleChange}
                        users={allUsers}
                        placeholder="Select reporter"
                        required={true}
                    />
                    <br/>
                    <button type="button" onClick={() => handleAssignToMe("reporter")}>
                        Assign to Me
                    </button>
                    <br/>

                    <label htmlFor="assignee">Assignee:</label>
                    <AutocompleteDropdown
                        name="assignee"
                        value={formData.assignee}
                        onChange={handleChange}
                        users={allUsers}
                        placeholder="Select assignee"
                        required={true}
                    />
                    <br/>
                    <button type="button" onClick={() => handleAssignToMe("assignee")}>
                        Assign to Me
                    </button>
                    <br/>

                    <label htmlFor="type">Type:</label>
                    <select
                        id="type"
                        name="type"
                        class="modal-select"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="BUG">BUG</option>
                        <option value="EPIC">FEATURE</option>
                        <option value="TASK">TASK</option>
                        <option value="STORY">STORY</option>
                    </select>
                    <br/>

                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        required
                        class="modal-select"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="TO_DO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                    </select>
                    <br/>

                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        name="priority"
                        required
                        class="modal-select"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="MINOR">Minor</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="HIGHEST">Highest</option>
                    </select>
                    <br/>

                    <label htmlFor="tags">Tags:</label>
                    <TagInput
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Enter tags separated by spaces"
                    />
                    <br/>

                    <div className="form-buttons">
                        <button type="submit">Create Ticket</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketModal;
