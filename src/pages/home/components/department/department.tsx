import React, { useState } from 'react';
import './department.css';
import Button from '@/components/button';
import DepartmentDetail from './departmentitem';
import departmentImage1 from '@/assets/img/departments-1.jpg';
import departmentImage2 from '@/assets/img/departments-2.jpg';
import departmentImage3 from '@/assets/img/departments-3.jpg';
import departmentImage4 from '@/assets/img/departments-4.jpg';
import departmentImage5 from '@/assets/img/departments-5.jpg';
import departmentImage6 from '@/assets/img/departments-6.jpg';

const Department: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("departments-tab-1");

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <section id="departments" className="departments section">
            <div className="container section-title" data-aos="fade-up">
                <h2>Chuyên khoa</h2>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row">
                    <div className="col-lg-3">
                        <ul className="nav nav-tabs flex-column">
                            {[
                                { id: "departments-tab-1", label: "Hô hấp" },
                                { id: "departments-tab-2", label: "Răng hàm mặt" },
                                { id: "departments-tab-3", label: "Ung bứu" },
                                { id: "departments-tab-4", label: "Khoa nhi" },
                                { id: "departments-tab-5", label: "Da liêu - Thẩm mỹ da" },
                                { id: "departments-tab-6", label: "Cơ xương khớp" }
                            ].map(tab => (
                                <li key={tab.id} className="nav-item mw-100 w-100">
                                    <Button
                                        className={`nav-link col-12 text-start ${activeTab === tab.id ? "active show" : ""}`}
                                        data-bs-toggle="tab"
                                        onClick={() => handleTabClick(tab.id)}
                                    >
                                        {tab.label}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-lg-9 mt-4 mt-lg-0">
                        <div className="tab-content">
                            <DepartmentDetail
                                id="departments-tab-1"
                                classname={activeTab === "departments-tab-1" ? "col-12 text-start active show" : ""}
                                title="Hô hấp"
                                description="Khoa Nội hô hấp, Bệnh viện MediHos được phát triển để trở thành một trong những địa chỉ hàng đầu về khám chữa các bệnh lý hô hấp trong bối cảnh người mắc bệnh ngày càng gia tăng tại Việt Nam."
                                detail="Các bệnh đường hô hấp dưới thường có nguy cơ diễn biến nguy hiểm và gây ảnh hưởng nghiêm trọng tới sức khỏe bệnh nhân, nếu không được điều trị đúng cách và kịp thời có thể dẫn tới các biến chứng nguy hiểm, thậm chí gây tử vong. Vì vậy, việc chẩn đoán sớm, điều trị kịp thời và dự phòng các bệnh hô hấp – phổi mạn tính bao gồm các biện pháp phòng tránh và các yếu tố nguy cơ khởi phát bệnh nhằm làm giảm tỷ lệ người mắc bệnh và bệnh tiến triển nặng là yêu cầu cấp thiết hiện nay."
                                image={departmentImage1}
                            />
                            <DepartmentDetail
                                id="departments-tab-2"
                                classname={activeTab === "departments-tab-2" ? "col-12 text-start active show" : ""}
                                title="Răng hàm mặt"
                                description="Tình trạng răng miệng không chỉ ảnh hưởng đến ngoại hình mà còn đóng vai trò quan trọng với sức khỏe tổng thể. Bệnh răng miệng có thể gây nhiều vấn đề khó chịu như đau đớn, mất thẩm mỹ, ảnh hưởng đến giao tiếp và chất lượng cuộc sống. "
                                detail="Với tầm nhìn vững chắc và sứ mệnh nâng cao sức khỏe cộng đồng, Chuyên khoa Răng Hàm Mặt, Bệnh viện MediHos hướng đến nâng cao chất lượng cuộc sống của người dân TP.HCM và các tỉnh thành lân cận thông qua việc cung cấp dịch vụ chăm sóc sức khỏe răng miệng hiện đại, an toàn, hiệu quả."
                                image={departmentImage2}
                            />
                            <DepartmentDetail
                                id="departments-tab-3"
                                classname={activeTab === "departments-tab-3" ? "col-12 text-start active show" : ""}
                                title="Ung bứu"
                                description="Khoa Ung bướu MediHos được đầu tư xây dựng theo tiêu chuẩn quốc tế, cung cấp các dịch vụ chăm sóc sức khỏe hàng đầu, áp dụng mô hình điều trị đa mô thức và cá thể hóa trong điều trị ung thư."
                                detail="Theo nghiên cứu EIU đăng trên Sáng kiến Ung thư Thế giới, Việt Nam là quốc gia có tỷ lệ tử vong do ung thư hàng đầu châu Á, mặc dù tỷ lệ người mắc ung thư trên dân số không cao so với thế giới. Thực trạng này cho thấy, đa số người Việt chưa có thói quen tầm soát ung thư – điều kiện tiên quyết để giảm thiểu tỷ lệ tử vong do căn bệnh đáng sợ này. Bên cạnh đó, việc điều trị khi bệnh đã ở giai đoạn muộn, phác đồ điều trị chưa phù hợp với từng thể trạng bệnh nhân cũng như sự thiếu hụt các phương tiện y tế hiện đại cũng góp phần gia tăng số ca tử vong do ung thư ở nước ta."
                                image={departmentImage3}
                            />
                            <DepartmentDetail
                                id="departments-tab-4"
                                classname={activeTab === "departments-tab-4" ? "col-12 text-start active show" : ""}
                                title="Khoa nhi"
                                description="So với người trưởng thành, trẻ nhỏ có hệ miễn dịch non nớt và sức đề kháng kém hơn. Vì thế, nguy cơ nhiễm các bệnh lý liên quan đến virus/vi khuẩn ở trẻ khá cao, đặc biệt là vào thời điểm giao mùa, thời tiết thay đổi đột ngột hoặc khi có dịch bệnh bùng phát."
                                detail="Khoa Nhi MediHos quy tụ đội ngũ y bác sĩ giỏi chuyên môn và giàu kinh nghiệm, năng động, tích cực, được đào tạo bài bản trong và ngoài nước. Không chỉ vậy, các bác sĩ còn thấu hiểu tâm lý trẻ, tạo cho trẻ cảm giác tin cậy, an tâm khi thăm khám và điều trị. Đội ngũ điều dưỡng được đào tạo chuyên sâu về kỹ thuật chăm sóc trẻ, không ngừng học hỏi, phấn đấu nâng cao tay nghề."
                                image={departmentImage4}
                            />
                            <DepartmentDetail
                                id="departments-tab-5"
                                classname={activeTab === "departments-tab-5" ? "col-12 text-start active show" : ""}
                                title="Da liễu - thẩm mỹ da"
                                description="“Làn da khỏe đẹp, cuộc đời thêm vui” là phương châm mà mỗi bác sĩ chuyên khoa Da liễu – Thẩm mỹ Da, MediHos luôn hướng đến để giúp mỗi khách hàng được tiếp cận các phương pháp làm đẹp hiện đại, an toàn, hiệu quả."
                                detail="Các bệnh da liễu là tập hợp các bệnh ảnh hưởng đến da, cấu trúc dưới da, móng, lông, tóc và cả những bệnh từ các cơ quan khác biểu hiện ra ngoài. Một số bệnh phổ biến bao gồm: viêm da dị ứng, nám, chàm, mề đay, mụn…"
                                image={departmentImage5}
                            />
                            <DepartmentDetail
                                id="departments-tab-6"
                                classname={activeTab === "departments-tab-6" ? "col-12 text-start active show" : ""}
                                title="Cơ xương khớp"
                                detail="Việt Nam được xếp vào nhóm những quốc gia có tỷ lệ mắc bệnh xương khớp cao nhất thế giới. Số liệu thống kê cho thấy có khoảng 30% người trên 35 tuổi, 60% người trên 65 tuổi và 85% người trên 80 tuổi bị thoái hóa khớp – một trong những bệnh lý xương khớp phổ biến nhất ở nước ta."
                                description="Khoa Cơ xương khớp Bệnh viện MediHos được thành lập đã đáp ứng nhu cầu khám, tầm soát và điều trị bệnh cơ xương khớp đang ngày càng gia tăng ở Việt Nam."
                                image={departmentImage6}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Department;
