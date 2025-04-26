<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MIRA</title>
    <link rel="stylesheet" href="/css/header.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body>
<header class="top-bar">
    <div class="top-bar-left">
        <img src="/images/company-logo.png" alt="Company Logo" class="logo">

        <div class="nav-tabs">
            <a href="/backlog" class="nav-tab">Backlog</a>
            <a href="/kanban" class="nav-tab">Active Sprints</a>
            <a href="/reports" class="nav-tab">Reports</a>
            <a href="/tempo" class="nav-tab">Tempo</a>

            <button class="btn-create" onclick="openModal()">Create</button>
        </div>
    </div>

    <div id="createTicketModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h3>Create New Ticket</h3>
            <form id="createTicketForm">
                <label for="project">Project:</label>
                <select id="project" name="project" required class="modal-select">
                    <option value="CORE">CORE</option>
                    <option value="DIGITAL">DIGITAL</option>
                </select><br>

                <label for="title">Summary:</label>
                <input type="text" id="title" name="title" required class="modal-input"><br>

                <label for="description">Description:</label>
                <textarea id="description" name="description" required class="modal-textarea"></textarea><br>

                <label for="reporterInput">Reporter:</label>
                <div id="reporterContainer"></div><br>
                <button type="button" id="assignToMeReporter" onclick="assignToMe('reporterContainer')">Assign to Me</button><br>
                <label for="assigneeInput">Assignee:</label>
                <div id="assigneeContainer"></div><br>
                <button type="button" id="assignToMeAssignee" onclick="assignToMe('assigneeContainer')">Assign to Me</button><br>


                <label for="type">Type:</label>
                <select id="type" name="type" class="modal-select">
                    <option value="BUG">BUG</option>
                    <option value="EPIC">FEATURE</option>
                    <option value="TASK" selected>TASK</option>
                    <option value="STORY">STORY</option>
                </select><br>

                <label for="status">Status:</label>
                <select id="status" name="status" required class="modal-select">
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                </select><br>

                <label for="priority">Priority:</label>
                <select id="priority" name="priority" required class="modal-select">
                    <option value="MINOR">Minor</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="HIGHEST">Highest</option>
                </select><br>

                <label for="tags">Tags:</label>
                <div id="tagsContainer">
                    <div style="position: relative;">
                        <input type="text" id="tags" name="tags" oninput="updateTagInlineSuggestion(this)" onkeydown="checkTab(event)" style="font-size: 16px; color: black; ">
                        <span id="tagSuggestion" style="position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: #ccc; pointer-events: none; font-size: 16px;"></span>
                    </div>
                </div><br>

                <div class="form-buttons">
                    <button type="submit">Create Ticket</button>
                </div>
            </form>
        </div>
    </div>

    <div class="top-bar-right">
        <div class="search-box">
            <label>
                <input type="text" placeholder="Search..." class="search-input">
            </label>
        </div>

        <button class="btn-settings">
            <i class="fas fa-cog settings-icon"></i>
        </button>

        <div class="avatar">
            <#if userAvatar??>
                <img src="${userAvatar}" alt="Avatar">
            <#else>
                <span class="avatar-initials" id="avatar-initials"></span>

            </#if>
        </div>
    </div>
</header>
<script src="/js/websocket.js"></script>
<script src="/js/user.js"></script>
<script src="/js/utils.js"></script>
<script src="/js/ui.js"></script>


</body>
</html>
