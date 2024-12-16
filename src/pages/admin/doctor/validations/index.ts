import z from 'zod';
import { mustBeOptionalNumber, mustBePhoneNumber, ValidationMessages } from '@/utils/form-utils';

export const DoctorRegistrationSchema = z.object({
    departmentId: mustBeOptionalNumber('Mã chuyên khoa'),
    doctorId: mustBeOptionalNumber('Mã bác sĩ'),
    email: z.string().email(ValidationMessages.email('Email')),
    name: z
        .string()
        .min(1, ValidationMessages.required('Tên bác sĩ'))
        .max(255, ValidationMessages.maxLength('Tên bác sĩ', 255)),
    phoneNumber: mustBePhoneNumber(),
    specialization: z
        .string()
        .min(1, ValidationMessages.required('Chuyên khoa'))
        .max(1000, ValidationMessages.maxLength('Chuyên khoa', 1000)),
    password: z.string().refine(
        (value) => {
            const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
            return STRONG_PASSWORD.test(value);
        },
        {
            message: 'Mật khẩu phải chứa ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường và 1 số',
        }
    ),
    imageUrl: z.string().optional(),
    avatar: z.any().optional(),
});

export type DoctorRegistration = z.infer<typeof DoctorRegistrationSchema>;

export const DoctorUpdateSchema = DoctorRegistrationSchema.omit({ password: true });

export type DoctorUpdate = z.infer<typeof DoctorUpdateSchema>;
