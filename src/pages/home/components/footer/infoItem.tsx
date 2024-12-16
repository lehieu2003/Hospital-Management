import { FC } from "react";

interface InfoItemProps {
    delay?: number;
    icon?: string;
    title?: string;
    description?: string;
}

const InfoItem: FC<InfoItemProps> = ({ delay, icon, title, description }) => {
    const classNameIcon = "flex-shrink-0 " + icon;

    return (
        <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={delay}>
            <i className={classNameIcon}></i>
            <div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default InfoItem;
