import { Controller, UseFormReturn } from 'react-hook-form';

import FormInput from '@/pages/admin/components/form/FormInput';
import { Autocomplete, TextField } from '@mui/material';
import { useGetAppointments } from '@/services/api';
import dayjs from 'dayjs';
import React from 'react';
import { Diagnosis } from '../validations';
import { DateTimePicker } from '@mui/x-date-pickers';

interface DiagnosisFormProps {
    form: UseFormReturn<Diagnosis>;
    type?: 'create' | 'update';
    initAppointmentId?: number;
}

export default function DiagnosisForm({ form, type, initAppointmentId }: DiagnosisFormProps) {
    React.useEffect(() => {
        if (initAppointmentId) {
            form.setValue('appointmentId', initAppointmentId);
        }
    }, [initAppointmentId]);
    const { data, isLoading } = useGetAppointments(
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
                name="appointmentId"
                control={form.control}
                render={({ field: { onBlur, onChange, value, ...rest } }) => {
                    const selected = data?.find((item) => item.appointmentId === value) || null;
                    return (
                        <Autocomplete
                            disabled={initAppointmentId != undefined}
                            disablePortal
                            options={
                                data?.map((option) => {
                                    return {
                                        value: option.appointmentId,
                                        label:
                                            dayjs(option.appointmentDate).format('DD/MM/YYYY HH:mm') +
                                            ' - ' +
                                            option.patient?.name,
                                    };
                                }) || []
                            }
                            loading={isLoading}
                            renderInput={(params) => <TextField {...params} label="Lịch hẹn" variant="outlined" />}
                            onChange={(_, data) => {
                                onChange(data?.value);
                            }}
                            onBlur={onBlur}
                            value={{
                                value: selected?.appointmentId,
                                label: selected
                                    ? dayjs(selected.appointmentDate).format('DD/MM/YYYY HH:mm') +
                                      ' - ' +
                                      selected.patient?.name
                                    : '',
                            }}
                            getOptionKey={(option) => option.value || ''}
                            getOptionLabel={(option) => option.label || ''}
                            {...rest}
                        />
                    );
                }}
            />
            <Controller
                control={form.control}
                name="diagnosisDate"
                render={({ field: { value, ...rest } }) => {
                    return (
                        <DateTimePicker
                            label="Ngày chuẩn đoán"
                            {...rest}
                            value={value ? dayjs(value) : dayjs()}
                            dayOfWeekFormatter={(day) => day.format('dd')}
                        />
                    );
                }}
            />

            <FormInput
                control={form.control}
                name="description"
                label="Chuẩn đoán"
                variant="outlined"
                multiline
                rows={3}
            />
            <FormInput control={form.control} name="notes" label="Ghi chú" variant="outlined" multiline rows={3} />
            {/* <FormInput control={form.control} name="departmentId" label="Mã chuyên khoa" variant="outlined" disabled /> */}
        </>
    );
}
