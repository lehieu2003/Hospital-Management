import * as React from 'react';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { Navigation, Router } from '@toolpad/core';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { viVN } from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { viVN as viDG } from '@mui/x-data-grid/locales';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import { THEME } from '@/configs/themes';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import 'dayjs/locale/vi';
const NAVIGATION: Navigation = [
    {
        segment: 'admin',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'admin/departments',
        title: 'Quản lý chuyên khoa',
        icon: <LocalHospitalIcon />,
    },
    {
        segment: 'admin/doctors',
        title: 'Quản lý bác sĩ',
        icon: <PersonIcon />,
    },
    {
        segment: 'admin/doctor-schedules',
        title: 'Lịch làm việc bác sĩ',
        icon: <ScheduleIcon />,
    },
    // {
    //     segment: 'admin/emergency-contacts',
    //     title: 'Liên hệ khẩn cấp',
    //     icon: <EmergencyIcon />,
    // },
    {
        segment: 'admin/invoices',
        title: 'Hóa đơn',
        icon: <ReceiptIcon />,
    },
    {
        segment: 'admin/patients',
        title: 'Quản lý bệnh nhân',
        icon: <PeopleIcon />,
    },
    {
        segment: 'admin/diagnoses',
        title: 'Chẩn đoán',
        icon: <MedicalServicesIcon />,
    },
    {
        segment: 'admin/appointments',
        title: 'Quản lý lịch hẹn',
        icon: <EventNoteIcon />,
    },
    {
        segment: 'admin/suport-tickets',
        title: 'Hỗ trợ',
        icon: <ContactSupportIcon />,
    },
];

const BRANDING = {
    title: 'Quản trị hệ thống',
};

// const AUTHENTICATION = {
//   signIn: () => { },
//   signOut: () => { },
// };
export default function AdminLayoutComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    const router: Router = React.useMemo(
        () => ({
            navigate: (url: string | URL) => {
                navigate(url.toString());
            },
            pathname,
            searchParams,
        }),
        [navigate, pathname, searchParams]
    );
    const theme = createTheme(THEME as object, viVN, viDG);
    return (
        <ThemeProvider theme={theme}>
            <AppProvider
                theme={theme}
                navigation={NAVIGATION}
                branding={BRANDING}
                router={router}
                window={window}
                // authentication={AUTHENTICATION}
            >
                <DashboardLayout>
                    <Outlet />
                </DashboardLayout>
            </AppProvider>
        </ThemeProvider>
    );
}
