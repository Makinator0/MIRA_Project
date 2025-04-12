

function connectWebSocket() {
    const socket = new SockJS('/kanban-websocket');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        const user = getUserFromToken();
        if (!user) {
            console.error("User not found in token");
            return;
        }
        const currentUserId = user.userId;
        console.log(currentUserId)
        const currentProject = user.project;
        console.log(currentProject)
        const token = getCookie("JWT_TOKEN");
        stompClient.send('/app/getAllTickets', {}, JSON.stringify({ token: token }));
        stompClient.send('/app/getAllUsers', {}, {});
        stompClient.subscribe('/topic/users', function (messageOutput) {
            const users = JSON.parse(messageOutput.body);
            allUsers = users ;
            populateUserSelectors(users);
        });

        stompClient.subscribe('/topic/kanban', function (messageOutput) {
            try {
                // Парсим сообщение
                const messageBody = JSON.parse(messageOutput.body);

                // Приводим данные к массиву, даже если это одиночный тикет
                const ticketsArray = Array.isArray(messageBody) ? messageBody : [messageBody];

                console.log("Полученные тикеты:", ticketsArray);

                // Фильтруем тикеты, связанные с текущим пользователем
                const filteredTickets = ticketsArray.filter(ticket => {
                    return (
                        (ticket.assignee.id == currentUserId) || // Тикет назначен текущему пользователю
                        (ticket.author.id == currentUserId)       // Текущий пользователь - автор тикета
                    );
                });

                console.log("Отфильтрованные тикеты:", filteredTickets);

                // Обновляем доску с отфильтрованными тикетами
                updateBoardWithTickets(filteredTickets, currentProject);
            } catch (error) {
                console.error("Ошибка при обработке сообщения WebSocket:", error);
            }
        });
    }, function (error) {
        console.error('WebSocket Error:', error);
    });
}

connectWebSocket();
