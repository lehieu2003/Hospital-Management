import { Controller, UseFormReturn } from 'react-hook-form';

import FormInput from '@/pages/admin/components/form/FormInput';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Patient } from '../validations';
import { Gender, GenderLabel } from '@/services/enums/gender';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface PatientFormProps {
    form: UseFormReturn<Patient>;
    type?: 'create' | 'update';
}

export default function PatientForm({ form, type }: PatientFormProps) {
    return (
        <>
            <FormInput control={form.control} name="name" label="Tên bệnh nhân" variant="outlined" />
            <Controller
                name="gender"
				control={form.control}
                render={({ field }) => (
                    <FormControl fullWidth>
                        <InputLabel id="genderInput">Giới tính</InputLabel>
                        <Select labelId="genderInput" id="demo-simple-select" label="Age" {...field}>
                            {Object.values(Gender).map((g) => (
                                <MenuItem key={g} value={g}>{GenderLabel[g]}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            ></Controller>
			<Controller
                name="dateOfBirth"
				control={form.control}
                render={({ field:{value,...rest} }) => (
                    <DatePicker
						label="Ngày sinh"
						value={value?dayjs(value):undefined}
						dayOfWeekFormatter={(dayOfWeek) => dayOfWeek.format('dd')}
                        {...rest}
					/>
                )}
            ></Controller>
            <FormInput control={form.control} name="email" label="Email" variant="outlined" />
            <FormInput control={form.control} name="phoneNumber" label="Số điện thoại" variant="outlined" />
          

            <FormInput control={form.control} name="healthInsurance" label="Bảo hiểm y tế" variant="outlined" />
			{type === 'create' && (
                <FormInput control={form.control} name="password" type="password" label="Mật khẩu" variant="outlined" />
            )}
	    </>
    );
}
