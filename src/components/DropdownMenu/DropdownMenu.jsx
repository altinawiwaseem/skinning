import React, { useEffect, useRef, useState } from "react";
import { data } from "../../stencilsInputs";
import "./DropdownMenu.css";

function DropdownMenu({ setStencil }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    console.log(data);
    setIsOpen(!isOpen);
  };

  const handleItemClick = (items) => {
    setStencil(items);
    setIsOpen(!isOpen);
  };

  const handleDocumentClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleDocumentClick);
    } else {
      document.removeEventListener("click", handleDocumentClick);
    }
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isOpen]);

  return (
    <div className={`dropdown ${isOpen ? "open" : ""}`} ref={menuRef}>
      <div onClick={toggleMenu} className="dropdown-header">
        <span>&#9660;</span>
      </div>
      {isOpen && data[0].children && (
        <ul className="sub-menu">
          {data.map((menuData, menuIndex) => (
            <li key={menuIndex}>
              {menuData.label}
              {menuData.children.map((item, index) => (
                <li key={index}>
                  {item.label === "Screen Sizes" ? (
                    <ul className="sub-sub-menu">
                      {item.children.map((size, sizeIndex) => (
                        <li key={sizeIndex}>
                          {size.label}
                          <ul className="sub-sub-sub-menu">
                            {size.children.map((caseItem, caseIndex) => (
                              <li
                                className="sub-item"
                                key={caseIndex}
                                onClick={() => handleItemClick(caseItem.items)}
                              >
                                {caseItem.label}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    /* Include recursive call here if needed */
                    <DropdownMenu data={item} setStencil={setStencil} />
                  )}
                </li>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownMenu;
