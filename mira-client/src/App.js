// App.js
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import KanbanPage from "./pages/KanbanPage/KanbanPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import TicketDetailsPage from "./pages/TicketDetailsPage/TicketDetailsPage";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />  {/* Главная страница, где показывается логин */}
            <Route path="/registration" element={<RegistrationPage />} />  {/* Страница регистрации */}
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/tickets/:ticketDisplayId" element={<TicketDetailsPage />} />
          {/* Можно добавить другие маршруты */}
        </Routes>
      </Router>

  );
};

export default App;
