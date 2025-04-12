import React from "react";
import NavTabs from "../NavTabs/HeaderNavTab";
import SearchBox from "../Buttons/HeaderSettingsButton/HeaderSettingsButton";
import SettingsButton from "../InputFields/HeaderSearchBox/HeaderSearchBox";
import UserAvatar from "../UserAvatars/HeaderUserAvatar/HeaderUserAvatar";
import './KanbanHeader.css';


const KanbanHeader = () => {
    return (
        <header className="top-bar">
            <div className="top-bar-left">
                <img src="/images/company-logo.png" alt="Company Logo" className="logo"/>
                <NavTabs/>
            </div>

            <div className="top-bar-right">
                <SearchBox />
                <SettingsButton />
                <UserAvatar />
            </div>
        </header>
    );
};

export default KanbanHeader;
