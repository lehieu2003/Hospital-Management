import z from 'zod'
import { mustBeDayjs, mustBeOptionalNumber, mustBePhoneNumber, ValidationMessages } from '@/utils/form-utils'
import { Gender } from '@/services/enums/gender'

export const PatientSchema = z.object({
    dateOfBirth: mustBeDayjs('sinh nhật'),
    email: z.string().email({ message: ValidationMessages.email('Email') }).optional(),
    gender:z.nativeEnum(Gender).default(Gender.FEMALE),
    healthInsurance: z.string()
    .min(1,ValidationMessages.required('Mã bảo hiểm'))
    .max(100,ValidationMessages.maxLength('Mã bảo hiểm',100)),
    name: z.string().min(1,ValidationMessages.required('Tên bệnh nhân')).max(100,ValidationMessages.maxLength('Tên bệnh nhân',100)).optional(),
    phoneNumber: mustBePhoneNumber().optional(),
    patientId: z.custom(mustBeOptionalNumber).optional(),
    userId: z.string().optional(),
    password: z.string().optional(),
})  




export type Patient = z.infer<typeof PatientSchema>

