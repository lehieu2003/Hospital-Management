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
import { useGetDiagnoses, useDeleteDiagnosis, getGetDiagnosesQueryKey } from '@/services/api';
import { Diagnosis, DiagnosisDTO, GetDiagnosesParams } from '@/types';
import { camelCaseToPascalCase } from '@/utils/string-utils';
import dayjs from 'dayjs';
import DetailModal from '../components/detail-modal';
export default function useDiagnosisTable() {
    const [filter, setFilter] = React.useState<GetDiagnosesParams>({
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

    const { data, isLoading } = useGetDiagnoses(
        {
            ...filter,
            Page: filter.Page! + 1,
            SortBy: camelCaseToPascalCase(filter.SortBy || 'diagnosisId'),
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    );
    const { show } = useNotifications();
    const queryClient = useQueryClient();

    const { mutateAsync } = useDeleteDiagnosis({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetDiagnosesQueryKey(),
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

    const columns: GridColDef<DiagnosisDTO>[] = React.useMemo(() => {
        return [
            {
                field: 'appointment.patient.name',
                headerName: 'Bệnh nhân',
                width: 200,
                sortable: false,
                valueGetter: (_, params: DiagnosisDTO) => params.appointment?.patient?.name,
            },
            {
                field: 'appointment.doctor.name',
                headerName: 'Bác sĩ',
                width: 200,
                sortable: false,
                valueGetter: (_, params: DiagnosisDTO) => params.appointment?.doctor?.name,
            },
            {
                field: 'diagnosisDate',
                headerName: 'Ngày chuẩn đoán',
                width: 200,
                valueGetter: (params: string) => dayjs(params).format('DD/MM/YYYY HH:mm'),
            },
            {
                field: 'description',
                headerName: 'Mô tả',
                flex: 1,
                valueGetter: (params: string) =>
                    (params?.length || 0) > 50 ? params?.substring(0, 50) + '...' : params,
            },
            {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: (params: GridRowParams<Diagnosis>) => {
                    const id = params.row.diagnosisId as number;
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
                                        Bạn có chắc chắn muốn xóa chuẩn đoán <b>{params.row.diagnosisId}</b> không?
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
                    field: filter.SortBy || 'diagnosisId',
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
