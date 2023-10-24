import React, { useState } from "react";
import useHeadlineInputLists from "../Hooks/SaveStencilshook";

function Sidebar() {
  const { headlineInputLists } = useHeadlineInputLists(
    [],
    "headlineInputLists"
  );
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="sidebar">
      <h1>Sidebar</h1>
      <ul>
        {headlineInputLists.map((item, index) => (
          <li key={index}>
            <button onClick={() => toggleAccordion(index)}>
              {item.headline}
            </button>
            {activeIndex === index && (
              <ul>
                {item.inputList.map((input, inputIndex) => (
                  <li key={inputIndex}>{input}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
