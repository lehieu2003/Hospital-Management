import React from "react";
import ContactForm from "./contactForm";

const Contact: React.FC = () => {
    return (
        <section id="contact" className="contact section">
            <div className="container section-title" data-aos="fade-up">
                <h2>Liên hệ</h2>
            </div>

            <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
                <iframe
                    title="Google Maps Embed"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.8357172547817!2d106.68127442634932!3d10.759785745222963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3ed289%3A0xa06651894598e488!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTw6BpIEfDsm4!5e0!3m2!1svi!2s!4v1730183078455!5m2!1svi!2s"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </section>
    );
};

export default Contact;