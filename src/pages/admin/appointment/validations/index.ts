import z from 'zod'
import { mustBeDayjs, mustBeNumber } from '@/utils/form-utils'
// appointmentDate?: string;
// appointmentId?: number;
// appointmentTime?: string;
// /** @nullable */
// createdAt?: string | null;
// doctor?: DoctorDTO;
// doctorId?: number;
// patient?: PatientDTO;
// patientId?: number;
// /** @nullable */
// status?: string | null;
export const AppointmentSchema = z.object({
    appointmentDate: mustBeDayjs('Ngày hẹn'),
    doctorId: mustBeNumber('Bác sĩ'),
    patientId: mustBeNumber('Bệnh nhân'),
})

export type Appointment = z.infer<typeof AppointmentSchema>
