import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNotifications } from '@toolpad/core/useNotifications';
import { DialogProps } from '@toolpad/core';
import React from 'react';
import { getDefaultValue } from '@/utils/form-utils';
import { Patient, PatientSchema } from '../validations';
import PatientForm from './patient-form';
import { getGetPatientsQueryKey, useGetPatient, usePutPatient } from '@/services/api';
export default function UpdateModal({ open, onClose, payload }: DialogProps<number>) {

    const form = useForm<Patient>({
        defaultValues: getDefaultValue(PatientSchema),
        resolver: zodResolver(PatientSchema)
    })
    const queryClient = useQueryClient()
    const { show } = useNotifications()
    console.log(payload)
    const { data, isLoading } = useGetPatient(payload)

    React.useEffect(() => {
        if (data) {
            form.reset(data.data as any)
        }
    }, [data])

    const { mutateAsync, isPending } = usePutPatient({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetPatientsQueryKey()
                })
                show('Cập nhật bệnh nhân thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                })
            }
        }
    })
    const onClosed = () => {
        onClose()
        form.reset()
    }
    const onSubmit = async (data: Patient) => {
        await mutateAsync({ data:{
            ...data,
            dateOfBirth: data.dateOfBirth?.toISOString(),
            patientId: payload
        }, id: payload })
        onClosed()
    }

    return (
        <Dialog
            component={'form'}
            onSubmit={form.handleSubmit(onSubmit)}
            onClose={onClosed}
            aria-labelledby="customized-dialog-title"
            open={open}

        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Cập nhật bệnh nhân
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
                    <PatientForm form={form} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isPending}
                    autoFocus type='reset' variant='outlined' onClick={onClosed}>
                    Đóng
                </Button>
                <LoadingButton

                    autoFocus type='submit' variant='contained'
                    loading={isPending}
                >
                    Lưu
                </LoadingButton>
            </DialogActions>
        </Dialog>

    )
}
