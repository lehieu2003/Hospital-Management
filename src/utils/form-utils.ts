import dayjs from 'dayjs';
import z, { ZodObject } from 'zod';

export function getDefaultValue<T extends ZodObject<any>>(schema: T): z.infer<T> {
    const defaultValue: T = {} as T;
    for (const key in schema.shape) {
        if (schema.shape.hasOwnProperty(key)) {
            const field = schema.shape[key];
            defaultValue[key as keyof T] = field?._def?.defaultValue || '';
        }
    }
    return defaultValue;
}

export const ValidationMessages = {
    required: (field: string) => `${field} không được để trống`,
    maxLength: (field: string, length: number) => `${field} không được quá ${length} ký tự`,
    minLength: (field: string, length: number) => `${field} không được ít hơn ${length} ký tự`,
    number: (field: string) => `${field} phải là số`,
    email: (field: string) => `${field} phải là email`,
};

export const mustBeOptionalNumber = (field: string) =>
    z.preprocess(
        (value) => {
            if (value === null || value === undefined || value === '') {
                return undefined;
            }
            if (isNaN(Number(value))) {
                return ValidationMessages.number(field);
            }
            return Number(value);
        },
        z
            .number({
                message: ValidationMessages.number(field),
            })
            .optional()
    );

export const mustBeNumber = (field: string) =>
    z.preprocess(
        (value) => {
            if (isNaN(Number(value))) {
                return ValidationMessages.number(field);
            }
            return Number(value);
        },
        z.number({
            message: ValidationMessages.number(field),
        })
    );

export const mustBePhoneNumber = (customMessage?: string) =>
    z
        .string()
        .refine(
            (value) => {
                return /^0[0-9]{9,10}$/.test(value);
            },
            {
                message: customMessage || `Số điện thoại không hợp lệ`,
            }
        )
        .optional();

export const mustBeDayjs = (field: string) =>
    z.preprocess(
        (value: any) => {
            if (value === null || value === undefined || value === '') {
                return undefined;
            }
            return dayjs(value);
        },
        z
            .custom<dayjs.Dayjs>((value) => {
                if (!value) {
                    return `Ngày tháng không hợp lệ`;
                }
                if (!dayjs.isDayjs(value)) {
                    return `Ngày tháng không hợp lệ`;
                }
                return value;
            })
            .optional()
    );

/*
eg: {Doctor:{Id:1}} => {"Doctor.Id":1}
*/
export const removeDotObject = (data: { [key: string]: any }) => {
    const formattedData: { [key: string]: { [key: string]: any } } = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (typeof value === 'object') {
                for (const subKey in value) {
                    if (value.hasOwnProperty(subKey)) {
                        formattedData[`${key}.${subKey}`] = value[subKey];
                    }
                }
            } else {
                formattedData[key] = value;
            }
        }
    }
    return formattedData;
};
