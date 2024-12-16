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
import {
    getGetAllDoctorSchedulesQueryKey, useDeleteDoctorSchedule,
    useGetAllDoctorSchedules
} from '@/services/api';
import { Doctor, DoctorSchedule, GetAllDoctorSchedulesParams } from '@/types';
import { camelCaseToPascalCase } from '@/utils/string-utils';
import DetailModal from '../components/detail-modal';
import dayjs from 'dayjs';
export default function useDoctorScheduleTable() {
    const [filter, setFilter] = React.useState<GetAllDoctorSchedulesParams>({
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

    const { data, isLoading } = useGetAllDoctorSchedules(
        {
            ...filter,
            Page: filter.Page! + 1,
            SortBy: camelCaseToPascalCase(filter.SortBy || 'scheduleId'),
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    );
    const { show } = useNotifications();
    const queryClient = useQueryClient();

    const { mutateAsync } = useDeleteDoctorSchedule({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetAllDoctorSchedulesQueryKey(),
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
            { field: 'scheduleId', headerName: 'ID', width: 150 },
            {
                field: 'doctor',
                headerName: 'Bác sĩ',
                width: 150,
                valueGetter: (params: Doctor) => {
                    console.log(params);
                    return params?.name;
                },
            },
            {
                field: 'dayOfWeek',
                headerName: 'Ngày trong tuần',
                width: 150,
                valueGetter: (params: number) => {
                    return params == 0 ? 'Chủ nhật' : `Thứ ${params! + 1}`;
                },
            },
            { field: 'startTime', headerName: 'Giờ bắt đầu', width: 150 ,
            valueGetter: (params: string) => {
                const time =dayjs(dayjs().format('YYYY-MM-DD') + ' ' + params);
                return `${time.get('hour')} giờ ${time.get('minute')==0?'':time.get('minute')}  ` ;
            }


            },
            { field: 'endTime', headerName: 'Giờ kết thúc', width: 150 ,
            valueGetter: (params: string) => {
                const time =dayjs(dayjs().format('YYYY-MM-DD') + ' ' + params);
                return `${time.get('hour')} Giờ ${time.get('minute')==0?'':time.get('minute')}  ` ;
            }
            },
            {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: (params: GridRowParams<DoctorSchedule>) => {
                    const id = params.row.scheduleId as number;
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
                                        Bạn có chắc chắn muốn xóa lịch <b>#{params.row.scheduleId}</b> không?
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
                    field: filter.SortBy || 'scheduleId',
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
