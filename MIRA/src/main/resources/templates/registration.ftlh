<!DOCTYPE html>
<html>
<head>
    <title>MIRA</title>
</head>
<body>
<h1>MIRA</h1><hr>
<h4>Регистрация</h4>
<form action="/registration" method="post">
    Имя пользователя: <input type="text" name="name"><br><br>
    Фамилия пользователя: <input type="text" name="surname"><br><br>
    Эл. почта: <input type="email" name="email"><br><br>
    Номер телефона: <input type="text" name="numberPhone"><br><br>
    Пароль: <input type="password" name="password"><br><br>

    Роль:
    <select name="role">
        <option value="ROLE_PROJECT_OWNER">Project Owner</option>
        <option value="ROLE_DEVELOPER">Developer</option>
        <option value="ROLE_QA">QA</option>
    </select><br><br>

    Проект:
    <select name="project">
        <option value="CORE">CORE</option>
        <option value="DIGITAL">Digital</option>
    </select><br><br>
    <input type="submit" value="Зарегистрироваться"/>
</form>

</body>
</html>
