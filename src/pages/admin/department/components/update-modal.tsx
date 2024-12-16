import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Department, DepartmentSchema } from '../validations';
import { useQueryClient } from '@tanstack/react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNotifications } from '@toolpad/core/useNotifications';
import { DialogProps } from '@toolpad/core';
import React from 'react';
import FormInput from '../../components/form/FormInput';
import { getDefaultValue } from '@/utils/form-utils';
import { getGetDepartmentsQueryKey, useGetDepartment, usePutDepartment } from '@/services/api';
export default function UpdateModal({ open, onClose, payload }: DialogProps<number>) {
    const form = useForm<Department>({
        defaultValues: getDefaultValue(DepartmentSchema),
        resolver: zodResolver(DepartmentSchema),
    });
    const queryClient = useQueryClient();
    const { show } = useNotifications();

    const { data, isLoading } = useGetDepartment(payload);

    React.useEffect(() => {
        if (data) {
            form.reset(data.data as any);
        }
    }, [data]);

    const { mutateAsync, isPending } = usePutDepartment({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetDepartmentsQueryKey(),
                });
                show('Cập nhật chuyên khoa thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                });
            },
        },
    });
    const onClosed = () => {
        onClose();
        form.reset();
    };
    const onSubmit = async (data: Department) => {
        await mutateAsync({ data, id: payload });
        onClosed();
    };

    return (
        <Dialog
            component={'form'}
            onSubmit={form.handleSubmit(onSubmit)}
            onClose={onClosed}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Tạo mới chuyên khoa
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClosed}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <GridCloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Stack gap={3} minWidth={400}>
                    <FormInput
                        control={form.control}
                        name="departmentName"
                        label="Tên chuyên khoa"
                        variant="outlined"
                    />
                    <FormInput
                        control={form.control}
                        name="description"
                        label="Mô tả"
                        variant="outlined"
                        multiline
                        rows={3}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={isPending} autoFocus type="reset" variant="outlined" onClick={onClosed}>
                    Đóng
                </Button>
                <LoadingButton autoFocus type="submit" variant="contained" loading={isPending}>
                    Lưu
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
