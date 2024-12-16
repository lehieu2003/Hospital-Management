import { useGetDepartments, useGetFreeDoctors, useMakeAppointment } from '@/services/api';
import { useUserProfile } from '@/stores/user-store';
import { Autocomplete, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React from 'react';
import { Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';

interface FormData {
    name: string;
    email: string;
    phone: string;
    date: string;
    department: string;
    doctor: string;
    message: string;
}

const Appointment: React.FC = () => {
    const { register, watch, handleSubmit, control ,setValue} = useForm();
    const { data: departments } = useGetDepartments({
        Page: 1,
        PageSize: 10000,
    });
    const canSelectDoctor = !!watch('date') && !!watch('departmentId');
    const profile = useUserProfile();
    React.useEffect(() => {
        setValue('name', profile?.patient?.name);
        setValue('email', profile?.email);
        setValue('phone', profile?.phoneNumber);

    }, [profile]);
    const { data: doctors, isLoading: loadingDoctors } = useGetFreeDoctors(
        {
            AppointmentDate: dayjs(watch('date')).add(7, 'hour').toISOString(),
            DepartmentId: watch('departmentId'),
        },
        {
            query: {
                enabled: canSelectDoctor,
            },
        }
    );
    console.log(canSelectDoctor, doctors?.data);
    const { mutateAsync, isPending: isMakingAppointment, error, isSuccess } = useMakeAppointment();
    const onSubmit = async (formData: any) => {
        try {
            await mutateAsync({
                data: {
                    appointmentDate: dayjs(formData.date).add(7, 'hour').toISOString(),
                    doctorId: Number(formData.doctorId),
                    email: formData.email,
                    phoneNumber: formData.phone,
                    patientId: profile?.patient?.patientId,
                    name: formData.name,
                },
            });
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <section id="appointment" className="appointment section">
            <div className="container section-title" data-aos="fade-up">
                <h2>Đặt lịch hẹn</h2>
                <p>
                    {' '}
                    Để đặt lịch hẹn, vui lòng điền vào biểu mẫu dưới đây. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
                </p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <form className="php-email-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-md-4 form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Họ và tên"
                                required
                                readOnly={!!profile?.patient?.name}
                                {...register('name')}

                            />
                        </div>

                        <div className="col-md-4 form-group mt-3 mt-md-0">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Địa chỉ email"
                                required
                                readOnly={!!profile?.email}
                                {...register('email')}
                            />
                        </div>

                        <div className="col-md-4 form-group mt-3 mt-md-0">
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                placeholder="Số điện thoại"
                                readOnly={!!profile?.phoneNumber}
                                required
                                {...register('phone')}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 form-group mt-3">
                            <Controller
                                name="departmentId"
                                control={control}
                                render={({ field: { onBlur, onChange, value, ...rest } }) => {
                                    const selected =
                                        departments?.data.data?.find((item) => item.departmentId === value) || null;
                                    return (
                                        <Autocomplete
                                            sx={{
                                                width: '100%',
                                                border: 'var(--bs-border-width) solid var(--bs-border-color)',
                                            }}
                                            options={
                                                departments?.data.data?.map((option) => {
                                                    return {
                                                        value: option.departmentId,
                                                        label: option.departmentName,
                                                    };
                                                }) || []
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    sx={{
                                                        paddingTop: 0,
                                                        paddingBottom: 0,
                                                    }}
                                                    placeholder="Chuyên khoa"
                                                    variant="outlined"
                                                />
                                            )}
                                            onChange={(_, data) => {
                                                onChange(data?.value);
                                            }}
                                            onBlur={onBlur}
                                            value={{ value: selected?.departmentId, label: selected?.departmentName }}
                                            getOptionKey={(option) => option.value || ''}
                                            getOptionLabel={(option) => option.label || ''}
                                            {...rest}
                                        />
                                    );
                                }}
                            />
                        </div>
                        <div className="col-md-4 form-group mt-3">
                            <Controller
                                control={control}
                                name="date"
                                render={({ field: { value, onChange, ...rest } }) => (
                                    <DateTimePicker
                                        minDateTime={dayjs().add(1, 'day').startOf('date')}
                                        label="Ngày hẹn"
                                        dayOfWeekFormatter={(dayOfWeek) => dayOfWeek.format('dd')}
                                        sx={{
                                            width: '100%',
                                            border: 'var(--bs-border-width) solid var(--bs-border-color)',
                                        }}
                                        className=""
                                        value={value || undefined}
                                        onChange={(e) => onChange(e)}
                                        {...rest}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-md-4 form-group mt-3">
                            <Form.Select
                                aria-label="Default select example"
                                css={{ cursor: canSelectDoctor ? 'pointer' : 'not-allowed' }}
                                id="doctor"
                                className="form-select"
                                required
                                {...register('doctorId')}
                            >
                                <option value="">
                                    {loadingDoctors && 'Đang tải...'}
                                    {doctors?.data.length === 0 && 'Không có bác sĩ nào trống'}
                                    {!canSelectDoctor && 'Chọn khoa và ngày trước'}
                                    {doctors && doctors.data.length > 0 && 'Chọn bác sĩ'}
                                </option>
                                {doctors?.data?.map((doctor) => (
                                    <option key={doctor.doctorId} value={doctor.doctorId}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                    <div className="mt-3">
                        {isMakingAppointment && <div className="loading">Loading</div>}
                        {!!error?.response?.data && (
                            <div className="error-message">{error.response.data as string}</div>
                        )}
                        {isSuccess && (
                            <div className="sent-message">
                                Bạn đã đặt lịch thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
                            </div>
                        )}
                        <div className="text-center">
                            <button disabled={isMakingAppointment} type="submit">
                                Đặt lịch
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Appointment;
