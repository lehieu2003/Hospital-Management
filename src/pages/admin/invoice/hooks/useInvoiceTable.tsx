import { GridActionsCellItem, GridCallbackDetails, GridColDef, GridFilterModel, GridPaginationModel, GridRowParams, GridSortModel } from "@mui/x-data-grid";
import React from "react";
import { Appointment, GetInvoicesParams, Invoice, Patient } from "@/types";
import ViewIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailModal from "../component/detail-modal";
import { useDialogs, useNotifications } from "@toolpad/core";
import { getGetInvoicesQueryKey, getInvoices, useDeleteInvoice, useGetAppointment, useGetInvoices } from "@/services/api";
import { keepPreviousData, QueryClient, useQueryClient } from "@tanstack/react-query";
import { camelCaseToPascalCase } from "@/utils/string-utils";
import { InvoiceDTO } from "@/types";

export default function useInvoiceTable() {
    const [filter, setFilter] = React.useState<GetInvoicesParams>({
        Page: 0,
        PageSize: 10,
    });

    const handlePageChange = (page: GridPaginationModel) => {
        setFilter((pre) => ({
            ...pre,
            Page: page.page,
            PageSize: page.pageSize,
        }));
    };

    const handleFilterModelChange = (model: GridFilterModel) => {
        const updatedFilter: GetInvoicesParams = {
            ...filter,
            Search: model.quickFilterValues?.[0] as string,
        };

        if (model.items) {
            const dateFilter = model.items.find(item => item.field === 'invoiceDate');
            if (dateFilter) {
                updatedFilter["InvoiceDate.Equal"] = dateFilter.value;
            }

            const priceFilter = model.items.find(item => item.field === 'totalAmount');
            if (priceFilter) {
                const priceRange = priceFilter.value as number[];

                if (priceRange && priceRange.length === 2) {
                    const [minPrice, maxPrice] = priceRange;

                    const filteredItems = model.items.filter(item =>
                        item.field === 'totalAmount' &&
                        typeof item.value === 'number' &&
                        item.value >= minPrice &&
                        item.value <= maxPrice
                    );

                    updatedFilter["TotalAmount.In"] = filteredItems.map(item => item.value);
                }
            }
        }


        setFilter(updatedFilter);
    };


    const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        setFilter((pre) => ({
            ...pre,
            SortBy: model[0]?.field,
            SortOrder: model[0]?.sort || 'asc',
        }));
    };

    const { data, isLoading } = useGetInvoices(
        {
            ...filter,
            Page: filter.Page! + 1,
            SortBy: camelCaseToPascalCase(filter.SortBy || "invoiceId"),
            "InvoiceDate.GreaterThanOrEqual": filter["InvoiceDate.GreaterThanOrEqual"],
            "InvoiceDate.LessThanOrEqual": filter["InvoiceDate.LessThanOrEqual"],
            "TotalAmount.GreaterThanOrEqual": filter["TotalAmount.GreaterThanOrEqual"],
            "TotalAmount.LessThanOrEqual": filter["TotalAmount.LessThanOrEqual"],
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    );

    const dialogs = useDialogs();
    const { show } = useNotifications();
    const queryClient = useQueryClient();
    const { mutateAsync } = useDeleteInvoice({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetInvoicesQueryKey(),
                });
                show('Xóa hóa đơn thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                });
            },
        }
    });

    const columns: GridColDef<InvoiceDTO>[] = React.useMemo(() => {
        return [
            { field: 'invoiceId', headerName: 'ID', width: 150 },
            {
                field: 'patient',
                headerName: 'Bệnh nhân',
                width: 150,
                valueGetter: (params: Patient) => params.name,
            },
            {
                field: 'invoiceDate',
                headerName: 'Ngày lập hóa đơn',
                width: 150,
                renderCell: (params) => {
                    const invoiceDate = params.row.invoiceDate;
                    if (!invoiceDate) return <span>Không có dữ liệu</span>;
                    const [year, month, day] = invoiceDate.split('T')[0].split('-');
                    return <span>{`${day}/${month}/${year}`}</span>;
                },
            },
            {
                field: 'appointment',
                headerName: 'Ngày và giờ cuộc hẹn',
                width: 200,
                valueGetter: (params: Appointment) => {
                    const appointmenetDate = params.appointmentDate?.toString();
                    const [year, month, day] = appointmenetDate!.split('T')[0].split('-');
                    const time = params.appointmentTime;
                    return `${day}/${month}/${year} - ${time}`;
                },
                filterable: true,
            },
            {
                field: 'totalAmount',
                headerName: 'Tổng tiền',
                width: 150,
                filterable: true,
            },
            {
                field: 'status',
                headerName: 'Trạng thái hóa đơn',
                width: 150
            },
            {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: (params: GridRowParams<Invoice>) => {
                    const id = params.row.invoiceId as number;
                    return [
                        <GridActionsCellItem
                            showInMenu
                            icon={<ViewIcon />}
                            label="Xem"
                            onClick={() => {
                                console.log("id invoice: ", id);
                                dialogs.open(DetailModal, id);
                            }}
                        />,
                        <GridActionsCellItem
                            showInMenu
                            icon={<DeleteIcon />}
                            label="Xóa"
                            onClick={() => {
                                dialogs.confirm(
                                    <>
                                        Bạn có chắc là muốn xóa hóa đơn <b>#{params.row.invoiceId}</b>
                                    </>,
                                    {
                                        cancelText: 'Huỷ',
                                        okText: 'Xóa',
                                        severity: 'error',
                                        title: 'Xác nhận xóa',
                                        async onClose(result) {
                                            if (result) {
                                                await mutateAsync({ id });
                                            }
                                        }
                                    }
                                )
                            }}
                        />
                    ]
                }
            }
        ];
    }, []);
    return {
        table: {
            columns,
            data: data?.data || {
                data: [],
                totalItems: 0,
            },
            isLoading,
            handlePageChange,
            handleFilterModelChange,
            handleSortModelChange,
            filterModel: {
                items: [],
                quickFilterValues: filter.Search ? [filter.Search] : [],
            },
            pagination: {
                page: filter.Page!,
                pageSize: filter.PageSize!,
            },
            sortModel: [
                {
                    field: filter.SortBy || 'invoiceId',
                    sort: filter.SortBy || 'asc',
                }
            ],
        },
        filter: {
            set: setFilter,
            value: filter,
        }
    }
}