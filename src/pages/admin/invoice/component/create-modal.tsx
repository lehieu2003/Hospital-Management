import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useBoolean } from 'usehooks-ts';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Invoice, InvoiceSchema } from '../validations';
import { useQueryClient } from '@tanstack/react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNotifications } from '@toolpad/core/useNotifications';
import { getDefaultValue } from '@/utils/form-utils';
import { getGetInvoicesQueryKey, usePostInvoice } from '@/services/api';
import { DialogProps } from '@toolpad/core';
import InvoiceForm from './invoice-form';

export default function CreateModal() {
    const { toggle, value, setFalse } = useBoolean();

    return (
        <>
            <Button variant="contained" onClick={toggle} startIcon={<AddIcon />}>
                Tạo hóa đơn
            </Button>
            <FromDialog payload={{}} open={value} onClose={() => Promise.resolve(setFalse())} />
        </>
    );
}

function FromDialog({ payload, open, onClose }: DialogProps<{ initAppointmentId?: number }>) {
    const form = useForm<Invoice>({
        defaultValues: {
            ...getDefaultValue(InvoiceSchema),
            invoiceDate: dayjs().toISOString(),
        },
        resolver: zodResolver(InvoiceSchema),
    });

    const queryClient = useQueryClient();
    const { show } = useNotifications();

    const onClosed = () => {
        onClose();
        form.reset();
    };

    const { mutateAsync, isPending } = usePostInvoice({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetInvoicesQueryKey(),
                });
                show('Tạo hóa đơn thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                });
            },
        },
    });

    const onSubmit = async (data: Invoice) => {
        console.log('Original form data:', data);

        const preparedData = {
            ...data,
            invoiceDate: dayjs(data.invoiceDate).toISOString(),
            appointmentId: data.appointmentId || 0,
        };

        console.log('Prepared data for API:', preparedData);

        await mutateAsync({ data: preparedData });
        onClosed();
    };



    return (
        <Dialog
            onClose={onClosed}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <form
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Tạo hóa đơn mới
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={onClosed}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <GridCloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Stack gap={3} minWidth={400}>
                        <InvoiceForm type="create" form={form} initAppointmentId={payload.initAppointmentId} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isPending} autoFocus type="reset" variant="outlined" onClick={onClosed}>
                        Đóng
                    </Button>
                    <LoadingButton autoFocus type="submit" variant="contained" loading={isPending}>
                        Tạo mới
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}

CreateModal.FromDialog = FromDialog;
