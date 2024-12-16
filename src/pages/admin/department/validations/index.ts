import z from 'zod'

export const DepartmentSchema = z.object({
    departmentId: z.preprocess(value => {
        if (value === null || value === undefined || value === '') {
            return undefined
        }
        return value
    }, z.number().optional()),
    departmentName: z.string({ message: 'Tên chuyên khoa không được để trống' })
        .max(255, { message: 'Tên chuyên khoa không được quá 255 ký tự' }).min(1, { message: 'Tên chuyên khoa không được để trống' }),
    description: z.string().max(255, { message: 'Mô tả không được quá 255 ký tự' }).optional(),
})

export type Department = z.infer<typeof DepartmentSchema>
