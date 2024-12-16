import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNotifications } from '@toolpad/core/useNotifications';
import { DialogProps } from '@toolpad/core';
import React from 'react';
import { DoctorSchedule, DoctorScheduleSchema } from '../validations';
import {
    getGetAllDoctorSchedulesQueryKey, useGetDoctorSchedule,
    usePutDoctorSchedule
} from '@/services/api';
import FormInput from '../../components/form/FormInput';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
export default function UpdateModal({ open, onClose, payload }: DialogProps<number>) {
    const form = useForm<DoctorSchedule>({
        resolver: zodResolver(DoctorScheduleSchema),
    });
    const queryClient = useQueryClient();
    const { show } = useNotifications();
    const { data, isLoading } = useGetDoctorSchedule(payload);

    React.useEffect(() => {
        if (data) {
            form.reset({
                ...data.data,
                startTime: data.data.startTime ? dayjs(dayjs().format('YYYY-MM-DD') + ' ' + data.data.startTime) : undefined,
                endTime: data.data.endTime ? dayjs(dayjs().format('YYYY-MM-DD') + ' ' + data.data.endTime) : undefined,
            });
        }
    }, [data]);

    const { mutateAsync, isPending } = usePutDoctorSchedule({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetAllDoctorSchedulesQueryKey(),
                });
                show('Cập nhật lịch làm việc thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                });
            },
        },
    });
    const onClosed = () => {
        onClose();
        form.reset();
    };
    const onSubmit = async (data: DoctorSchedule) => {
        await mutateAsync({
            data: {
                ...data,
                startTime: data.startTime?.format('HH:mm:ss'),
                endTime: data.endTime?.format('HH:mm:ss'),
                scheduleId: payload,
            },
            id: payload,
        });
        onClosed();
    };

    return (
        <Dialog
            component={'form'}
            onSubmit={form.handleSubmit(onSubmit)}
            onClose={onClosed}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Cập nhật lịch làm việc
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
                    <TextField label="Bác sĩ" value={data?.data?.doctor?.name} disabled />
                    <FormInput control={form.control} name="doctorId" type="hidden" label="Mã bác sĩ" 
                      sx={{ display: 'none' }}
                    />
                    <TextField
                        label="Ngày trong tuần"
                        value={`${data?.data?.dayOfWeek == 0 ? 'Chủ nhật' : `Thứ ${data?.data?.dayOfWeek!+1}`}`}
                        disabled
                    />
                    <FormInput control={form.control} name="dayOfWeek" type="hidden" label="Ngày trong tuần" 
                        sx={{ display: 'none' }}
                    />

                    <Controller
                        control={form.control}
                        name={`startTime`}
                        render={({ field:{value,...rest} }) => {
                            return <TimePicker label="Bắt đầu lúc" value={value||undefined} {...rest} />;
                        }}
                    ></Controller>
                    <Controller
                        control={form.control}
                        name={`endTime`}
                        render={({ field:{value,...rest} }) => {
                            return <TimePicker label="Kết thúc lúc" value={value||undefined} {...rest} />;
                        }}
                    ></Controller>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={isPending} autoFocus type="reset" variant="outlined" onClick={onClosed}>
                    Đóng
                </Button>
                <LoadingButton autoFocus type="submit" variant="contained" loading={isPending}>
                    Lưu
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
