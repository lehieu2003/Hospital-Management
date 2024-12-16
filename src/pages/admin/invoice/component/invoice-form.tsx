import { useGetAppointments } from "@/services/api";
import { Controller, UseFormReturn } from "react-hook-form";
import FormInput from "../../components/form/FormInput";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";
import { Invoice } from "../validations";

interface InvoiceFormProps {
    form: UseFormReturn<Invoice>;
    type?: 'create' | 'update';
    initAppointmentId?: number;
}

export default function InvoiceFrom({ form, type, initAppointmentId }: InvoiceFormProps) {
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
                                        patientId: option.patientId, // Thêm patientId vào options
                                    };
                                }) || []
                            }
                            loading={isLoading}
                            renderInput={(params) => <TextField {...params} label="Lịch hẹn" variant="outlined" />}
                            onChange={(_, selectedOption) => {
                                if (selectedOption) {
                                    onChange(selectedOption.value);
                                    form.setValue('patientId', selectedOption.patientId || 0);
                                } else {
                                    onChange(null);
                                    form.setValue('patientId', 0);
                                }
                            }}
                            onBlur={onBlur}
                            value={
                                selected
                                    ? {
                                        value: selected.appointmentId,
                                        label:
                                            dayjs(selected.appointmentDate).format('DD/MM/YYYY HH:mm') +
                                            ' - ' +
                                            selected.patient?.name,
                                        patientId: selected.patientId,
                                    }
                                    : null
                            }
                            getOptionLabel={(option) => option.label || ''}
                            {...rest}
                        />
                    );
                }}
            />


            <Controller
                name="invoiceDate"
                control={form.control}
                render={({ field: { value, ...rest } }) => (
                    <DatePicker
                        label="Ngày tạo hóa đơn"
                        value={value ? dayjs(value) : null}
                        dayOfWeekFormatter={(date) => date.format('dd')}
                        {...rest}
                    />
                )}
            ></Controller>

            <Controller
                name="totalAmount"
                control={form.control}
                render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                        {...rest}
                        label="Tổng tiền"
                        type="number"
                        value={value ?? ''} // Đảm bảo giá trị ban đầu không bị lỗi undefined
                        onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0; // Chuyển đổi sang số
                            onChange(val);
                        }}
                        variant="outlined"
                    />
                )}
            />


            <FormInput
                control={form.control}
                name="status"
                label="Trạng thái"
                variant="outlined"
            />
        </>
    )
}