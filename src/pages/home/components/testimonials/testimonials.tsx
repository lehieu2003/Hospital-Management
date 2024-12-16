import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Pagination, Autoplay } from 'swiper/modules';
import './main.css';
import TestimonialItem from './testimonialItem';
import testimonial1 from '@/assets/img/testimonials/testimonials-1.jpg';
import testimonial2 from '@/assets/img/testimonials/testimonials-2.jpg';
import testimonial3 from '@/assets/img/testimonials/testimonials-3.jpg';
import testimonial4 from '@/assets/img/testimonials/testimonials-4.jpg';
import testimonial5 from '@/assets/img/testimonials/testimonials-5.jpg';

const Testimonials: React.FC = () => {
    return (
        <section id="testimonials" className="testimonials section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5 info" data-aos="fade-up" data-aos-delay="100">
                        <h3>Đánh giá của khách hàng</h3>
                        <p>
                            Những đánh giá từ khách hàng của chúng tôi là nguồn cảm hứng lớn nhất.
                            Dưới đây là những lời nhận xét chân thực từ những người đã trải nghiệm
                            sản phẩm và dịch vụ của chúng tôi. Chúng tôi rất vui mừng khi nhận được
                            sự hài lòng và góp ý từ các bạn để không ngừng hoàn thiện.
                        </p>
                    </div>

                    <div className="col-lg-7" data-aos="fade-up" data-aos-delay="200">
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            loop={true}
                            speed={600}
                            autoplay={{ delay: 3000 }}
                            slidesPerView="auto"
                            pagination={{ clickable: true }}
                            className="swiper-wrapper"
                        >
                            <SwiperSlide>
                                <TestimonialItem
                                    src={testimonial1}
                                    name="Saul Goodman"
                                    position="CEO & Founder"
                                    stars={5}
                                    description="Dịch vụ tuyệt vời! Đội ngũ hỗ trợ chuyên nghiệp và sản phẩm hoàn toàn vượt qua mong đợi của tôi. Tôi rất hài lòng và chắc chắn sẽ giới thiệu đến bạn bè và đồng nghiệp."
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <TestimonialItem
                                    src={testimonial2}
                                    name="Sara Wilsson"
                                    position="Designer"
                                    stars={4}
                                    description="Đội ngũ rất tận tâm và sản phẩm chất lượng cao. Tôi chỉ mong rằng thời gian giao hàng nhanh hơn một chút, nhưng nhìn chung rất hài lòng!"
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <TestimonialItem
                                    src={testimonial3}
                                    name="Jena Karlis"
                                    position="Store Owner"
                                    stars={5}
                                    description="Tôi thật sự ấn tượng với sự chuyên nghiệp và hỗ trợ nhiệt tình từ đội ngũ. Một trải nghiệm xuất sắc mà tôi sẽ không bao giờ quên."
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <TestimonialItem
                                    src={testimonial4}
                                    name="Matt Brandon"
                                    position="Freelancer"
                                    stars={5}
                                    description="Tôi chưa bao giờ thấy một dịch vụ nào chu đáo và nhanh chóng đến vậy. Mọi thứ đều vượt quá mong đợi, chắc chắn tôi sẽ quay lại."
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <TestimonialItem
                                    src={testimonial5}
                                    name="John Larson"
                                    position="Entrepreneur"
                                    stars={4}
                                    description="Chất lượng sản phẩm tuyệt vời, hỗ trợ khách hàng rất tốt. Một số chi tiết nhỏ cần cải thiện, nhưng tổng thể rất đáng giá."
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
