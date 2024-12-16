import AppointmentManagementPage from '@/pages/admin/appointment';
import AdminLayoutComponent from '@/pages/admin/components/layout';
import Dashboard from '@/pages/admin/dashboard';
import ListDepartment from '@/pages/admin/department';
import DiagnosesManagementPage from '@/pages/admin/diagnosis';
import DoctorManagementPage from '@/pages/admin/doctor';
import DoctorScheduleManagementPage from '@/pages/admin/doctor-schedule';
import InvoiceManagerPage from '@/pages/admin/invoice';
// import DoctorScheduleManagementPage from '@/pages/admin/doctor-schedule';
import PatientManagementPage from '@/pages/admin/patient';
import SupportTicket from '@/pages/admin/suport-ticket';
import HomePage from '@/pages/home';
import GoogleCallback from '@/pages/home/auth/google-callback';
import HomeLayout from '@/pages/home/components/layout';
import PatientDetail from '@/pages/home/components/patientdetail';
import PatientHistory from '@/pages/home/components/patienthistory';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

const routerObjects: RouteObject[] = [
    {
        path: '/',
        element: <HomeLayout />, // Layout chung cho các trang home
        children: [
            {
                path: '',
                element: <HomePage />,
                children: [
                    {
                        path: '',
                        element: <></>,
                    },
                    {
                        path: 'patient-detail/:patientId',
                        element: <PatientDetail />,
                    },
                    {
                        path: 'patient-history/:patientId',
                        element: <PatientHistory />,
                    },
                ],
            },
        ],
    },
    {
        path: '/auth/google-response',
        element: <GoogleCallback />, // Không kế thừa HomeLayout
    },
    {
        path: '/admin',
        element: <AdminLayoutComponent />,
        children: [
            {
                path: '',
                element: <Dashboard />,
            },
            {
                path: 'departments',
                element: <ListDepartment />,
            },
            {
                path: 'doctors',
                element: <DoctorManagementPage />,
            },
            {
                path: 'patients',
                element: <PatientManagementPage />,
            },
            {
                path: 'appointments',
                element: <AppointmentManagementPage />,
            },
            {
                path: 'diagnoses',
                element: <DiagnosesManagementPage />,
            },
            {
                path: 'suport-tickets',
                element: <SupportTicket />,
            },
            {
                path: 'doctor-schedules',
                element: <DoctorScheduleManagementPage />,
            },
            {
                path: 'invoices',
                element: <InvoiceManagerPage />,
            },
        ],
    },
];

const router = createBrowserRouter(routerObjects);

export default router;
