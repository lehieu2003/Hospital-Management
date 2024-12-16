import { useGetDoctor } from '@/services/api';
import { Dialog, DialogContent, Typography, Grid, DialogTitle, IconButton } from '@mui/material';
import { DialogProps } from '@toolpad/core';
import GridCloseIcon from '@mui/icons-material/Close';
import { DoctorDTO } from '@/types';

export default function DetailModal({ payload, open, onClose }: DialogProps<number>) {
    const { data, isLoading } = useGetDoctor(payload, {
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
                <Typography variant="h5">Chi tiết bác sĩ #{data?.doctorId}</Typography>
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
                <DoctorDetail doctor={data!} />
            </DialogContent>
        </Dialog>
    );
}

export function DoctorDetail({ doctor, isShort }: { doctor: DoctorDTO; isShort?: boolean }) {
    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Tên:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{doctor?.name}</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Số điện thoại:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{doctor?.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Email:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{doctor?.email}</Typography>
            </Grid>
            {doctor?.department?.departmentName && (
                <>
                    <Grid item xs={4}>
                        <Typography variant="body2" fontWeight="bold">
                            Chuyên khoa:
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="body2">{doctor?.department?.departmentName}</Typography>
                    </Grid>
                </>
            )}
            {!isShort && (
                <>
                    <Grid item xs={4}>
                        <Typography variant="body2" fontWeight="bold">
                            Giới thiệu
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="body2">{doctor?.specialization}</Typography>
                    </Grid>
                </>
            )}
        </Grid>
    );
}
