import { Dialog, DialogContent, Typography, Grid, DialogTitle, IconButton } from '@mui/material';
import { DialogProps } from '@toolpad/core';
import GridCloseIcon from '@mui/icons-material/Close';
import { PatientDTO } from '@/types';
import dayjs from 'dayjs';
import { Gender, GenderLabel } from '@/services/enums/gender';
import { useGetPatient } from '@/services/api';

export default function DetailModal({ payload, open, onClose }: DialogProps<number>) {
    const { data, isLoading } = useGetPatient(payload, {
        query: {
            select: (data) => data.data,
        },
    });

    if (isLoading) {
        return (
            <Dialog onClose={onClose as any} open={open} fullWidth maxWidth="sm">
                <DialogContent>
                    <Typography variant="body1">Loading...</Typography>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog onClose={onClose as any} open={open} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography variant="h5">Chi tiết bệnh nhân #{data?.patientId}</Typography>
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
                <PatientDetail patient={data!} />
            </DialogContent>
        </Dialog>
    );
}

export function PatientDetail({ patient, isShort }: { patient: PatientDTO; isShort?: boolean }) {
    console.log(patient);
    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Tên:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{patient?.name}</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Ngày sinh:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{dayjs(patient?.dateOfBirth).format('DD/MM/YYYY')}</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Email:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{patient?.email}</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Số điện thoại:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{patient?.phoneNumber}</Typography>
            </Grid>

            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Giới tính:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{GenderLabel[patient?.gender as Gender] || 'Nam'}</Typography>
            </Grid>

            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Mã bảo hiểm:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{patient?.healthInsurance}</Typography>
            </Grid>
        </Grid>
    );
}
