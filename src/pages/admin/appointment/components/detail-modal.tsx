import { useGetAppointment } from '@/services/api';
import {
    Dialog,
    DialogContent,
    Typography,
    Grid,
    DialogTitle,
    IconButton,
    Paper,
    styled,
    createTheme,
} from '@mui/material';
import { DialogProps } from '@toolpad/core';
import GridCloseIcon from '@mui/icons-material/Close';
import { AppointmentDTO } from '@/types';
import dayjs from 'dayjs';
import { PatientDetail } from '../../patient/components/detail-modal';
import { DoctorDetail } from '../../doctor/components/detail-modal';
const PaperStyle = {
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 150,
    height: '100%',
};
export default function DetailModal({ payload, open, onClose }: DialogProps<number>) {
    const { data, isLoading } = useGetAppointment(payload, {
        query: {
            select: (data) => data.data,
        },
    });

    if (isLoading) {
        return (
            <Dialog onClose={onClose as any} open={open} fullWidth maxWidth="md">
                <DialogContent>
                    <Typography variant="body1">Loading...</Typography>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog onClose={onClose as any} open={open} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h5">Chi tiết lịch hẹn #{data?.appointmentId}</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose as any}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: 3,
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={PaperStyle}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin bệnh nhân
                            </Typography>
                            <PatientDetail patient={data?.patient as any} />
                        </Paper>
                    </Grid>
                    {/* Doctor Information */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={PaperStyle}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin bác sĩ
                            </Typography>
                            <DoctorDetail doctor={data?.doctor as any} isShort />
                        </Paper>
                    </Grid>
                    {/* Diagnosis Information */}
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={PaperStyle}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin lịch hẹn
                            </Typography>
                            <AppointmentDetail appointment={data as any} />
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export function AppointmentDetail({ appointment, isShort }: { appointment: AppointmentDTO; isShort?: boolean }) {
    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Hẹn ngày:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">
                    {dayjs(appointment?.appointmentDate).format('dddd, DD/MM/YYYY HH:mm')}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Trạng thái:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">
                    {appointment?.status === 'PENDING' ? 'Đang chờ' : 'Đã hoàn thành'}
                </Typography>
            </Grid>
        </Grid>
    );
}
