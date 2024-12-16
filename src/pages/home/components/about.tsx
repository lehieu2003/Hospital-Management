// src/components/About.tsx
import React from "react";
import { faVialCircleCheck, faPumpMedical, faHeartCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Button from "@/components/button";
import Image from "@/components/image";
import backgroundImg from "../../../assets/img/about.jpg";
import IconList from "@/components/iconlist";
import { css } from "@emotion/react";

const About: React.FC = () => {
    return (
        <section id="about" className="about section">
            <div className="container">
                <div className="row gy-4 gx-5">
                    <div
                        className="col-lg-6 position-relative align-self-start"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <Image src={backgroundImg} className="img-fluid" alt="" />
                        <a
                            href="https://www.youtube.com/watch?v=UCseAstoxtU"
                            className="glightbox pulsating-play-btn"
                        ></a>
                    </div>
                    <div
                        className="col-lg-6 content"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <h3>Giới thiệu</h3>
                        <p>
                            Bệnh viện của chúng tôi cam kết mang lại sự chăm sóc tận tâm, giúp bệnh nhân vượt qua mọi khó khăn
                            và đau đớn để phục hồi sức khỏe một cách tốt nhất. Chúng tôi hiểu rằng mỗi hành trình chữa lành
                            đều chứa đựng thử thách, và đội ngũ y bác sĩ luôn sẵn sàng hỗ trợ bệnh nhân từng bước, vì sức khỏe
                            và hạnh phúc của họ. Với tiêu chí đặt trách nhiệm và đạo đức lên hàng đầu, bệnh viện không ngừng
                            nỗ lực để mang đến các giải pháp y tế hiệu quả, giúp xoa dịu nỗi đau và nâng cao chất lượng cuộc
                            sống cho mọi người.
                        </p>
                        <ul>
                            <IconList
                                icon={faVialCircleCheck}
                                title="Mang lại lợi ích thiết thực cho bệnh nhân."
                                description="Dịch vụ dễ dàng và thuận tiện, đáp ứng tốt nhu cầu của bệnh nhân."
                            />
                            <IconList
                                icon={faPumpMedical}
                                title="Hiện đại và đạt chuẩn."
                                description="Luôn mang đến công nghệ hiện đại bậc nhất"
                            />
                            <IconList
                                icon={faHeartCircleXmark}    
                                title="An toàn và bảo mật."
                                description="Luôn bảo vệ quyền lợi cá nhân cho bệnh nhân."
                            />
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
