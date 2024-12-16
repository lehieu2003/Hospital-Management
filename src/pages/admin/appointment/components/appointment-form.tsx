import { Controller, UseFormReturn } from 'react-hook-form';

import { Autocomplete, TextField } from '@mui/material';
import { useGetDoctors, useGetPatients } from '@/services/api';
import { Appointment } from '../validations';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface AppointmentFormProps {
    form: UseFormReturn<Appointment>;
    type?: 'create' | 'update';
}

export default function AppointmentForm({ form, type }: AppointmentFormProps) {
    const { data: doctors, isLoading } = useGetDoctors(
        {
            PageSize: 100000,
        },
        {
            query: {
                select: (data) => data.data.data,
            },
        }
    );

    const { data: patients, isLoading: isLoadingDepartment } = useGetPatients(
        {
            PageSize: 100000,
        },
        {
            query: {
                select: (data) => data.data.data,
            },
        }
    );
    return (
        <>
            <Controller
                name="doctorId"
                control={form.control}
                render={({ field: { onBlur, onChange, value, ...rest } }) => {
                    const selected = doctors?.find((item) => item.doctorId == value) || null;
                    return (
                        <Autocomplete
                            disablePortal
                            options={
                                doctors?.map((option) => {
                                    return {
                                        value: option.doctorId,
                                        label: option.name,
                                    };
                                }) || []
                            }
                            renderInput={(params) => <TextField {...params} label="Bác sĩ" variant="outlined" />}
                            onChange={(_, data) => {
                                onChange(data?.value);
                            }}
                            onBlur={onBlur}
                            value={{ value: selected?.doctorId, label: selected?.name }}
                            getOptionKey={(option) => option.value || ''}
                            getOptionLabel={(option) => option.label || ''}
                            {...rest}
                        />
                    );
                }}
            />

            <Controller
                name="patientId"
                control={form.control}
                render={({ field: { onBlur, onChange, value, ...rest } }) => {
                    const selected = patients?.find((item) => item.patientId === value) || null;
                    return (
                        <Autocomplete
                            disablePortal
                            options={
                                patients?.map((option) => {
                                    return {
                                        value: option.patientId,
                                        label: option.name,
                                    };
                                }) || []
                            }
                            loading={isLoadingDepartment}
                            renderInput={(params) => <TextField {...params} label="Bệnh nhân" variant="outlined" />}
                            onChange={(_, data) => {
                                onChange(data?.value);
                            }}
                            onBlur={onBlur}
                            value={{ value: selected?.patientId, label: selected?.name }}
                            getOptionKey={(option) => option.value || ''}
                            getOptionLabel={(option) => option.label || ''}
                            {...rest}
                        />
                    );
                }}
            />

            <Controller
                name="appointmentDate"
                control={form.control}
                render={({ field: { value, ...rest } }) => (
                    <DateTimePicker
                        label="Ngày hẹn"
                        value={value ? dayjs(value) : undefined}
                        dayOfWeekFormatter={(dayOfWeek) => dayOfWeek.format('dd')}
						{...rest}
                    />
                )}
            ></Controller>
        </>
    );
}
