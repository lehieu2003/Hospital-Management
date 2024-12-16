import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { css } from '@emotion/react';

interface IconListProps {
    icon: IconDefinition;
    title: string;
    description: string;
}

function IconList({ icon, title, description }: IconListProps) {
    return (
        <li className="d-flex align-items-start">
            <FontAwesomeIcon
                icon={icon}
                className="custom-icon-list col-1 me-2"
                css={css`
                    font-size: 30px;
                    `}
            />
            <div>
                <h5 className="text-start col-11">{title}</h5>
                <p>{description}</p>
            </div>
        </li>
    );
}

export default IconList;
