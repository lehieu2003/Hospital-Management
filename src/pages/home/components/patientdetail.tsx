import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../components/context/usercontext';
import { useUserProfile } from '@/stores/user-store';
import { usePutPatient } from '@/services/api';

interface Patient {
    patientId: string;
    name: string;
    dateOfBirth: string;
    phoneNumber?: string;
    email?: string;
    gender?: string;
    healthInsurance?: string;
}

export default function PatientDetail() {
    const location = useLocation();
    const { patientId } = useParams<{ patientId: string }>();
    const { mutateAsync: putPatient } = usePutPatient();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const profile = useUserProfile();

    const [errors, setErrors] = useState({
        name: false,
        dateOfBirth: false,
        phoneNumber: false,
        email: false,
        gender: false,
        healthInsurance: false,
    });

    const validateForm = () => {
        const newErrors = {
            name: !patient?.name,
            dateOfBirth: !patient?.dateOfBirth,
            phoneNumber: !patient?.phoneNumber,
            email: !patient?.email,
            gender: !patient?.gender,
            healthInsurance: !patient?.healthInsurance,
        };
        setErrors(newErrors);

        return !Object.values(newErrors).includes(true);
    };

    useEffect(() => {
        console.log(profile);

        const mockPatient: Patient = {
            patientId: profile?.id ? profile.id.toString() : '',
            name: profile?.patient?.name || '',
            dateOfBirth: profile?.patient?.dateOfBirth || '',
            phoneNumber: profile?.patient?.phoneNumber || '',
            email: profile?.patient?.email || '',
            gender: profile?.patient?.gender || '',
            healthInsurance: profile?.patient?.healthInsurance || '',
        };

        setPatient(mockPatient);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPatient((prev) => prev && { ...prev, [name]: value });
    };

    const handleUpdate = () => {
        if (!validateForm()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        putPatient({
            data: {
                dateOfBirth: patient?.dateOfBirth,
                email: patient?.email,
                gender: patient?.gender,
                healthInsurance: patient?.healthInsurance,
                phoneNumber: patient?.phoneNumber,
                patientId: Number(patientId || 0) || 0,
                name: patient?.name,
            },
            id: Number(patientId || 0) || 0,
        })
            .then(() => {
                alert('Cập nhật thành công!');
                setIsEditing(false);
            })
            .catch((err) => console.error(err));
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setPatient((prev) => prev && { ...prev, gender: value });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;

        setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    };

    if (!patient) return <Typography>Đang tải thông tin...</Typography>;

    return (
        <div className="container mt-4" style={{ maxWidth: '600px' }}>
            <h4 className="mb-3 mt-2">Thông tin bệnh nhân</h4>
            <form>
                <div className="row g-3">
                    {/* Họ và tên */}
                    <div className="col-12">
                        <label htmlFor="name" className={`form-label ${errors.name ? 'text-danger fw-bold' : ''}`}>
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'border-danger border-2' : ''}`}
                            id="name"
                            name="name"
                            value={patient.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            onFocus={handleFocus}
                        />
                    </div>

                    {/* Ngày sinh */}
                    <div className="col-12">
                        <label
                            htmlFor="dateOfBirth"
                            className={`form-label ${errors.dateOfBirth ? 'text-danger fw-bold' : ''}`}
                        >
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            className={`form-control ${errors.dateOfBirth ? 'border-danger border-2' : ''}`}
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={patient.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            onFocus={handleFocus}
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div className="col-12">
                        <label
                            htmlFor="phoneNumber"
                            className={`form-label ${errors.phoneNumber ? 'text-danger fw-bold' : ''}`}
                        >
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.phoneNumber ? 'border-danger border-2' : ''}`}
                            id="phoneNumber"
                            name="phoneNumber"
                            value={patient.phoneNumber || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            onFocus={handleFocus}
                        />
                    </div>

                    {/* Email */}
                    <div className="col-12">
                        <label htmlFor="email" className={`form-label ${errors.email ? 'text-danger fw-bold' : ''}`}>
                            Email
                        </label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'border-danger border-2' : ''}`}
                            id="email"
                            name="email"
                            value={patient.email || ''}
                            onChange={handleInputChange}
                            disabled
                            onFocus={handleFocus}
                            required
                        />
                    </div>

                    {/* Giới tính */}
                    <div className="col-md-4 form-group mt-3">
                        <label htmlFor="gender" className={`form-label ${errors.gender ? 'text-danger fw-bold' : ''}`}>
                            Giới tính
                        </label>
                        <select
                            name="gender"
                            id="gender"
                            className="form-select"
                            required
                            value={patient.gender}
                            onChange={handleGenderChange}
                            disabled={!isEditing}
                            onFocus={handleFocus}
                        >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                        </select>
                    </div>

                    {/* Bảo hiểm y tế */}
                    <div className="col-12">
                        <label
                            htmlFor="healthInsurance"
                            className={`form-label ${errors.healthInsurance ? 'text-danger fw-bold' : ''}`}
                        >
                            Bảo hiểm y tế
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.healthInsurance ? 'border-danger border-2' : ''}`}
                            id="healthInsurance"
                            name="healthInsurance"
                            value={patient.healthInsurance || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            onFocus={handleFocus}
                        />
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="d-flex justify-content-between mt-4 mb-3">
                    {isEditing ? (
                        <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                            Cập nhật thông tin
                        </button>
                    ) : (
                        <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                            Chỉnh sửa thông tin
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
