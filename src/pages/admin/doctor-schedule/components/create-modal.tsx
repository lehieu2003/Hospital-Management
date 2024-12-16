import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useBoolean } from 'usehooks-ts';
import AddIcon from '@mui/icons-material/Add';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DoctorScheduleBulkCreate, DoctorScheduleBulkCreateSchema } from '../validations';
import { useQueryClient } from '@tanstack/react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNotifications } from '@toolpad/core/useNotifications';
import {
    getAllDoctorSchedules,
    getGetAllDoctorSchedulesQueryKey,
    useBulkUpdateDoctorSchedules,
    useGetDoctors,
} from '@/services/api';
import { Doctor } from '@/types';
import React from 'react';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
const dateOfWeekOptions = [0, 1, 2, 3, 4, 5, 6];

export default function CreateModal() {
    const { toggle, value, setFalse } = useBoolean();
    const form = useForm<DoctorScheduleBulkCreate>({
        resolver: zodResolver(DoctorScheduleBulkCreateSchema),
    });
    const queryClient = useQueryClient();
    const { show } = useNotifications();
    const { mutateAsync, isPending } = useBulkUpdateDoctorSchedules({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetAllDoctorSchedulesQueryKey(),
                });
                show('Tạo mới thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                });
            },
        },
    });

    React.useEffect(() => {
        const doctorId = form.getValues('doctorId');
        if (doctorId) {
            async function fetchDoctorSchedules() {
                const { data } = await getAllDoctorSchedules({
                    'DoctorId.Equal': doctorId,
                    PageSize: 100000,
                });
                const dateOfWeeks = data.data?.map((item) => item.dayOfWeek!) || [];
                const startTimes =
                    data.data?.map((item) => dayjs(dayjs().format('YYYY-MM-DD') + ' ' + item.startTime!)) || [];
                const endTimes =
                    data.data?.map((item) => dayjs(dayjs().format('YYYY-MM-DD') + ' ' + item.endTime!)) || [];
                console.log(dateOfWeeks, startTimes, endTimes);
                form.setValue('dateOfWeeks', dateOfWeeks);
                form.setValue('startTimes', startTimes);
                form.setValue('endTimes', endTimes);
            }
            fetchDoctorSchedules();
        }
    }, [form.watch('doctorId')]);

    const onClosed = () => {
        setFalse();
        form.reset();
    };
    const onSubmit = async (data: DoctorScheduleBulkCreate) => {
        await mutateAsync({
            doctorId: data.doctorId,
            data:
                data.dateOfWeeks?.map((item, index) => {
                    return {
                        doctorId: data.doctorId,
                        dayOfWeek: item,
                        startTime: data!.startTimes![index]?.format('HH:mm:ss'),
                        endTime: data!.endTimes![index]?.format('HH:mm:ss'),
                    };
                }) || [],
        });
        onClosed();
    };
    console.log(form.formState.errors);
    const { data: doctors } = useGetDoctors({
        PageSize: 100000,
    });
    const doctorOptions = React.useMemo(() => {
        return doctors?.data.data?.map((option) => option) || [];
    }, [doctors]);

    return (
        <>
            <Button variant="contained" onClick={toggle} startIcon={<AddIcon />}>
                Tạo mới
            </Button>
            <Dialog
                component={'form'}
                onSubmit={form.handleSubmit(onSubmit)}
                onClose={onClosed}
                aria-labelledby="customized-dialog-title"
                open={value}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Tạo mới hồ sơ bệnh nhân
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={toggle}
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
                        <Controller
                            control={form.control}
                            name="doctorId"
                            render={({ field }) => {
                                return (
                                    <Autocomplete<Doctor, false>
                                        options={doctorOptions}
                                        getOptionLabel={(option) => option.name!}
                                        getOptionKey={(option) => option.doctorId!}
                                        renderInput={(params) => <TextField {...params} label="Bác sĩ" />}
                                        value={doctorOptions.find((d) => d.doctorId === field.value) || null}
                                        renderOption={(props, option, { selected }) => (
                                            <MenuItem {...props} selected={selected} key={option.doctorId}>
                                                {option.name}
                                            </MenuItem>
                                        )}
                                        onChange={(event: any, newValue: Doctor | null) => {
                                            field.onChange(newValue?.doctorId ?? undefined);
                                        }}
                                    />
                                );
                            }}
                        ></Controller>
                        {form.watch('doctorId') && (
                            <Controller
                                control={form.control}
                                name="dateOfWeeks"
                                render={({ field:{onChange,value,...rest} }) => {
                                    
                                    return (
                                        <Autocomplete<number, true>
                                            multiple
                                            options={dateOfWeekOptions}
                                            getOptionLabel={(option) =>
                                                option == 0 ? 'Chủ nhật' : `Thứ ${option + 1}`
                                            }
                                            selectOnFocus
                                            
                                            renderInput={(params) => <TextField {...params} label="Ngày trong tuần" />}
                                            renderOption={(props, option, { selected }) => (
                                                <MenuItem {...props} selected={selected} key={option}>
                                                    {option == 0 ? 'Chủ nhật' : `Thứ ${option + 1}`}
                                                </MenuItem>
                                            )}
                                            onChange={(event: any, newValue: number[]) => {
                                                onChange(newValue);
                                            }}
                                            value={value||[]}
                                            {...rest}
                                        />
                                    );
                                }}
                            ></Controller>
                        )}
                        {form.watch('dateOfWeeks')?.map((item, index) => {
                            return (
                                <Stack gap={2} key={index}>
                                    <Typography variant="h6">{item == 0 ? 'Chủ nhật' : `Thứ ${item + 1}`}</Typography>
                                    <Controller
                                        control={form.control}
                                        name={`startTimes.${index}`}
                                        render={({ field }) => {
                                            return <TimePicker label="Bắt đầu lúc" {...field} />;
                                        }}
                                    ></Controller>
                                    <Controller
                                        control={form.control}
                                        name={`endTimes.${index}`}
                                        render={({ field }) => {
                                            return <TimePicker label="Kết thúc lúc" {...field} />;
                                        }}
                                    ></Controller>
                                </Stack>
                            );
                        })}
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
        </>
    );
}
