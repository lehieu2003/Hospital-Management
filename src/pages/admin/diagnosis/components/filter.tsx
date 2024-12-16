import { Autocomplete, Box, Button, Popover, TextField, Typography } from '@mui/material';
import React, { useId } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Doctor, GetDiagnosesParams, Patient } from '@/types';
import { useGetDoctors, useGetPatients } from '@/services/api';
import MenuItem from '@mui/material/MenuItem';
import { Controller, useForm } from 'react-hook-form';
import { removeDotObject } from '@/utils/form-utils';
import { DateTimePicker } from '@mui/x-date-pickers';

interface FilterProps {
    setFilter: React.Dispatch<React.SetStateAction<GetDiagnosesParams>>;
    filter: GetDiagnosesParams;
}

export default function Filter({ setFilter, filter }: FilterProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = useId();
    return (
        <>
            <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleClick} aria-describedby={id}>
                Bộ lọc
            </Button>
            <Popover
                id={id}
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
                <PopoverForm setFilter={setFilter} filter={filter} handleClose={handleClose} />
            </Popover>
        </>
    );
}

function PopoverForm({ setFilter, filter, handleClose }: FilterProps & { handleClose: () => void }) {
    const { control, reset, handleSubmit } = useForm<GetDiagnosesParams>({
        defaultValues: { ...filter },
    });
    const { data: doctors } = useGetDoctors({
        PageSize: 100000,
    });
    const { data: patients } = useGetPatients({
        PageSize: 100000,
    });
    const doctorOptions = React.useMemo(() => {
        return doctors?.data.data?.map((option) => option) || [];
    }, [doctors]);
    const patientOptions = React.useMemo(() => {
        return patients?.data.data?.map((option) => option) || [];
    }, [patients]);
    const onSubmit = (data: GetDiagnosesParams) => {
        setFilter((prev) => ({ ...prev, ...removeDotObject(data) }));
        handleClose();
    };
    const onReset = () => {
        reset(
            {},
            {
                keepValues: false,
            }
        );
        setFilter({
            Page: 0,
            PageSize: 10,
        });
        handleClose();
    };
    return (
        <Box
            component={'form'}
            onSubmit={handleSubmit(onSubmit)}
            sx={{ padding: 3 }}
            display={'flex'}
            flexDirection={'column'}
            gap={2}
        >
            <Typography variant="h6">Bộ lọc</Typography>
            <Controller
                control={control}
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
            <Controller
                control={control}
                name="PatientId.Equal"
                render={({ field }) => {
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
                }}
            ></Controller>
            <Controller
                control={control}
                name="DiagnosisDate.GreaterThanOrEqual"
                render={({ field }) => {
                    return <DateTimePicker label="Ngày hẹn từ" {...field} />;
                }}
            ></Controller>
            <Controller
                control={control}
                name="DiagnosisDate.LessThanOrEqual"
                render={({ field }) => {
                    return <DateTimePicker label="Ngày hẹn đến" {...field} />;
                }}
            ></Controller>

            <Box display={'flex'} justifyContent={'flex-end'} gap={2}>
                <Button type="button" onClick={onReset}>
                    Xóa bộ lọc
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Áp dụng
                </Button>
            </Box>
        </Box>
    );
}
