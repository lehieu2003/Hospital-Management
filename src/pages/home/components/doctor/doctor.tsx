import React from 'react';
import TeamMember from './teammember';
import doctor1 from '@/assets/img/doctors/doctors-1.jpg';
import doctor2 from '@/assets/img/doctors/doctors-2.jpg';
import doctor3 from '@/assets/img/doctors/doctors-3.jpg';
import doctor4 from '@/assets/img/doctors/doctors-4.jpg';
import { useGetDoctors } from '@/services/api';

interface SocialLinks {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
}

const Doctor: React.FC = () => {
    const {data:doctors} = useGetDoctors({
        Page: 1,
        PageSize: 6
    })
    return (
        <section id="doctors" className="doctors section">
            <div className="container section-title" data-aos="fade-up">
                <h2>Đội ngũ bác sĩ</h2>
            </div>

            <div className="container">
                <div className="row gy-4">
                    <TeamMember
                        delay="100"
                        img={doctor1}
                        name="Nguyễn Tư Nghĩa"
                        position="BS CKI"
                        specialization="Hô hấp"
                        description="Tận tâm, tận tình, dễ thương"
                        socialinks={{
                            twitter: "https://x.com/realmadrid",
                            facebook: "https://web.facebook.com/RealMadrid",
                            instagram: "https://www.instagram.com/realmadrid/",
                            linkedin: "https://www.linkedin.com/company/realmadrid"
                        }}
                    />

                    <TeamMember
                        delay="200"
                        img={doctor2}
                        name="Nguyễn Minh Phi"
                        position="ThS Bác sĩ"
                        specialization="Răng hàm mặt"
                        description="Tận tâm, tận tình, dễ thương"
                        socialinks={{
                            twitter: "https://x.com/realmadrid",
                            facebook: "https://web.facebook.com/RealMadrid",
                            instagram: "https://www.instagram.com/realmadrid/",
                            linkedin: "https://www.linkedin.com/company/realmadrid"
                        }}
                    />

                    <TeamMember
                        delay="300"
                        img={doctor3}
                        name="Ngô Hữu Hoàng"
                        position="Ths. BS CKII"
                        specialization="Ung bứu"
                        description="Tận tâm, tận tình, dễ thương"
                        socialinks={{
                            twitter: "https://x.com/realmadrid",
                            facebook: "https://web.facebook.com/RealMadrid",
                            instagram: "https://www.instagram.com/realmadrid/",
                            linkedin: "https://www.linkedin.com/company/realmadrid"
                        }}
                    />

                    <TeamMember
                        delay="400"
                        img={doctor4}
                        name="Lương Minh Thế Vinh"
                        position="Trưởng khoa"
                        specialization="Khoa nhi"
                        description="Tận tâm, tận tình, dễ thương"
                        socialinks={{
                            twitter: "https://x.com/realmadrid",
                            facebook: "https://web.facebook.com/RealMadrid",
                            instagram: "https://www.instagram.com/realmadrid/",
                            linkedin: "https://www.linkedin.com/company/realmadrid"
                        }}
                    />
                    <TeamMember
                        delay="400"
                        img={doctor4}
                        name="Nguyễn Hoàng Kiều Ngân"
                        position="Bác sĩ"
                        specialization="Da liễu - Thẩm mỹ da"
                        description="Tận tâm, tận tình, dễ thương"
                        socialinks={{
                            twitter: "https://x.com/realmadrid",
                            facebook: "https://web.facebook.com/RealMadrid",
                            instagram: "https://www.instagram.com/realmadrid/",
                            linkedin: "https://www.linkedin.com/company/realmadrid"
                        }}
                    />
                    <TeamMember
                        delay="400"
                        img={doctor4}
                        name="Nguyễn Trọng Tấn Sang"
                        position="Trưởng khoa"
                        specialization="Cơ xương khớp"
                        description="Tận tâm, tận tình, dễ thương"
                        socialinks={{
                            twitter: "https://x.com/realmadrid",
                            facebook: "https://web.facebook.com/RealMadrid",
                            instagram: "https://www.instagram.com/realmadrid/",
                            linkedin: "https://www.linkedin.com/company/realmadrid"
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default Doctor;
