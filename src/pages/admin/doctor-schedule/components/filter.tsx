import { Autocomplete, Box, Button, Popover, TextField, Typography } from '@mui/material';
import React, { useId } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Doctor, GetAllDoctorSchedulesParams } from '@/types';
import { useGetDepartments, useGetDoctors } from '@/services/api';
import MenuItem from '@mui/material/MenuItem';
import { Gender, GenderLabel } from '@/services/enums/gender';
import { Controller, useForm } from 'react-hook-form';
import { removeDotObject } from '@/utils/form-utils';
interface FilterProps {
    setFilter: React.Dispatch<React.SetStateAction<GetAllDoctorSchedulesParams>>;
    filter: GetAllDoctorSchedulesParams;
}
const dayOfWeekOptions = [0, 1, 2, 3, 4, 5, 6];
export default function Filter({ setFilter, filter }: FilterProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const form = useForm<GetAllDoctorSchedulesParams>({
        defaultValues: filter,
    });
    const { data: doctors } = useGetDoctors({
        PageSize: 100000,
    });

    const doctorOptions = React.useMemo(() => {
        return doctors?.data.data?.map((option) => option) || [];
    }, [doctors]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const onSubmit = (data: GetAllDoctorSchedulesParams) => {
        setFilter((prev) => ({ ...prev, ...removeDotObject(data) }));
        handleClose();
    };
    const onReset = () => {
        form.reset();
        setFilter({
            Page: 0,
            PageSize: 10,
        });
        handleClose();
    };

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
                <Box
                    component={'form'}
                    onSubmit={form.handleSubmit(onSubmit)}
                    sx={{ padding: 3 }}
                    display={'flex'}
                    flexDirection={'column'}
                    gap={2}
                >
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
                    <Controller
                        control={form.control}
                        name="DayOfWeek.In"
                        render={({ field }) => {
                            return (
                                <Autocomplete<number, true>
                                    multiple
                                    options={dayOfWeekOptions}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) => (option == 0 ? 'Chủ nhật' : `Thứ ${option + 1}`)}
                                    renderInput={(params) => <TextField {...params} label="Ngày trong tuần" />}
                                    value={field.value}
                                    renderOption={(props, option, { selected }) => (
                                        <MenuItem {...props} selected={selected}>
                                            {option == 0 ? 'Chủ nhật' : `Thứ ${option + 1}`}
                                        </MenuItem>
                                    )}
                                    onChange={(event: any, newValue: number[]) => {
                                        field.onChange(newValue);
                                    }}
                                />
                            );
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
            </Popover>
        </>
    );
}
