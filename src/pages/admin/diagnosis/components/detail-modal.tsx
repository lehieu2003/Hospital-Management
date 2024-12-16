import { useGetDiagnosis } from '@/services/api';
import { Dialog, DialogContent, Typography, Grid, Paper, DialogTitle, IconButton, styled } from '@mui/material';
import { DialogProps } from '@toolpad/core';
import GridCloseIcon from '@mui/icons-material/Close';
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
    const { data, isLoading } = useGetDiagnosis(payload, {
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
        <Dialog onClose={onClose as any} open={open} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h5">Chi tiết chẩn đoán</Typography>
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
                    {/* Patient Information */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={PaperStyle}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin bệnh nhân
                            </Typography>
                            <PatientDetail patient={data?.appointment?.patient as any} />
                        </Paper>
                    </Grid>
                    {/* Doctor Information */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={PaperStyle}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin bác sĩ
                            </Typography>
                            <DoctorDetail doctor={data?.appointment?.doctor as any} isShort />
                        </Paper>
                    </Grid>
                    {/* Diagnosis Information */}
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={PaperStyle}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin chuẩn đoán
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <Typography variant="body2" fontWeight="bold">
                                        Ngày chuẩn đoán:
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2">
                                        {dayjs(data?.diagnosisDate).format('dddd, DD/MM/YYYY HH:mm') || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" fontWeight="bold">
                                        Chuẩn đoán:
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2">{data?.description || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" fontWeight="bold">
                                        Ghi chú:
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2">{data?.notes || 'N/A'}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
