import GLightbox from "glightbox";
import { useEffect } from "react";

interface GalleryItemProps {
    href: string;
}

function GalleryItem({ href }: GalleryItemProps) {
    useEffect(() => {
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
        });

        return () => {
            lightbox.destroy();
        }
    }, []);

    return (
        <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
                <a
                    className="glightbox"
                    href={href}
                    data-gallery="images-gallery"
                >
                    <img
                        src={href}
                        alt=""
                        className="img-fluid"
                    />
                </a>
            </div>
        </div>
    );
}

export default GalleryItem;