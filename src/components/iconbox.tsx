import React from 'react';

interface IconBoxProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    dadelay?: string | number;
}

const IconBox: React.FC<IconBoxProps> = ({ icon, title, description, dadelay }) => {
    return (
        <div className="col-xl-4 d-flex align-items-stretch">
            <div className="icon-box" data-aos="zoom-out" data-aos-delay={dadelay}>
                {icon}
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default IconBox;
