export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    CONFIRMED = 'CONFIRMED',
    CHECKED_IN = 'CHECKED_IN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
}

export const AppointmentStatusLabels = {
    [AppointmentStatus.SCHEDULED]: 'Đã đặt lịch',
    [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
    [AppointmentStatus.CHECKED_IN]: 'Đã check-in',
    [AppointmentStatus.IN_PROGRESS]: 'Đang khám',
    [AppointmentStatus.COMPLETED]: 'Đã hoàn thành',
    [AppointmentStatus.CANCELLED]: 'Đã hủy',
    [AppointmentStatus.NO_SHOW]: 'Không đến',
};