import { useGetInvoice } from "@/services/api";
import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Typography } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { DialogProps } from "@toolpad/core";
import { Invoice } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PatientDetail } from '../../patient/components/detail-modal';
import dayjs from "dayjs";
const PaperStyle = {
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 150,
    height: '100%',
};
export default function DetailModal({ payload, open, onClose }: DialogProps<number>) {
    const { data, isLoading } = useGetInvoice(payload, {
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
                <Typography variant="h5">Chi tiết hóa đơn #{data?.invoiceId}</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose as any}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={PaperStyle}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin bệnh nhân
                            </Typography>
                            <PatientDetail patient={data?.patient as any} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={PaperStyle}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin hóa đơn
                            </Typography>
                            <InvoiceDetail
                                invoice={{
                                    ...data,
                                    patientId: data?.patientId ?? 0,
                                    patient: data?.patient ?? { name: "Không xác định" },
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export function InvoiceDetail({ invoice }: { invoice: Invoice }) {
    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    ID hóa đơn:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{invoice?.invoiceId}</Typography>
            </Grid>

            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Ngày lập hóa đơn:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">
                    {invoice?.invoiceDate
                        ? new Date(invoice.invoiceDate).toLocaleDateString()
                        : "N/A"}
                </Typography>
            </Grid>

            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Tổng tiền:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">
                    {invoice?.totalAmount?.toLocaleString("vi-VN")} ₫
                </Typography>
            </Grid>

            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    Trạng thái:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2">{invoice?.status || "Không xác định"}</Typography>
            </Grid>

            {invoice?.appointmentId && (
                <>
                    <Grid item xs={4}>
                        <Typography variant="body2" fontWeight="bold">
                            Ngày và giờ cuộc hẹn:
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="body2">
                            {dayjs(invoice?.appointment?.appointmentDate).format('dddd, DD/MM/YYYY') || 'N/A'}
                            - {invoice?.appointment?.appointmentTime?.toString()}
                        </Typography>
                    </Grid>
                </>
            )}
        </Grid>
    );
}
