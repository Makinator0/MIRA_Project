<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <!-- Подключение SockJS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.1/sockjs.min.js"></script>
    <!-- Подключение Stomp.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
</head>
<body>
<!-- Подключение шапки -->
<#include "header.ftlh" />

<!-- Навигация и заголовок проекта -->
<nav class="breadcrumb" id="breadcrumb"></nav>

<!-- Основной контент: Канбан-доска -->
<div class="kanban-board">
    <div id="todo" class="kanban-column">
        <div class="kanban-header">To Do</div>
        <ul id="todo-tasks" class="kanban-tasks">
            <!-- Тикеты будут добавляться через WebSocket -->
        </ul>
    </div>

    <div id="in-progress" class="kanban-column">
        <div class="kanban-header">In Progress</div>
        <ul id="in-progress-tasks" class="kanban-tasks">
            <!-- Тикеты будут добавляться через WebSocket -->
        </ul>
    </div>

    <div id="in-review" class="kanban-column">
        <div class="kanban-header">In Review</div>
        <ul id="in-review-tasks" class="kanban-tasks">
            <!-- Тикеты будут добавляться через WebSocket -->
        </ul>
    </div>

    <div id="done" class="kanban-column">
        <div class="kanban-header">Done</div>
        <ul id="done-tasks" class="kanban-tasks">
            <!-- Тикеты будут добавляться через WebSocket -->
        </ul>
    </div>
</div>


<script src="/js/websocket.js"></script>
<script src="/js/user.js"></script>
<script src="/js/utils.js"></script>
<script src="/js/ui.js"></script>

</body>
</html>