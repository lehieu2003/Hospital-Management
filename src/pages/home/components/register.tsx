import { Form, Button } from 'react-bootstrap';
import styled from '@emotion/styled';
import { z } from 'zod';
import { Gender } from '@/services/enums/gender';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ValidationMessages } from '@/utils/form-utils';
import { usePatientRegister } from '@/services/api';

const FormContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
`;

export enum IdentityType {
    Email = 0,
    Phone = 1,
    Username = 2,
}
interface RegisterFormProps {
    nameIdentifier?: string;
    type?: IdentityType;
    onDone?: () => void;
}

const RegisterSchema = z
    .object({
        email: z
            .string()
            .email({
                message: 'Email không hợp lệ',
            })
            .optional(),
        password: z.string().refine(
            (value) => {
                const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
                return STRONG_PASSWORD.test(value);
            },
            {
                message: 'Mật khẩu phải chứa ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường và 1 số',
            }
        ),
        phoneNumber: z
            .string()
            .refine((value) => /^\d{10,11}$/.test(value), {
                message: 'Số điện thoại không hợp lệ',
            })
            .optional(),
        name: z.string().min(1, ValidationMessages.required('Tên')).max(255, ValidationMessages.maxLength('Tên', 255)),
        gender: z.nativeEnum(Gender),
        dateOfBirth: z.string().refine((value) => new Date(value) < new Date(), {
            message: 'Ngày sinh không hợp lệ',
        }),
        healthInsurance: z.string().optional(),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm({ nameIdentifier, type, onDone }: RegisterFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
    });
    const { mutateAsync, isPending } = usePatientRegister();

    React.useEffect(() => {
        if (type === IdentityType.Email) {
            setValue('email', nameIdentifier);
        } else if (type === IdentityType.Phone) {
            setValue('phoneNumber', nameIdentifier);
        } else {
            setValue('email', '');
            setValue('phoneNumber', '');
        }
    }, [nameIdentifier, type]);

    const onSubmit = async (data: RegisterFormValues) => {
        const res = await mutateAsync({ data });
        onDone?.();
        };
    return (
        <FormContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {(type === IdentityType.Phone || type === null) && (
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Số điện thoại <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Form.Control
                                    disabled
                                    type="tel"
                                    placeholder="Nhập số điện thoại"
                                    isInvalid={!!errors.phoneNumber?.message}
                                    {...field}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phoneNumber?.message}</Form.Control.Feedback>
                    </Form.Group>
                )}

                {(type === IdentityType.Email || type === null) && (
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Form.Control
                                    disabled
                                    type="email"
                                    placeholder="Email"
                                    isInvalid={!!errors.email?.message}
                                    {...field}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>
                        Mật khẩu <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                                isInvalid={!!errors.password?.message}
                                {...field}
                            />
                        )}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        Xác nhận mật khẩu <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Form.Control
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                isInvalid={!!errors.confirmPassword?.message}
                                {...field}
                            />
                        )}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        Tên <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên của bạn"
                                isInvalid={!!errors.name?.message}
                                {...field}
                            />
                        )}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        Giới tính <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="d-flex gap-3">
                        <Controller
                            name="gender"
                            control={control}
                            defaultValue={Gender.FEMALE}
                            render={({ field }) => (
                                <>
                                    <Button
                                        {...field}
                                        variant={field.value === Gender.FEMALE ? 'primary' : 'outline-primary'}
                                        onClick={() => field.onChange(Gender.FEMALE)}
                                    >
                                        👩 Nữ
                                    </Button>
                                    <Button
                                        {...field}
                                        variant={field.value === Gender.MALE ? 'primary' : 'outline-primary'}
                                        onClick={() => field.onChange(Gender.MALE)}
                                    >
                                        👨 Nam
                                    </Button>
                                </>
                            )}
                        />
                    </div>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        Ngày sinh <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                        name="dateOfBirth"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Form.Control
                                type="date"
                                placeholder="Ngày sinh"
                                isInvalid={!!errors.dateOfBirth}
                                {...field}
                            />
                        )}
                    />
                    <Form.Control.Feedback type="invalid">{!!errors.dateOfBirth?.message}</Form.Control.Feedback>
                </Form.Group>

                <Button disabled={isPending} variant="primary" type="submit" className="w-100">
                    Đăng ký
                </Button>
            </Form>
        </FormContainer>
    );
}
