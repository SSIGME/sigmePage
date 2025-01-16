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

  return (
    <div className="picker-container">
      <div className="picker-header" onClick={toggleDropdown}>
        <span>{selectedOption || "Select an option"}</span>
        <span className={`picker-arrow ${isOpen ? "open" : ""}`}>&#9662;</span>
      </div>
      {isOpen && (
        <ul className="picker-options">
          {options.map((option, index) => (
            <li
              key={index}
              className="picker-option"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Picker;
