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
import { getGetPatientsQueryKey, useDeletePatient, useGetPatients } from '@/services/api';
import { Patient, GetPatientsParams } from '@/types';
import { camelCaseToPascalCase } from '@/utils/string-utils';
import { Gender, GenderLabel } from '@/services/enums/gender';
import DetailModal from '../components/detail-modal';
export default function usePatientTable() {
    const [filter, setFilter] = React.useState<GetPatientsParams>({
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

    const { data, isLoading } = useGetPatients(
        {
            ...filter,
            Page: filter.Page! + 1,
            SortBy: camelCaseToPascalCase(filter.SortBy || 'patientId'),
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    );
    const { show } = useNotifications();
    const queryClient = useQueryClient();

    const { mutateAsync } = useDeletePatient({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetPatientsQueryKey(),
                });
                show('Xóa bệnh nhân thành công', {
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
            { field: 'patientId', headerName: 'Mã bệnh nhân', width: 150 },
            { field: 'name', headerName: 'Tên bệnh nhân', width: 150 },
            {
                field: 'gender',
                headerName: 'Giới tính',
                width: 150,
                valueGetter: (value: Gender) => GenderLabel[value],
            },
            { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150 },
            { field: 'email', headerName: 'Email', width: 150 },
            { field: 'healthInsurance', headerName: 'Bảo hiểm y tế', width: 150 },
            {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: (params: GridRowParams<Patient>) => {
                    const id = params.row.patientId as number;
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
                    field: filter.SortBy || 'patientId',
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
