// App.js
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationForm from "./pages/RegistrationForm";
import Kanban from "./pages/KanbanPage/Kanban";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />  {/* Главная страница, где показывается логин */}
            <Route path="/registration" element={<RegistrationForm />} />  {/* Страница регистрации */}
            <Route path="/kanban" element={<Kanban />} />
          {/* Можно добавить другие маршруты */}
        </Routes>
      </Router>

  );
};

export default App;
