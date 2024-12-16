import { Controller, UseFormReturn } from 'react-hook-form';

import FormInput from '@/pages/admin/components/form/FormInput';
import { Autocomplete, TextField } from '@mui/material';
import { useGetDepartments } from '@/services/api';
import { MuiFileInput } from 'mui-file-input';
interface DoctorFormProps {
    form: UseFormReturn<any>;
    type?: 'create' | 'update';
}

export default function DoctorForm({ form, type }: DoctorFormProps) {
    const { data, isLoading } = useGetDepartments(
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
            <FormInput control={form.control} name="name" label="Tên bác sĩ" variant="outlined" />
            <Controller
                name="departmentId"
                control={form.control}
                render={({ field: { onBlur, onChange, value, ...rest } }) => {
                    const selected = data?.find((item) => item.departmentId === value) || null;

                    return (
                        <Autocomplete
                            disablePortal
                            options={
                                data?.map((option) => {
                                    return {
                                        value: option.departmentId,
                                        label: option.departmentName,
                                    };
                                }) || []
                            }
                            loading={isLoading}
                            renderInput={(params) => <TextField {...params} label="Chuyên khoa" variant="outlined" />}
                            onChange={(_, data) => {
                                onChange(data?.value);
                            }}
                            onBlur={onBlur}
                            value={{ value: selected?.departmentId, label: selected?.departmentName }}
                            getOptionKey={(option) => option.value || ''}
                            getOptionLabel={(option) => option.label || ''}
                            {...rest}
                        />
                    );
                }}
            />
            <Controller
                name="avatar"
                control={form.control}
                render={({ field }) => {
                    return <MuiFileInput label="Ảnh đại diện" {...field} />;
                }}
            />
            <FormInput control={form.control} name="email" label="Email" variant="outlined" />
            {type === 'create' && (
                <FormInput control={form.control} name="password" type="password" label="Mật khẩu" variant="outlined" />
            )}

            <FormInput control={form.control} name="phoneNumber" label="Số điện thoại" variant="outlined" />
            <FormInput control={form.control} name="specialization" label="Chuyên khoa" variant="outlined" />
            {/* <FormInput control={form.control} name="departmentId" label="Mã chuyên khoa" variant="outlined" disabled /> */}
        </>
    );
}
