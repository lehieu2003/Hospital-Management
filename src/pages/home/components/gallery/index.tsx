import GalleryItem from "./gallery-item";
import gallery1 from '@/assets/img/gallery/gallery-1.jpg';
import gallery2 from '@/assets/img/gallery/gallery-2.jpg';
import gallery3 from '@/assets/img/gallery/gallery-3.jpg';
import gallery4 from '@/assets/img/gallery/gallery-4.jpg';
import gallery5 from '@/assets/img/gallery/gallery-5.jpg';
import gallery6 from '@/assets/img/gallery/gallery-6.jpg';
import gallery7 from '@/assets/img/gallery/gallery-7.jpg';
import gallery8 from '@/assets/img/gallery/gallery-8.jpg';
const galleryImages = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8
];

function Gallery() {
    
    return (
        <section id="gallery" className="gallery section">
            <div className="container section-title" data-aos="fade-up">
                <h2>Những hình ảnh về NETHos</h2>
                {/* <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p> */}
            </div>

            <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
                <div className="row g-0">
                    {galleryImages.map((image, index) => (
                        <GalleryItem
                            key={index}
                            href={image}
                            data-gallery="images-gallery" // Ensures all images are in the same lightbox group
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Gallery;
