import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor, faHospital, faFlask, faAward } from "@fortawesome/free-solid-svg-icons";
import StatItem from "@/pages/home/components/stat/statitem";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface StatProps {}

const Stat: React.FC<StatProps> = () => {
    return (
        <section id="stats" className="stats section light-background">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row gy-4">
                    {/* Doctors Stat */}
                    <StatItem
                        icon={faUserDoctor as IconDefinition}
                        count="85"
                        title="Y, Bác sĩ"
                    />

                    {/* Departments Stat */}
                    {/* <StatItem
                        icon={faHospital as IconDefinition}
                        count="85"
                        title=""
                    /> */}

                    {/* Research Labs Stat */}
                    <StatItem
                        icon={faFlask as IconDefinition}
                        count="85"
                        title="Research Labs"
                    />

                    {/* Awards Stat */}
                    <StatItem
                        icon={faAward as IconDefinition}
                        count="85"
                        title="Awards"
                    />
                </div>
            </div>
        </section>
    );
}

export default Stat;
