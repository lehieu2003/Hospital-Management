import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useIdentityExists } from '@/services/api';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import RegisterForm, { IdentityType } from './register';
// fa-times
import CloseIcon from '@mui/icons-material/Close';
import LoginForm from './login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Container = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 0.5rem 0;
`;

const Header = styled.div`
    position: relative;
    margin-bottom: 2rem;
    text-align: center;
`;

const CloseButton = styled.button`
    position: absolute;
    right: 0;
    top: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
`;

const TabContainer = styled.div`
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
    background: none;
    border: none;
    padding: 0.5rem 0;
    font-weight: ${(props) => (props.active ? '600' : 'normal')};
    color: ${(props) => (props.active ? '#3b82f6' : '#6b7280')};
    border-bottom: ${(props) => (props.active ? '2px solid #3b82f6' : 'none')};
    cursor: pointer;
`;

const SocialLoginContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
`;

const SocialButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
`;

interface Props {
    show: boolean;
    onHide: () => void;
}

export default function AuthModal({ show, onHide }: Props) {
    const [nameIdentifier, setNameIdentifier] = React.useState<string>('');
    const [type, setType] = React.useState<IdentityType>(IdentityType.Email);
    const [activeTab, setActiveTab] = React.useState<'login' | 'register' | null>(null);
    const { refetch } = useIdentityExists(
        {
            identity: nameIdentifier,
            type,
        },
        {
            query: {
                refetchOnWindowFocus: false,
                enabled: false,
            },
        }
    );
    const handleContinue = async () => {
        const res = await refetch();
        const isExists = res.data?.data || false;
        if (isExists) {
            setActiveTab('login');
        } else {
            setActiveTab('register');
        }
    };
    const handleChangeNameIdentifier = (type: IdentityType) => {
        setType(type);
        setNameIdentifier('');
    };
    const handleClose = () => {
        onHide();
        setActiveTab(null);
    };
    const [isRegisterDetail, setRegisterDetail] = React.useState(false);
    const [formData, setFormData] = React.useState({});
    return (
        <Modal className="home mt-4" show={show} onHide={handleClose}>
            <Modal.Body className="mt-2">
                {activeTab === 'login' && (
                    <LoginForm type={type} onDone={handleClose} nameIdentifier={nameIdentifier} />
                )}
                {activeTab === 'register' && (
                    <RegisterForm type={type} onDone={handleClose} nameIdentifier={nameIdentifier} />
                )}
                {activeTab == null && (
                    <Container>
                        <Header>
                            {/* <img src="https://placewaifu.com/image/150/40" alt="hellobacsi" width={150} height={40} /> */}
                            <h3 className="fs-2">Medilab</h3>
                            <CloseButton aria-label="Close">
                                <CloseIcon onClick={handleClose} />
                            </CloseButton>
                        </Header>

                        <p
                            css={css`
                                color: #6b7280;
                                margin-bottom: 1rem;
                            `}
                        >
                            Dùng số điện thoại, email, hoặc phương thức khác để đăng nhập hoặc {''}
                            <Button
                                href="#"
                                css={css`
                                    color: #000000 !important;
                                    background-color: transparent !important;
                                    border: none !important;
                                    margin-bottom: 2px;
                                    margin-left: -10px;
                                    font-weight: 500;
                                `}
                                onClick={() => setActiveTab('register')}
                            >
                                đăng kí
                            </Button>
                        </p>

                        <div
                            css={css`
                                display: flex;
                                margin-bottom: 1rem;
                            `}
                        ></div>

                        <div
                            css={css`
                                display: flex;
                                margin-bottom: 1rem;
                            `}
                        >
                            <Form.Control
                                value={nameIdentifier}
                                onChange={(e) => setNameIdentifier(e.target.value)}
                                type={type === IdentityType.Email ? 'email' : 'tel'}
                                placeholder={type === IdentityType.Email ? 'Email' : 'Số điện thoại'}
                            />
                        </div>

                        <Button
                            css={css`
                                width: 100%;
                            `}
                            className="cta-btn d-none d-sm-block text-decoration-none"
                            onClick={handleContinue}
                        >
                            Tiếp tục
                        </Button>

                        <div
                            css={css`
                                text-align: center;
                                margin-top: 1rem;
                            `}
                        >
                            <p
                                css={css`
                                    color: #6b7280;
                                `}
                            >
                                Hoặc tiếp tục bằng
                            </p>
                            <SocialLoginContainer>
                                <SocialButton onClick={() => (window.location.href = '/api/Account/login/google')}>
                                    <FontAwesomeIcon
                                        icon={faGoogle as any}
                                        css={css`
                                            color: #f4511e;
                                        `}
                                    />
                                    Google
                                </SocialButton>
                                <SocialButton onClick={() => (window.location.href = '/api/Account/login/facebook')}>
                                    <FontAwesomeIcon
                                        icon={faFacebookF as any}
                                        css={css`
                                            color: #0866ff;
                                        `}
                                    />
                                    Facebook
                                </SocialButton>
                                {type !== IdentityType.Email && (
                                    <SocialButton onClick={() => handleChangeNameIdentifier(IdentityType.Email)}>
                                        Email
                                    </SocialButton>
                                )}
                                {type !== IdentityType.Phone && (
                                    <SocialButton onClick={() => handleChangeNameIdentifier(IdentityType.Phone)}>
                                        <FontAwesomeIcon
                                            icon={faPhone}
                                            css={css`
                                                color: #979595;
                                            `}
                                        />
                                        SĐT
                                    </SocialButton>
                                )}
                            </SocialLoginContainer>
                        </div>

                        <p
                            css={css`
                                font-size: 0.875rem;
                                color: #6b7280;
                                margin-top: 1.5rem;
                                padding-top: 1rem;
                            `}
                        >
                            Bằng cách đăng ký, tôi xác nhận rằng mình đã đọc, hiểu và đồng ý với{' '}
                            <a
                                href="#"
                                css={css`
                                    color: #3b82f6;
                                `}
                            >
                                Chính sách bảo mật
                            </a>{' '}
                            và{' '}
                            <a
                                href="#"
                                css={css`
                                    color: #3b82f6;
                                `}
                            >
                                Điều khoản sử dụng
                            </a>{' '}
                            của Hellobacsi.
                        </p>
                    </Container>
                )}
            </Modal.Body>
        </Modal>
    );
}
