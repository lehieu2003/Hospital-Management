import React from 'react';
import { TimePickerComponent as EJ2TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { Controller, UseFormReturn } from 'react-hook-form';

interface TimePickerProps {
    name: string; // Tên của field trong react-hook-form
    form?: UseFormReturn<any>; // react-hook-form instance, optional
    label?: string; // Nhãn hiển thị
    format?: string; // Định dạng thời gian (ví dụ: 'hh:mm a' hoặc 'HH:mm')
    step?: number; // Khoảng thời gian giữa các lần chọn (phút)
    placeholder?: string; // Placeholder cho TimePicker
    value?: string; // Giá trị khởi tạo khi dùng độc lập
    onChange?: (value: string) => void; // Hàm callback khi giá trị thay đổi
}

const TimePicker: React.FC<TimePickerProps> = ({
    name,
    form,
    label,
    format = 'HH:mm',
    step = 30,
    placeholder = 'Chọn thời gian',
    value,
    onChange,
}) => {
    const renderTimePicker = (fieldProps: any) => (
        <div style={{ marginBottom: '16px' }}>
            {label && <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>}
            <EJ2TimePickerComponent
                format={format}
                step={step}
                placeholder={placeholder}
                value={fieldProps?.value || value || ''}
                onChange={(e: { target: { value: any; }; }) => {
                    const selectedTime = e.target.value;
                    fieldProps?.onChange?.(selectedTime); // react-hook-form field handler
                    onChange?.(selectedTime); // External handler
                }}
                {...fieldProps} // Spread các props từ react-hook-form
            />
        </div>
    );

    if (form) {
        // Nếu sử dụng với react-hook-form
        return (
            <Controller
                name={name}
                control={form.control}
                render={({ field }) => renderTimePicker(field)}
            />
        );
    }

    // Nếu sử dụng độc lập
    return renderTimePicker({});
};

export default TimePicker;
