import { Autocomplete, Box, Button, Popover, TextField, Typography } from '@mui/material';
import React, { useId } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Doctor, GetAppointmentsParams, Patient } from '@/types';
import { useGetDoctors, useGetPatients } from '@/services/api';
import MenuItem from '@mui/material/MenuItem';
import { Controller, useForm } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers';
import { removeDotObject } from '@/utils/form-utils';
interface FilterProps {
    setFilter: React.Dispatch<React.SetStateAction<GetAppointmentsParams>>;
    filter: GetAppointmentsParams;
}



export default function Filter({ setFilter, filter }: FilterProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const form = useForm<GetAppointmentsParams >( {
        defaultValues: filter,
    });

    const { data: patients } = useGetPatients({
        PageSize: 100000,
    });
    const { data: doctors } = useGetDoctors({
        PageSize: 100000,
    });
    const doctorOptions = React.useMemo(() => {
        return doctors?.data.data?.map((option) => option) || [];
    }, [doctors]);
    const patientOptions = React.useMemo(() => {
        return patients?.data.data?.map((option) => option) || [];
    }, [patients]);


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const onSubmit = (data: GetAppointmentsParams) => {
        setFilter(prev => ({ ...prev, ...removeDotObject(data) }));
        handleClose();
    }
    const onReset = () => {
        form.reset();
        setFilter({
            Page: 0,
            PageSize: 10,
        });
        handleClose();
    }

    const open = Boolean(anchorEl);
    const id = useId();
    const usedId = open ? id : undefined;
    return (
        <>
            <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleClick} aria-describedby={usedId}>
                Bộ lọc
            </Button>
            <Popover
                id={usedId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box component={'form'}
                onSubmit={form.handleSubmit(onSubmit)}
                sx={{ padding: 3 }} display={'flex'} flexDirection={'column'} gap={2}>
                    <Typography variant="h6">Bộ lọc</Typography>
                    <Controller
                        control={form.control}
                        name="DoctorId.Equal"
                        render={({ field }) => {
                            return (
                                <Autocomplete<Doctor, false>
                                    options={doctorOptions}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) => option.name!}
                                    getOptionKey={(option) => option.doctorId!}
                                    renderInput={(params) => <TextField {...params} label="Bác sĩ" />}
                                    value={doctorOptions.find((d) => d.doctorId === field.value) || null}
                                    renderOption={(props, option, { selected }) => (
                                        <MenuItem {...props} selected={selected}>
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
                    <Controller control={form.control} name="PatientId.Equal" render={({ field }) => {
                        return (
                            <Autocomplete<Patient, false>
                                options={patientOptions}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => option.name!}
                                getOptionKey={(option) => option.patientId!}
                                renderInput={(params) => <TextField {...params} label="Bệnh nhân" />}
                                value={patientOptions.find((d) => d.patientId === field.value) || null}
                                renderOption={(props, option, { selected }) => (
                                    <MenuItem {...props} selected={selected}>
                                        {option.name}
                                    </MenuItem>
                                )}
                                onChange={(event: any, newValue: Patient | null) => {
                                    field.onChange(newValue?.patientId ?? undefined);
                                }}
                            />
                        );
                    }}></Controller>
                    <Controller control={form.control} name="AppointmentDate.GreaterThanOrEqual" render={({ field }) => {
                        return (
                            <DateTimePicker
                                label="Ngày hẹn từ"
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                }}
                            />
                        );
                    }}></Controller>
                    <Controller control={form.control} name="AppointmentDate.LessThanOrEqual" render={({ field }) => {
                        return (
                            <DateTimePicker
                                label="Ngày hẹn đến"
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                }}
                            />
                        );
                    }
                    }></Controller>
                    <Controller control={form.control} name="Status.Equal" render={({ field }) => {
                        return (
                            <Autocomplete
                                options={[
                                    { value: 'PENDING', label: 'Chờ xác nhận' },
                                    { value: 'CONFIRMED', label: 'Đã xác nhận' },
                                    { value: 'CANCELLED', label: 'Đã hủy' },
                                    { value: 'COMPLETED', label: 'Đã hoàn thành' },
                                ]}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => <TextField {...params} label="Trạng thái" />}
                                value={field.value ? { value: field.value, label: field.value } : null}
                                onChange={(event: any, newValue: { value: string; label: string } | null) => {
                                    field.onChange(newValue?.value ?? undefined);
                                }}
                            />
                        );
                    }}></Controller>




                    <Box display={'flex'} justifyContent={'flex-end'} gap={2}>
                        <Button
                            type="button"
                            onClick={onReset}
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button 
                        type="submit"
                        variant="contained" color="primary">
                            Áp dụng
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
}
