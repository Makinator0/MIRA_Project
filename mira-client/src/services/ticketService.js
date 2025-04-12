// ticketService.js
const API_URL = 'http://localhost:8080';

export const createTicket = async (ticketData, token) => {
    const response = await fetch(`${API_URL}/api/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
};
export const createSprint = async (sprintData, token) => {
    const response = await fetch(`${API_URL}/api/sprints/start`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(sprintData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
};