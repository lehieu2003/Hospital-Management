import React from 'react';
import { Menu, MenuItem, IconButton, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import useUserStore from '@/stores/user-store';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { profile, logout } = useUserStore();
    const navigate = useNavigate();
    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    const userId = profile?.patient?.patientId?.toString() || profile?.doctor?.doctorId?.toString();

    return (
        <div>
            <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                size="large"
                aria-controls="user-menu"
                aria-haspopup="true"
            >
                <AccountCircleIcon fontSize="large" />
            </IconButton>

            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    style: { width: 250 },
                }}
            >
                <MenuItem >
                    <div>
                        <Typography variant="subtitle1" fontWeight="bold" className="text-black">
                            {profile?.patient?.name || profile?.doctor?.name}
                        </Typography>
                        <Link
                            className='text-decoration-none text-black'
                            to={`/patient-detail/${userId}`}
                            state={{ patientId: `${userId}` }}
                        >
                            Chỉnh sửa thông tin
                        </Link>
                    </div>
                </MenuItem>
                {profile?.patient && (<MenuItem >
                    <div>
                        <Typography variant="subtitle1" fontWeight="bold" className="text-black">

                        </Typography>
                        <Link
                            className='text-decoration-none text-black'
                            to={`/patient-history/${userId}`}
                            state={{ patientId: `${userId}` }}
                        >
                            Lịch sử khám bệnh
                        </Link>
                    </div>
                </MenuItem>)}
                {profile?.doctor && (
                    <MenuItem onClick={() => navigate('/admin')}>
                        <LogoutIcon sx={{ marginRight: 1 }} />
                        Quản lý
                    </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ marginRight: 1 }} />
                    Đăng Xuất
                </MenuItem>
            </Menu>
        </div>
    );
}
