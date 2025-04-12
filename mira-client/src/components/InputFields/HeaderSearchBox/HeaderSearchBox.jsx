import React from "react";
import "./HeaderSearchBox.css"

const SearchBox = () => {
    return (
        <div className="search-box">
            <input type="text" placeholder="Search..." className="search-input" />
        </div>
    );
};

export default SearchBox;
