import { GridActionsCellItem, GridCallbackDetails, GridColDef, GridFilterModel, GridPaginationModel, GridRowParams, GridSortModel } from '@mui/x-data-grid';
import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useDialogs, useNotifications } from '@toolpad/core';
import React from 'react';
import { Department } from '../validations';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import UpdateModal from '../components/update-modal';
import { getGetDepartmentsQueryKey, useDeleteDepartment, useGetDepartments } from '@/services/api';
import { GetDepartmentsParams } from '@/types';
import { camelCaseToPascalCase } from '@/utils/string-utils';
export default function useDepartment() {
    const [filter, setFilter] = React.useState<GetDepartmentsParams>({
        Page: 0,
        PageSize: 10,
    })

    const handlePageChange = (page: GridPaginationModel) => {
        setFilter(pre => ({
            ...pre,
            Page: page.page,
            PageSize: page.pageSize
        }))
    }

    const handleFilterModelChange = (model: GridFilterModel) => {
        setFilter(pre => ({
            ...pre,
            Search: model.quickFilterValues?.[0] as string
        }))
    }

    const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        console.log(model, details)
        setFilter(pre => ({
            ...pre,
            SortBy: model[0]?.field,
            SortOrder: model[0]?.sort || 'asc'
        }))
    }

    const { data, isLoading } = useGetDepartments({
        ...filter,
        Page: filter.Page! + 1,
        SortBy: camelCaseToPascalCase(filter.SortBy || 'departmentId')
    }, {
        query: {
            placeholderData: keepPreviousData
        }
    });
    const { show } = useNotifications()
    const queryClient = useQueryClient()

    const { mutateAsync } = useDeleteDepartment({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetDepartmentsQueryKey()
                })
                show('Xóa chuyên khoa thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                })

            },
        }
    });

    const dialogs = useDialogs();
    const handleEdit = (id: number) => {
        dialogs.open(UpdateModal, id);
    }

    const columns: GridColDef[] = React.useMemo(() => {
        return [
            { field: 'departmentId', headerName: 'Mã chuyên khoa', minWidth: 150 },
            { field: 'departmentName', headerName: 'Tên chuyên khoa', flex: 1 },
            { field: 'description', headerName: 'Mô tả', flex: 1 },
            {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: (params: GridRowParams<Department>) => {
                    const id = params.row.departmentId as number;
                    return [
                        <GridActionsCellItem showInMenu icon={<ViewIcon />} label="Xem" onClick={() => { }} />,
                        <GridActionsCellItem sx={{
                            width: '200px',
                        }} showInMenu icon={<EditIcon />} label="Sửa" onClick={() => handleEdit(id)} />,
                        <GridActionsCellItem showInMenu icon={<DeleteIcon />} label="Xóa" onClick={() => {
                            dialogs.confirm(
                                <>
                                    Bạn có chắc chắn muốn xóa chuyên khoa <b>{params.row.departmentName}</b> không?
                                </>,
                                {
                                    cancelText: "Hủy",
                                    okText: "Xóa",
                                    severity: "error",
                                    title: "Xác nhận xóa",
                                    async onClose(result) {
                                        if (result) {
                                            await mutateAsync({ id })
                                        }
                                    },
                                })
                        }} />,
                    ]
                },

            }
        ];
    }, []);
    return {
        table: {
            columns,
            data: data?.data || {
                data: [],
                totalItems: 0
            },
            isLoading,
            handlePageChange,
            handleFilterModelChange,
            handleSortModelChange,
            filterModel: {
                items: [],
                quickFilterValues: filter.Search ? [filter.Search] : []
            },
            pagination: {
                page: filter.Page!,
                pageSize: filter.PageSize!,
            },
            sortModel: [{
                field: filter.SortBy || 'departmentId',
                sort: filter.SortOrder || 'asc'
            }]
        }
    }
}
