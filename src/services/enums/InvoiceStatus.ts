
export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
    OVERDUE = 'OVERDUE',
}

export const InvoiceStatusLabels = {
    [InvoiceStatus.PENDING]: 'Chờ thanh toán',
    [InvoiceStatus.PAID]: 'Đã thanh toán',
    [InvoiceStatus.CANCELLED]: 'Đã hủy',
};