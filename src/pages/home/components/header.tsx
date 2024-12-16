import { Button } from 'react-bootstrap';
import { useBoolean } from 'usehooks-ts';
import AuthModal from './auth-modal';
import UserMenu from './usermenu';
import { useUserProfile } from '@/stores/user-store';
import { Link } from 'react-router-dom';
const Header = () => {
    const { toggle, value } = useBoolean(false);
    const profile = useUserProfile();
    return (
        <header id="header" className="header sticky-top">
            <AuthModal onHide={toggle} show={value} />
            {/* Header Topbar */}
            <div className="topbar d-flex align-items-center">
                <div className="container d-flex justify-content-center justify-content-md-between">
                    <div className="contact-info d-flex align-items-center">
                        <i className="bi bi-envelope d-flex align-items-center">
                            <Button title="contact@example.com" href="mailto:contact@example.com"></Button>
                        </i>
                        <i className="bi bi-phone d-flex align-items-center ms-4">
                            <span>1800 5678</span>
                        </i>
                    </div>
                </div>
            </div>

            {/* Branding */}
            <div className="branding d-flex align-items-center">
                <div className="container position-relative d-flex align-items-center justify-content-between">
                    <Link to="/" className="text-decoration-none logo d-flex align-items-center me-auto">
                        <Link to="/#hero" className="text-decoration-none" css={{ fontSize: '30px', color: '#126893', fontWeight: 500 }}>
                            NETHos
                        </Link>
                    </Link>
                    <nav id="navmenu" className="navmenu">
                        <ul>
                            <li>
                                <Link to="/#hero" className="text-decoration-none active">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/#about" className="text-decoration-none">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link to="/#services" className="text-decoration-none">
                                    Dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link to="/#departments" className="text-decoration-none">
                                    Chuyên khoa
                                </Link>
                            </li>
                            <li>
                                <Link to="/#doctors" className="text-decoration-none">
                                    Bác sĩ
                                </Link>
                            </li>
                            <li>
                                <Link to="/#contact" className="text-decoration-none">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    {!profile && (
                        <Button onClick={toggle} className="cta-btn d-none d-sm-block text-decoration-none">
                            Đăng nhập
                        </Button>
                    )}
                    {profile && <UserMenu />}
                </div>
            </div>
        </header>
    );
};

export default Header;
