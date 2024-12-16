import React from 'react';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    dataAos?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className, dataAos }) => {
    return <img src={src} alt={alt} className={className} data-aos={dataAos} />;
};

export default Image;
