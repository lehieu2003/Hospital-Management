import z from 'zod';
import { mustBeDayjs, mustBeNumber, ValidationMessages } from '@/utils/form-utils';
import dayjs from 'dayjs';

export const DiagnosisSchema = z.object({
    appointmentId: mustBeNumber('Lịch hẹn'),
    description: z.string().max(2000, ValidationMessages.maxLength('Chuẩn đoán', 2000)).optional(),
    diagnosisDate: mustBeDayjs('Ngày chuẩn đoán').default(() => dayjs()),
    notes: z.string().max(2000, ValidationMessages.maxLength('Ghi chú', 2000)).optional(),
});

export type Diagnosis = z.infer<typeof DiagnosisSchema>;
