// src/components/Services.tsx
import React from 'react';
import { faDna, faHeartPulse, faHospitalUser, faNotesMedical, faPills, faWheelchair } from '@fortawesome/free-solid-svg-icons';
import ServiceItem from './serviceitem';
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const Services: React.FC = () => {
    return (
        <section id="services" className="services section">
            <div className="container section-title" data-aos="fade-up">
                <h2>Dịch vụ</h2>
                <p>Những dịch vụ bệnh nhân và người nhà có thể đăng ký trước</p>
            </div>
            <div className="container">
                <div className="row gy-4">
                    <ServiceItem
                        icon={faHeartPulse as IconDefinition}
                        title="Khám bệnh theo yêu cầu"
                        description="Cho phép bệnh nhân chọn lựa bác sĩ và thời gian khám phù hợp, tránh tình trạng chờ đợi lâu."
                    />
                    <ServiceItem
                        icon={faPills as IconDefinition}
                        title="Khám sức khỏe tổng quát"
                        description="Đăng ký các gói khám sức khỏe định kỳ để theo dõi và phát hiện sớm các vấn đề sức khỏe."
                    />
                    <ServiceItem
                        icon={faHospitalUser as IconDefinition}
                        title="Khám và tư vấn chuyên khoa"
                        description="MediHos cung cấp các dịch vụ khám chuyên khoa như tim mạch, sản khoa, nội tiết, da liễu, tai mũi họng…
                         Bệnh nhân có thể chọn chuyên khoa và bác sĩ phù hợp để khám và điều trị."
                    />
                    <ServiceItem
                        icon={faDna as IconDefinition}
                        title="Xét nghiệm tại nhà"
                        description="Cung cấp dịch vụ xét nghiệm tại nhà, tiện lợi cho những người bận rộn hoặc gặp khó khăn trong việc di chuyển."
                    />
                    <ServiceItem
                        icon={faWheelchair as IconDefinition}
                        title="Phẫu thuật theo yêu cầu"
                        description="Đặt lịch phẫu thuật với bác sĩ chuyên môn cao, chọn thời gian phẫu thuật linh hoạt và dịch vụ chăm sóc đặc biệt sau phẫu thuật."
                    />
                    <ServiceItem
                        icon={faNotesMedical as IconDefinition}
                        title="Xét nghiệm và chẩn đoán nhanh"
                        description="Đăng ký làm xét nghiệm nhanh (như xét nghiệm máu, siêu âm, chụp X-quang) với kết quả được trả trong thời gian ngắn."
                    />
                </div>
            </div>
        </section>
    );
};

export default Services;
