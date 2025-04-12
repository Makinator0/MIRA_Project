import React from "react";
import './HeaderSettingsButton.css'

const SettingsButton = () => {
    return (
        <button className="btn-settings" >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="settings-icon"
            >
                <path
                    fill="currentColor"
                    d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7Zm7.5-3.5c0-.33-.02-.66-.05-.98l2.11-1.64a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.14 7.14 0 0 0-1.7-.98l-.38-2.65a.5.5 0 0 0-.5-.43h-4a.5.5 0 0 0-.5.43l-.38 2.65c-.6.24-1.16.57-1.7.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.64c-.03.32-.05.65-.05.98s.02.66.05.98l-2.11 1.64a.5.5 0 0 0-.12.64l2 3.46c.13.22.38.31.6.22l2.49-1c.54.41 1.1.74 1.7.98l.38 2.65a.5.5 0 0 0 .5.43h4a.5.5 0 0 0 .5-.43l.38-2.65c.6-.24 1.16-.57 1.7-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.64c.03-.32.05-.65.05-.98Z"
                />
            </svg>
        </button>
    );
};

export default SettingsButton;
