import { Form, Button } from 'react-bootstrap';
import styled from '@emotion/styled';
import { z } from 'zod';
import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ValidationMessages } from '@/utils/form-utils';
import { useLogin } from '@/services/api';
import useUserStore from '@/stores/user-store';
import dayjs from 'dayjs';
import { UserContext } from '../components/context/usercontext';


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
interface LoginFormProps {
    nameIdentifier: string;
    type?: IdentityType;
    onDone?: () => void;
}

const LoginSchema = z.object({
    nameIdentifier: z.string().min(1, ValidationMessages.required('Email hoặc số điện thoại')),
    password: z.string().min(1, ValidationMessages.required('Mật khẩu')),
});
type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginForm({ nameIdentifier, type, onDone }: LoginFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
    });
    const { mutate, isPending } = useLogin();
    const { setProfile, setToken } = useUserStore();
    const { userId, setUserId } = useContext(UserContext);


    React.useEffect(() => {
        setValue('nameIdentifier', nameIdentifier);
    }, [nameIdentifier, type]);
    console.log(errors);

    const onSubmit = async (data: LoginFormValues) => {
        mutate(
            { data },
            {
                onError: (error) => {
                    const body = error.response?.data as any;
                    if (body?.password) {
                        setError('password', {
                            type: 'manual',
                            message: 'Sai mật khẩu',
                        });
                        return;
                    }
                    if (body?.email) {
                        setError('nameIdentifier', {
                            type: 'manual',
                            message: 'Email hoặc số điện thoại không tồn tại',
                        });
                        return;
                    }
                },
                onSuccess: (data) => {
                    console.log("user", data.data.user!.id!);
                    // Lưu userId vào UserContext
                    setUserId(data.data.user!.id!);
                    setToken({
                        accessToken: data.data.token!.token!,
                        expirationAt: dayjs(data.data.token?.expires).toDate(),
                    });
                    onDone?.();
                },
            }
        );
    };
    return (
        <FormContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Email hoặc sđt <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                        name="nameIdentifier"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Form.Control
                                disabled
                                type="text"
                                placeholder="Nhập email hoặc số điện thoại"
                                isInvalid={!!errors.nameIdentifier?.message}
                                {...field}
                            />
                        )}
                    />
                    <Form.Control.Feedback type="invalid">{errors.nameIdentifier?.message}</Form.Control.Feedback>
                </Form.Group>
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
                <Button disabled={isPending} variant="primary" type="submit" className="w-100">
                    Đăng nhập
                </Button>
            </Form>
        </FormContainer>
    );
}
