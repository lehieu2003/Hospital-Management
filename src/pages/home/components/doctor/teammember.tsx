import React from 'react';
import './main.css';
import Button from '@/components/button';
import Image from '@/components/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface SocialLinks {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
}

interface TeamMemberProps {
    delay: string;
    img: string;
    name: string;
    position: string;
    specialization: string;
    description: string;
    socialinks?: SocialLinks;
}

const TeamMember: React.FC<TeamMemberProps> = ({ delay, img, name, position,specialization, description, socialinks }) => {
    return (
        <div className="col-lg-6" data-aos="fade-up" data-aos-type={delay}>
            <div className="team-member d-flex align-items-start">
                <div className="pic">
                    <Image
                        src={img}
                        className="img-fluid"
                        alt={name}
                    />
                </div>
                <div className='member-info'>
                    <h4>{name}</h4>
                    <span>{position}  <b>| {specialization}</b></span> 
                    
                    <p>{description}</p>
                    <div className='social'>
                        {socialinks?.twitter && (
                            <Button href={socialinks.twitter}>
                                <FontAwesomeIcon icon={faSquareXTwitter} />
                            </Button>
                        )}
                        {socialinks?.facebook && (
                            <Button href={socialinks.facebook}>
                                <FontAwesomeIcon icon={faFacebook} />
                            </Button>
                        )}
                        {socialinks?.instagram && (
                            <Button href={socialinks.instagram}>
                                <FontAwesomeIcon icon={faInstagram} />
                            </Button>
                        )}
                        {socialinks?.linkedin && (
                            <Button href={socialinks.linkedin}>
                                <FontAwesomeIcon icon={faLinkedin} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamMember;
