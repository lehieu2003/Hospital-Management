import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import { DialogProps } from '@toolpad/core';
import { getDefaultValue } from "@/utils/form-utils";
import { getDefaultInvoiceValues, Invoice, InvoiceSchema } from "../validations";
import { resolve } from "path";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@toolpad/core";
import { getGetInvoiceQueryKey, getGetInvoicesQueryKey, getInvoice, useGetInvoice, usePutInvoice } from "@/services/api";
import React from "react";
import { GridCloseIcon } from "@mui/x-data-grid";

export default function UpdateModal({ open, onClose, payload }: DialogProps<number>) {
    const form = useForm<Invoice>({
        defaultValues: getDefaultInvoiceValues(),
        resolver: zodResolver(InvoiceSchema),
    });

    const queryClient = useQueryClient();
    const { show } = useNotifications();

    const { data, isLoading } = useGetInvoice(payload);

    React.useEffect(() => {
        if (data) {
            form.reset(data.data as any);
        }
    }, [data]);

    const { mutateAsync, isPending } = usePutInvoice({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetInvoicesQueryKey(),
                });
                show('Cập nhật hóa đơn thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                })
            }
        }
    });

    const onClosed = () => {
        onClose();
        form.reset();
    };

    const onSubmit = async (data: Invoice) => {
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
            <DialogTitle
                sx={{ m: 0, p: 2 }}
                id="customized-dialog-title"
            >
                Cập nhật bác sĩ
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClosed}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500]
                })}
            >
                <GridCloseIcon />
            </IconButton>

            <DialogContent dividers>
                <Stack gap={3} minWidth={400}>

                </Stack>
            </DialogContent>
        </Dialog>
    )
}