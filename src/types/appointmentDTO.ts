/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Hopital Management System Api
 * OpenAPI spec version: v1
 */
import type { DiagnosisDTO } from './diagnosisDTO';
import type { DoctorDTO } from './doctorDTO';
import type { InvoiceDTO } from './invoiceDTO';
import type { PatientDTO } from './patientDTO';

export interface AppointmentDTO {
    appointmentDate?: string;
    appointmentId?: number;
    appointmentTime?: string;
    /** @nullable */
    createdAt?: string | null;
    /** @nullable */
    diagnoses?: DiagnosisDTO[] | null;
    doctor?: DoctorDTO;
    doctorId?: number;
    /** @nullable */
    invoices?: InvoiceDTO[] | null;
    patient?: PatientDTO;
    patientId?: number;
    /** @nullable */
    status?: string | null;
}