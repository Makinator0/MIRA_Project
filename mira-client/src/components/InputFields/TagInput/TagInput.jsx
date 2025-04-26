import React, { useState } from "react";

const TagInput = ({ value, onChange, placeholder }) => {
    // Массив подсказок
    const suggestions = ["Release", "Feature", "Development"];
    // Состояние для хранения подсказки
    const [suggestion, setSuggestion] = useState("");

    // Обработчик ввода
    const handleInput = (e) => {
        const inputValue = e.target.value;
        // Передаём изменение родителю
        onChange(e);

        const query = inputValue.toLowerCase();
        const tags = query.split(" ");
        const currentTag = tags[tags.length - 1];

        if (currentTag.trim() === "") {
            setSuggestion("");
            return;
        }

        const match = suggestions.find((tag) =>
            tag.toLowerCase().startsWith(currentTag)
        );

        if (match) {
            const suggestionPart = match.substring(currentTag.length);
            setSuggestion(inputValue + suggestionPart);
        } else {
            setSuggestion("");
        }
    };

    // Обработчик нажатия клавиш
    const handleKeyDown = (e) => {
        if (e.key === "Tab" && suggestion) {
            e.preventDefault(); // Предотвращаем стандартное поведение Tab
            // Обновляем значение с автозаполнением
            onChange({
                target: {
                    name: "tags",
                    value: suggestion + " ",
                },
            });
            setSuggestion("");
        }
    };

    return (
        <div style={{ position: "relative"  }}>
            <input
                type="text"
                name="tags"
                class="modal-input"
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{ fontSize: "16px", color: "black"}}
            />
            <span
                style={{
                    position: "absolute",
                    left: "9px",
                    top: "46%",
                    transform: "translateY(-50%)",
                    color: "#ccc",
                    pointerEvents: "none",
                    fontSize: "18px",

                }}
            >
        {suggestion}
      </span>
        </div>
    );
};

export default TagInput;
