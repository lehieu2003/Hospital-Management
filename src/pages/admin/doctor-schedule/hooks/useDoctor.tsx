// import { doctorsClient } from '@/services/mock';
// import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useDialogs, useNotifications } from '@toolpad/core';
// import React from 'react';
// import { Doctor } from '@/services/api-client';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ViewIcon from '@mui/icons-material/Visibility';
// import UpdateModal from '../components/update-modal';
// export default function useDoctor() {
//     const { data, isLoading } = useQuery({
//         queryKey: ['doctors'],
//         queryFn: () => doctorsClient.doctorsAll(),
//         select: (data) => data
//     })
//     const { show } = useNotifications()
//     const queryClient = useQueryClient()

//     const { mutateAsync } = useMutation({
//         mutationFn: (id: number) => {
//             return doctorsClient.doctorsDELETE(id)
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ['doctors']
//             })
//             show('Xóa bác sĩ thành công', {
//                 autoHideDuration: 3000,
//                 severity: 'success',
//             })
//         },
//     })

//     const dialogs = useDialogs();
//     const handleEdit = (id: number) => {
//         dialogs.open(UpdateModal, id);
//     }
//     // doctorId?: number;
//     // name?: string | undefined;
//     // specialization?: string | undefined;
//     // phoneNumber?: string | undefined;
//     // email?: string | undefined;
//     // departmentId?: number | undefined;
//     // userId?: string | undefined;
//     // appointments?: Appointment[] | undefined;
//     // department?: Department;
//     // doctorSchedules?: DoctorSchedule[] | undefined;
//     // user?: IdentityUser;
//     const columns: GridColDef[] = React.useMemo(() => {
//         return [
//             { field: 'doctorSheduleId', headerName: 'Mã lịch khám', width: 150 },
//             { field: 'name', headerName: 'Tên bác sĩ', flex: 1 },
//             { field: 'dayOfWeek', headerName: 'Số ngày làm việc', width: 150 },
//             { field: 'startTime', headerName: 'Bắt đầu', width: 150 },
//             { field: 'endTime', headerName: 'Kết thúc', width: 150 },
//             {
//                 field: 'actions',
//                 type: 'actions',
//                 width: 100,
//                 getActions: (params: GridRowParams<Doctor>) => {
//                     const id = params.row.doctorId as number;
//                     return [
//                         <GridActionsCellItem showInMenu icon={<ViewIcon />} label="Xem" onClick={() => { }} />,
//                         <GridActionsCellItem sx={{
//                             width: '200px',
//                         }} showInMenu icon={<EditIcon />} label="Sửa" onClick={() => handleEdit(id)} />,
//                         <GridActionsCellItem showInMenu icon={<DeleteIcon />} label="Xóa" onClick={() => {
//                             dialogs.confirm(
//                                 <>
//                                     Bạn có chắc chắn muốn xóa bác sĩ <b>{params.row.name}</b> không?
//                                 </>,
//                                 {
//                                     cancelText: "Hủy",
//                                     okText: "Xóa",
//                                     severity: "error",
//                                     title: "Xác nhận xóa",
//                                     async onClose(result) {
//                                         if (result) {
//                                             await mutateAsync(id)
//                                         }
//                                     },
//                                 })
//                         }} />,
//                     ]
//                 },

//             }
//         ];
//     }, []);
//     return {
//         table: {
//             columns,
//             data,
//             isLoading
//         }
//     }
// }
