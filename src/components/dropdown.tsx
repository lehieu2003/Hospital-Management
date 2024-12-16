import { useState } from "react";
import Button from "./button";
export interface DropdownItem {
    label: string;  
    href: string;
}

interface DropdownProps {
    title: string;
    items: DropdownItem[];
}


function Dropdown({ title, items }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    return (
        <li className={`dropdown ${isOpen ? 'open' : ''}`}>
            <a
                href="#"
                onClick={toggleDropdown}
                className="text-decoration-none"
            >
                <span>{title}</span>
                <i className='bi bi-chevron-down toggle-dropdown'></i>
            </a>
            <ul className={isOpen ? 'show' : ''}>
                {
                    items.map((item, index) => (
                        <li key={index}>
                            <a
                                title={item.label}
                                href={item.href}
                                className="text-decoration-none"
                            >
                            </a>
                        </li>
                    ))
                }
            </ul>
        </li>
    )
}

export default Dropdown;