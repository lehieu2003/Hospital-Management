import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '@/components/image';
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';

interface TestimonialItemProps {
    src: string;
    name: string;
    position: string;
    description: string;
    stars: number;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({ src, name, position, description, stars }) => {
    return (
        <div className="swiper-slide">
            <div className="testimonial-item">
                <div className="d-flex">
                    <Image
                        className="testimonial-img flex-shrink-0"
                        src={src}
                        alt={name}
                    />
                    <div className='text-start'>
                        <h3>{name}</h3>
                        <h4>{position}</h4>
                        <div className='starts'>
                            {Array(stars).fill(null).map((_, index) => (
                                <i className="bi bi-star-fill me-1 text-warning" key={index}></i>
                            ))}
                        </div>
                    </div>
                </div>
                <p>
                    <FontAwesomeIcon icon={faQuoteLeft} style={{ color: '#949494' }} />
                    <span className='ms-2 me-2'>{description}</span>
                    <FontAwesomeIcon icon={faQuoteRight} style={{ color: '#949494' }} />
                </p>
            </div>
        </div>
    );
};

export default TestimonialItem;
