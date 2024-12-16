import React from 'react';
import Image from '@/components/image';
import './department.css';

interface DepartmentDetailProps {
    id: string;
    classname?: string;
    title: string;
    description: string;
    detail: string;
    image: string;
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ id, classname, title, description, detail, image }) => {
    const tabPaneClassName = `tab-pane ${classname || ''}`.trim();
    console.log(tabPaneClassName);

    return (
        <div className={tabPaneClassName} id={id}>
            <div className="row">
                <div className="col-lg-8 details order-2 order-lg-1">
                    <h3>{title}</h3>
                    <p className="fst-italic">{description}</p>
                    <p>{detail}</p>
                </div>
                <div className="col-lg-4 text-center order-1 order-lg-2">
                    <Image
                        src={image}
                        alt={title}
                        className="img-fluid"
                    />
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetail;
