import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useBoolean } from 'usehooks-ts';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNotifications } from '@toolpad/core/useNotifications';
import { getDefaultValue } from '@/utils/form-utils';
import DiagnosisForm from './diagnosis-form';
import { getGetDiagnosesQueryKey, usePostDiagnosis } from '@/services/api';
import { Diagnosis, DiagnosisSchema } from '../validations';
import { DialogProps } from '@toolpad/core';
import dayjs from 'dayjs';

export default function CreateModal() {
    const { toggle, value, setFalse } = useBoolean();

    return (
        <>
            <Button variant="contained" onClick={toggle} startIcon={<AddIcon />}>
                Tạo mới
            </Button>
            <FromDialog payload={{}} open={value} onClose={() => Promise.resolve(setFalse())}></FromDialog>
        </>
    );
}

function FromDialog({ payload, open, onClose }: DialogProps<{ initAppointmentId?: number }>) {
    const form = useForm<Diagnosis>({
        defaultValues: getDefaultValue(DiagnosisSchema),
        resolver: zodResolver(DiagnosisSchema),
    });

    const queryClient = useQueryClient();
    const { show } = useNotifications();

    const onClosed = () => {
        onClose();
        form.reset();
    };
    const onSubmit = async (data: Diagnosis) => {
        console.log('Prepared data for API:', data);
        await mutateAsync({
            data: {
                ...data,
                diagnosisDate: dayjs(data.diagnosisDate).toISOString(),
            },
        });
        onClosed();
    };
    const { mutateAsync, isPending } = usePostDiagnosis({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetDiagnosesQueryKey(),
                });
                show('Tạo mới chẩn đoán thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                });
            },
        },
    });
    return (
        <Dialog
            component={'form'}
            onSubmit={form.handleSubmit(onSubmit)}
            onClose={onClosed}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Tạo mới chẩn đoán
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
                    <DiagnosisForm type="create" form={form} initAppointmentId={payload.initAppointmentId} />
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
        </Dialog>
    );
}

CreateModal.FromDialog = FromDialog;
