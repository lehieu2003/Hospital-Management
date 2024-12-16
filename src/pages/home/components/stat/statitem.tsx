import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import './StatItem.css';

interface StatItemProps {
    icon: IconDefinition;
    title: string;
    count: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, title, count }) => {
    return (
        <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <div className="stat-icon">
                <FontAwesomeIcon icon={icon} className="" />
            </div>
            <div className="stats-item">
                <span 
                    data-purecounter-start="0" 
                    data-purecounter-end={count} 
                    data-purecounter-duration="1" 
                    className="purecounter">
                    {count}
                </span>
                <p>{title}</p>
            </div>
        </div>
    );
};

export default StatItem;
