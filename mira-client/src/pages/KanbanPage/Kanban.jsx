import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { validateToken } from "../../services/authService";
import Header from "../../components/Headers/KanbanHeader";
import KanbanBoard from "../../components/Boards/KanbanBoard/KanbanBoard";
import useWebSocket from "../../hooks/useWebSocket"; // Добавлен импорт Header

const Kanban = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { tickets } = useWebSocket();
    console.log(tickets)
    useEffect(() => {
        const validateUserToken = async () => {
            try {
                // Получаем токен из state (передан при навигации)
                const token = location.state?.token;

                if (!token) {
                    throw new Error("Токен отсутствует");
                }

                // Проверяем токен через эндпоинт `/auth/validate`
                await validateToken(token);
            } catch (err) {
                setError(err.message);
                navigate("/"); // Перенаправление при ошибке
            } finally {
                setLoading(false);
            }
        };

        validateUserToken();
    }, [navigate, location.state]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    return (
        <>
            <Header/> {/* Добавлен хэдер */}
            <KanbanBoard tickets={tickets}/>
        </>
    );
};

export default Kanban;
