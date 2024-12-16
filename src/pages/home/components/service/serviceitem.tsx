import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/button";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import './main.css';

interface ServiceItemProps {
    icon: IconDefinition;
    title: string;
    description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon, title, description }) => {
    return (
        <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="service-item position-relative">
                <div className="icon">
                    <FontAwesomeIcon icon={icon} />
                </div>
                <Button
                    className="stretched-link">
                    <h3 className="title-service-item">{title}</h3>
                </Button>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default ServiceItem;
