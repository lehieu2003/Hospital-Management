import {
    GridActionsCellItem,
    GridCallbackDetails,
    GridColDef,
    GridFilterModel,
    GridPaginationModel,
    GridRowParams,
    GridSortModel,
} from '@mui/x-data-grid';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useDialogs, useNotifications } from '@toolpad/core';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import UpdateModal from '../components/update-modal';
import {
    getGetAppointmentsQueryKey,
    useDeleteAppointment,
    useGetAppointments,
    useUpdateAppointmentStatus,
} from '@/services/api';
import { Appointment, GetAppointmentsParams } from '@/types';
import { camelCaseToPascalCase } from '@/utils/string-utils';
import dayjs from 'dayjs';
import CreateModal from '../../diagnosis/components/create-modal';
import DetailModal from '../components/detail-modal';
import { AppointmentStatus, AppointmentStatusLabels } from '@/services/enums/AppointmentStatus';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
export default function useAppointmentTable() {
    const [filter, setFilter] = React.useState<GetAppointmentsParams>({
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

    const { data, isLoading } = useGetAppointments(
        {
            ...filter,
            Page: filter.Page! + 1,
            SortBy: camelCaseToPascalCase(filter.SortBy || 'appointmentId'),
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    );
    const { show } = useNotifications();
    const queryClient = useQueryClient();
    const { mutateAsync } = useDeleteAppointment({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetAppointmentsQueryKey(),
                });
                show('Xóa lịch hẹn thành công', {
                    autoHideDuration: 3000,
                    severity: 'success',
                });
            },
        },
    });
    const { mutateAsync: updateAppointmentStatus } = useUpdateAppointmentStatus();

    const dialogs = useDialogs();
    const handleEdit = (id: number) => {
        dialogs.open(UpdateModal, id);
    };
    const handleDiagnosis = (id: number) => {
        dialogs.open(CreateModal.FromDialog, { initAppointmentId: id });
    };
    const handleUpdateStatus = async (id: number, status: AppointmentStatus) => {
        await updateAppointmentStatus({
            id,
            data: {
                status,
            },
        });
        queryClient.invalidateQueries({
            queryKey: getGetAppointmentsQueryKey(),
        });
        show('Cập nhật trạng thái lịch hẹn thành công', {
            autoHideDuration: 3000,
            severity: 'success',
        });
    };

    const columns: GridColDef[] = React.useMemo(() => {
        return [
            { field: 'appointmentId', headerName: 'Mã lịch hẹn', width: 100 },
            {
                field: 'patient',
                headerName: 'Bệnh nhân',
                width: 150,
                valueGetter: (_, record: Appointment) => record?.patient?.name,
            },
            {
                field: 'appointmentDate',
                headerName: 'Hẹn lúc',
                width: 200,
                valueGetter: (_, record: Appointment) => dayjs(record.appointmentDate).format('dddd, DD/MM/YYYY HH:mm'),
            },
            {
                field: 'phoneNumber',
                headerName: 'Số điện thoại',
                width: 150,
                valueGetter: (_, record: Appointment) => record?.patient?.phoneNumber,
            },
            {
                field: 'doctor',
                headerName: 'Bác sĩ',
                width: 150,
                valueGetter: (_, record: Appointment) => record?.doctor?.name,
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                width: 150,
                valueGetter: (_, record: Appointment) => {
                    return (
                        AppointmentStatusLabels[record.status as keyof typeof AppointmentStatusLabels] ||
                        'Không xác định'
                    );
                },
            },
            {
                field: 'actions',
                type: 'actions',
                width: 100,
                getActions: (params: GridRowParams<Appointment>) => {
                    const id = params.row.appointmentId as number;
                    const status = params.row.status as AppointmentStatus;
                    const changeStatusActions = [];
                    const isScheduled = Object.values(AppointmentStatus).includes(status);
                    if (!isScheduled) {
                        changeStatusActions.push({
                            icon: <ChangeCircleIcon />,
                            label: 'Đã đặt',
                            onClick: () => handleUpdateStatus(id, AppointmentStatus.SCHEDULED),
                        });
                    }
                    if (status === AppointmentStatus.SCHEDULED) {
                        changeStatusActions.push({
                            icon: <ChangeCircleIcon />,
                            label: 'Check-in',
                            onClick: () => handleUpdateStatus(id, AppointmentStatus.CHECKED_IN),
                        });
                    }
                    if (status === AppointmentStatus.CHECKED_IN) {
                        changeStatusActions.push({
                            icon: <ChangeCircleIcon />,
                            label: 'Khám',
                            onClick: () => handleUpdateStatus(id, AppointmentStatus.IN_PROGRESS),
                        });
                    }
                    if (status === AppointmentStatus.IN_PROGRESS) {
                        changeStatusActions.push({
                            icon: <ChangeCircleIcon />,
                            label: 'Hoàn thành',
                            onClick: () => handleUpdateStatus(id, AppointmentStatus.COMPLETED),
                        });
                    }
                    if (status === AppointmentStatus.SCHEDULED) {
                        changeStatusActions.push({
                            icon: <ChangeCircleIcon />,
                            label: 'Xác nhận',
                            onClick: () => handleUpdateStatus(id, AppointmentStatus.CONFIRMED),
                        });
                    }
                    if (status === AppointmentStatus.CONFIRMED) {
                        changeStatusActions.push({
                            icon: <ChangeCircleIcon />,
                            label: 'Check-in',
                            onClick: () => handleUpdateStatus(id, AppointmentStatus.CHECKED_IN),
                        });
                    }
                    if (status === AppointmentStatus.SCHEDULED) {
                        changeStatusActions.push({
                            icon: <ChangeCircleIcon />,
                            label: 'Hủy',
                            onClick: () => handleUpdateStatus(id, AppointmentStatus.CANCELLED),
                        });
                    }
                    if (status === AppointmentStatus.SCHEDULED) {
                        changeStatusActions.push({
                            icon: <ChangeCircleIcon />,
                            label: 'Không đến',
                            onClick: () => handleUpdateStatus(id, AppointmentStatus.NO_SHOW),
                        });
                    }

                    return [
                        <GridActionsCellItem
                            showInMenu
                            icon={<ViewIcon />}
                            label="Xem"
                            onClick={() => {
                                dialogs.open(DetailModal, id);
                            }}
                        />,
                        ...changeStatusActions.map((action) => (
                            <GridActionsCellItem
                                showInMenu
                                icon={action.icon}
                                label={action.label}
                                onClick={action.onClick}
                            />
                        )),
                        <GridActionsCellItem
                            sx={{
                                width: '200px',
                            }}
                            showInMenu
                            hidden={
                                status === AppointmentStatus.COMPLETED ||
                                status === AppointmentStatus.CANCELLED ||
                                status === AppointmentStatus.NO_SHOW
                            }
                            icon={<EditIcon />}
                            label="Sửa"
                            onClick={() => handleEdit(id)}
                        />,
                        <GridActionsCellItem
                            sx={{
                                width: '200px',
                            }}
                            showInMenu
                            hidden={status !== AppointmentStatus.IN_PROGRESS}
                            icon={<MonitorWeightIcon />}
                            label="Chuẩn đoán"
                            onClick={() => handleDiagnosis(id)}
                        />,
                        <GridActionsCellItem
                            showInMenu
                            icon={<DeleteIcon />}
                            label="Xóa"
                            hidden={
                                status === AppointmentStatus.COMPLETED ||
                                status === AppointmentStatus.CHECKED_IN ||
                                status === AppointmentStatus.IN_PROGRESS ||
                                status === AppointmentStatus.CONFIRMED
                            }
                            onClick={() => {
                                dialogs.confirm(
                                    <>
                                        Bạn có chắc chắn muốn xóa lịch hẹn <b>{params.row.appointmentId}</b> không?
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
                    field: filter.SortBy || 'createdAt',
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
