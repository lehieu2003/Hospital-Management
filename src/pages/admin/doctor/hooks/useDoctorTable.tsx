import {
    GridActionsCellItem,
    GridCallbackDetails,
    GridColDef,
    GridFilterModel,
    GridPaginationModel,
    GridRowParams,
    GridSortModel,
} from '@mui/x-data-grid';
import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useDialogs, useNotifications } from '@toolpad/core';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import UpdateModal from '../components/update-modal';
import { getGetDoctorsQueryKey, useDeleteDoctor, useGetDoctors } from '@/services/api';
import { Department, Doctor, GetDoctorsParams } from '@/types';
import { camelCaseToPascalCase } from '@/utils/string-utils';
import DetailModal from '../components/detail-modal';
export default function useDoctorTable() {
    const [filter, setFilter] = React.useState<GetDoctorsParams>({
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
        setFilter((pre) => ({
            ...pre,
            Search: model.quickFilterValues?.[0] as string,
        }));
    };

    const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        console.log(model, details);
        setFilter((pre) => ({
            ...pre,
            SortBy: model[0]?.field,
            SortOrder: model[0]?.sort || 'asc',
        }));
    };

    const { data, isLoading } = useGetDoctors(
        {
            ...filter,
            Page: filter.Page! + 1,
            SortBy: camelCaseToPascalCase(filter.SortBy || 'doctorId'),
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    );

    const { show } = useNotifications();
    const queryClient = useQueryClient();

    const { mutateAsync } = useDeleteDoctor({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetDoctorsQueryKey(),
                });
                show('Xóa bác sĩ thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                });
            },
        },
    });

    const dialogs = useDialogs();
    const handleEdit = (id: number) => {
        dialogs.open(UpdateModal, id);
    };

    const columns: GridColDef[] = React.useMemo(() => {
        return [
            { field: 'doctorId', headerName: 'Mã bác sĩ', width: 150 },
            { field: 'name', headerName: 'Tên bác sĩ', flex: 1 },
            { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150 },
            { field: 'email', headerName: 'Email', width: 150 },
            { field: 'specialization', headerName: 'Chuyên khoa', width: 150 },
            {
                field: 'department',
                headerName: 'Chuyên khoa',
                width: 150,
                valueGetter: (value: Department) => value?.departmentName,
            },
            {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: (params: GridRowParams<Doctor>) => {
                    const id = params.row.doctorId as number;
                    return [
                        <GridActionsCellItem
                            showInMenu
                            icon={<ViewIcon />}
                            label="Xem"
                            onClick={() => {
                                dialogs.open(DetailModal, id);
                            }}
                        />,
                        <GridActionsCellItem
                            sx={{
                                width: '200px',
                            }}
                            showInMenu
                            icon={<EditIcon />}
                            label="Sửa"
                            onClick={() => handleEdit(id)}
                        />,
                        <GridActionsCellItem
                            showInMenu
                            icon={<DeleteIcon />}
                            label="Xóa"
                            onClick={() => {
                                dialogs.confirm(
                                    <>
                                        Bạn có chắc chắn muốn xóa bác sĩ <b>{params.row.name}</b> không?
                                    </>,
                                    {
                                        cancelText: 'Hủy',
                                        okText: 'Xóa',
                                        severity: 'error',
                                        title: 'Xác nhận xóa',
                                        async onClose(result) {
                                            if (result) {
                                                await mutateAsync({ id });
                                            }
                                        },
                                    }
                                );
                            }}
                        />,
                    ];
                },
            },
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
                    field: filter.SortBy || 'doctorId',
                    sort: filter.SortOrder || 'asc',
                },
            ],
        },
        filter: {
            set: setFilter,
            value: filter,
        },
    };
}
