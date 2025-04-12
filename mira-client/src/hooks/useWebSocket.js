// useWebSocket.js
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {getToken, getUserFromToken} from "../services/authService"; // подстройте путь

const useWebSocket = () => {
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [sprints, setSprints] = useState([]);

    useEffect(() => {
        // Создаем SockJS-соединение
        const socket = new SockJS("http://localhost:8080/kanban-websocket");


        // Создаем клиента STOMP
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000, // авто-переподключение через 5 сек.
            onConnect: (frame) => {
                console.log("Connected: ", frame);

                const user = getUserFromToken();
                if (!user) {
                    console.error("User not found in token");
                    return;
                }
                const currentUserId = user.userId;
                const token = getToken();


                // Отправляем запрос на получение тикетов и пользователей
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
                    body: "{}",
                });
                // Подписываемся на топик пользователей
                client.subscribe("/topic/users", (message) => {
                    try {
                        const usersData = JSON.parse(message.body);
                        setUsers(usersData);
                        console.log("Received data: ", message.body);
                    } catch (error) {
                        console.error("Error parsing users message:", error);
                    }
                });

                // Подписываемся на топик канбана
                client.subscribe("/topic/kanban", (message) => {
                    try {
                        const messageBody = JSON.parse(message.body);
                        const ticketsArray = Array.isArray(messageBody) ? messageBody : [messageBody];
                        console.log("Полученные тикеты:", ticketsArray);
                        const filteredTickets = ticketsArray.filter(
                            (ticket) =>
                                String(ticket.assignee.id) === String(currentUserId) ||
                                String(ticket.author.id) === String(currentUserId)
                        );
                        console.log("Новые тикеты для добавления:", filteredTickets);

                        // Объединяем новые тикеты с уже существующими, не удаляя старые
                        setTickets(prevTickets => {
                            // Фильтруем только те, которых ещё нет в предыдущем состоянии
                            const newTickets = filteredTickets.filter(
                                (newTicket) => !prevTickets.some((oldTicket) => oldTicket.id === newTicket.id)
                            );
                            return [...prevTickets, ...newTickets];
                        });
                    } catch (error) {
                        console.error("Ошибка при обработке сообщения WebSocket:", error);
                    }
                });
                client.subscribe("/topic/sprints", (message) => {
                    try {
                        const sprintData = JSON.parse(message.body);
                        console.log("Received sprint update:", sprintData);

                        if (Array.isArray(sprintData)) {
                            // Обновляем список спринтов целиком
                            setSprints(sprintData);
                        } else {
                            // Если пришёл отдельный объект — добавляем его, если его ещё нет
                            setSprints(prevSprints => {
                                const exists = prevSprints.some(s => s.id === sprintData.id);
                                return exists ? prevSprints : [...prevSprints, sprintData];
                            });
                        }


                    } catch (error) {
                        console.error("Error processing sprint message:", error);
                    }
                });




            },
            onStompError: (frame) => {
                console.error("Broker reported error: ", frame.headers["message"], frame.body);
            },
        });

        // Активируем клиента
        client.activate();
        setStompClient(client);

        // Очистка соединения при размонтировании
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []);

    return { users, tickets, sprints, stompClient };
};

export default useWebSocket;
