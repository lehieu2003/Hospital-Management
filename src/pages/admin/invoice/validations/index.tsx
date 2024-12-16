import z from 'zod';
import { mustBeDayjs, mustBeNumber } from '@/utils/form-utils';
import dayjs from 'dayjs';

export const InvoiceSchema = z.object({
    invoiceId: mustBeNumber('Hóa đơn'),
    patientId: mustBeNumber('Mã bệnh nhân'),
    appointmentId: z.number().nullable().optional(),
    invoiceDate: mustBeDayjs('Ngày tạo hóa đơn').default(() => dayjs()), // Chuyển mặc định thành chuỗi ISO
    totalAmount: z
        .preprocess(
            (value) => {
                if (typeof value === 'string') {
                    const parsed = parseFloat(value);
                    return isNaN(parsed) ? 0 : parsed; // Trả về `0` nếu giá trị không hợp lệ
                }
                return value;
            },
            z.number()
                .min(0, 'Tổng tiền phải lớn hơn hoặc bằng 0')
                .refine((value) => value.toFixed(2).length <= 18, {
                    message: 'Tổng tiền không được vượt quá giới hạn (18,2)',
                })
        )
        .optional(),
    status: z
        .string()
        .min(1, 'Trạng thái không được để trống')
        .max(50, 'Trạng thái không được vượt quá 50 ký tự'),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
