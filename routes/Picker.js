import React, { useState } from "react";
import "./picker.css";
const Picker = ({ options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelect(option);
    };
    return (React.createElement("div", { className: "picker-container" },
        React.createElement("div", { className: "picker-header", onClick: toggleDropdown },
            React.createElement("span", null, selectedOption || "Select an option"),
            React.createElement("span", { className: `picker-arrow ${isOpen ? "open" : ""}` }, "\u25BE")),
        isOpen && (React.createElement("ul", { className: "picker-options" }, options.map((option, index) => (React.createElement("li", { key: index, className: "picker-option", onClick: () => handleSelect(option) }, option)))))));
};
export default Picker;
