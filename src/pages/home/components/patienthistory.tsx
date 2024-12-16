import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import _ from 'lodash';
import { error } from 'console';
import { useUserProfile } from '@/stores/user-store';
import { useGetAppointments, useGetPatientAppointments } from '@/services/api';
import dayjs from 'dayjs';
import { AppointmentStatusLabels } from '@/services/enums/AppointmentStatus';

interface Appointment {
    appointmentId: number;
    date: string; // Ngày khám
    bookingTime: string; // Thời gian đặt
    department: string; // Chuyên khoa
    doctorName: string; // Bác sĩ
    status: string; // Trạng thái
    serviceUsed: string; // Dịch vụ sử dụng
    cost: number; // Chi phí
    recordDate: string; // Ngày lập hồ sơ
}

export default function PatientHistory() {
    const profile = useUserProfile();
    const { data: appointments, isLoading } = useGetPatientAppointments(
        profile?.patient?.patientId!,
        {
            Page: 1,
            PageSize: 1000,
        },
        {
            query: {
                enabled: !!profile?.patient?.patientId,
            },
        }
    );

    if (isLoading) {
        return <Typography className="container">Đang tải lịch sử khám...</Typography>;
    }

    if (appointments?.data.data?.length === 0) {
        return <Typography className="container">Không có lịch sử khám nào.</Typography>;
    }

    return (
        <Box sx={{ padding: 4, maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h4" mb={3}>
                Lịch sử khám bệnh
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 5 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Mã lịch hẹn</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Ngày khám</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Chuyên khoa</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Bác sĩ</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Ghi chú của bác sĩ</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Chi phí</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Ngày lập hồ sơ</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Trạng thái</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments?.data.data?.map((appointment) => (
                            <TableRow key={appointment.appointmentId}>
                                <TableCell>{appointment.appointmentId}</TableCell>
                                <TableCell>
                                    {dayjs(appointment.appointmentDate).format('dddd, DD/MM/YYYY, HH:mm')}
                                </TableCell>
                                <TableCell>{appointment?.doctor?.department?.departmentName}</TableCell>
                                <TableCell>{appointment?.doctor?.name}</TableCell>

                                <TableCell>{appointment?.diagnoses?.[0]?.notes}</TableCell>
                                <TableCell>{appointment?.invoices?.[0]?.totalAmount}</TableCell>
                                <TableCell>
                                    {appointment?.diagnoses?.[0]?.diagnosisDate &&
                                        dayjs(appointment?.diagnoses?.[0]?.diagnosisDate).format(
                                            'dddd, DD/MM/YYYY, HH:mm'
                                        )}
                                </TableCell>
                                <TableCell>
                                    {
                                        AppointmentStatusLabels[
                                            appointment?.status as keyof typeof AppointmentStatusLabels
                                        ]
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
