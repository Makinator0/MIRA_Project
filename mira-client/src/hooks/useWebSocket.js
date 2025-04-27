// useWebSocket.js
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getToken, getUserFromToken } from "../services/authService"; // подстрой путь если надо

const useWebSocket = () => {
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/kanban-websocket");
        const user = getUserFromToken();
        const token = getToken();

        if (!user) {
            console.error("User not found in token");
            return;
        }

        const currentUserId = user.userId;
        const currentProject = user.project;

        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");

                subscribeToUsers(client);
                subscribeToKanban(client, currentUserId);
                subscribeToSprints(client, currentProject);

                fetchInitialData(client, token);
            },
            onStompError: (frame) => {
                console.error("Broker reported error:", frame.headers["message"], frame.body);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []);

    const fetchInitialData = (client, token) => {
        client.publish({
            destination: "/app/getAllTickets",
            body: JSON.stringify({ token }),
        });
        client.publish({
            destination: "/app/getAllUsers",
            body: "{}",
        });
        client.publish({
            destination: "/app/getSprint",
            body: JSON.stringify({ token }),
        });
    };

    const subscribeToUsers = (client) => {
        client.subscribe("/topic/users", (message) => {
            try {
                const usersData = JSON.parse(message.body);
                setUsers(usersData);
                console.log("Received users:", usersData);
            } catch (error) {
                console.error("Error parsing users message:", error);
            }
        });
    };

    const subscribeToKanban = (client, currentUserId) => {
        client.subscribe("/topic/kanban", (message) => {
            try {
                const messageBody = JSON.parse(message.body);
                const ticketsArray = Array.isArray(messageBody) ? messageBody : [messageBody];
                console.log("Received tickets:", ticketsArray);

                const filteredTickets = ticketsArray.filter(
                    (ticket) =>
                        String(ticket.assignee?.id) === String(currentUserId) ||
                        String(ticket.author?.id) === String(currentUserId)
                );

                console.log("Filtered tickets:", filteredTickets);

                setTickets((prevTickets) => {
                    const newTickets = filteredTickets.filter(
                        (newTicket) => !prevTickets.some((oldTicket) => oldTicket.id === newTicket.id)
                    );
                    return [...prevTickets, ...newTickets];
                });
            } catch (error) {
                console.error("Error processing kanban message:", error);
            }
        });
    };

    const subscribeToSprints = (client, currentProject) => {
        client.subscribe("/topic/sprints", (message) => {
            try {
                const sprintData = JSON.parse(message.body);
                console.log("Received sprints:", sprintData);

                if (Array.isArray(sprintData)) {
                    setSprints((prevSprints) => {
                        const incomingProjectSprints = sprintData.filter(
                            (sprint) => sprint.project === currentProject
                        );
                        const otherProjectsSprints = prevSprints.filter(
                            (sprint) => sprint.project !== currentProject
                        );
                        return [...otherProjectsSprints, ...incomingProjectSprints];
                    });
                } else if (sprintData.project === currentProject) {
                    setSprints((prevSprints) => {
                        const exists = prevSprints.some((sprint) => sprint.id === sprintData.id);
                        return exists
                            ? prevSprints.map((sprint) => (sprint.id === sprintData.id ? sprintData : sprint))
                            : [...prevSprints, sprintData];
                    });
                }
            } catch (error) {
                console.error("Error processing sprint message:", error);
            }
        });
    };

    return { users, tickets, sprints, stompClient };
};

export default useWebSocket;
