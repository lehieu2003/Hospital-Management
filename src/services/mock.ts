import { Department, DepartmentsClient, Doctor, DoctorRegistration, DoctorsClient, DoctorSchedule, DoctorSchedulesClient} from "./api-client";
import { faker } from '@faker-js/faker/locale/vi';
import dayjs from "dayjs";
import _, { reject } from 'lodash';
import { resolve } from "path";
import { scheduler } from "timers/promises";


type MethodOnly<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};


interface Store {
    departments: Department[];
    doctors: Doctor[];
    schedules: DoctorSchedule[]
}



function createDepartment(): Department {
    return {
        departmentId: faker.number.int({ min: 1, max: 1000000 }),
        departmentName: faker.company.name(),
        description: faker.lorem.paragraph({
            min: 1,
            max: 2
        })
    };
}

function createDoctor(): Doctor {
    return {
        doctorId: faker.number.int({ min: 1, max: 1000000 }),
        departmentId: faker.number.int({ min: 1, max: 1000000 }),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        specialization: faker.lorem.paragraph({
            min: 1,
            max: 4
        }),
        phoneNumber: "03"+faker.string.numeric({ length: 8 }),
    };
}


const store: Store = {
    departments: Array.from({ length: 5 }, createDepartment),
    doctors: Array.from({ length: 5 }, createDoctor),
    schedules: []
};











export const departmentsClient: MethodOnly<DepartmentsClient> = {
    departmentsAll: function (signal?: AbortSignal): Promise<Department[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(store.departments);
            }, 1000);
        });
    },
    departmentsPOST: function (body: Department | undefined, signal?: AbortSignal): Promise<Department> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const newDepartment = {
                    ...body,
                    departmentId: faker.number.int({ min: 1, max: 100000 })
                };
                // add to first
                store.departments = [newDepartment, ...store.departments];
                resolve(newDepartment);
            }, 1000);
        });
    },
    departmentsGET: function (id: number, signal?: AbortSignal): Promise<Department> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const department = store.departments.find(d => d.departmentId === id);
                if (department) {
                    resolve(department);
                } else {
                    reject(new Error("Not found"));
                }
            }, 1000);
        });
    },
    departmentsPUT: function (id: number, body: Department | undefined, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = store.departments.findIndex(d => d.departmentId === id);
                if (index !== -1) {
                    store.departments=[...store.departments];
                    store.departments[index] = {
                        ...store.departments[index],
                        ...body
                    };
                    resolve();
                } else {
                    reject(new Error("Not found"));
                }
            }, 1000);
        });
    },
    departmentsDELETE: function (id: number, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                store.departments = store.departments.filter(d => d.departmentId !== id);
                resolve();
            }, 1000);
        })
    }
};


export const doctorsClient: MethodOnly<DoctorsClient> = {
    doctorsAll: function (signal?: AbortSignal): Promise<Doctor[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // join with department
                const doctors = _.map(store.doctors, (doctor) => {
                    const department = _.find(store.departments, d => d.departmentId === doctor.departmentId) || store.departments[0];
                    return {
                        ...doctor,
                        department
                    }
                }
                );
                resolve(doctors);
            }, 1000);
        });
    },
    doctorsPOST: function (body: Doctor | undefined, signal?: AbortSignal): Promise<Doctor> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const newDoctor = {
                    ...body,
                    doctorId: faker.number.int({ min: 1, max: 100000 })
                };
                // add to first
                store.doctors = [newDoctor, ...store.doctors];
                resolve(newDoctor);
            }, 1000);
        });
    },
    doctorsGET: function (id: number, signal?: AbortSignal): Promise<Doctor> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const doctor = store.doctors.find(d => d.doctorId === id);
                if (doctor) {
                    const department = store.departments.find(d => d.departmentId === doctor.departmentId) || store.departments[0];
                    doctor.department = department;
                    resolve(doctor);
                } else {
                    reject(new Error("Not found"));
                }
            }, 1000);
        });
    },
    doctorsPUT: function (id: number, body: Doctor | undefined, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = store.doctors.findIndex(d => d.doctorId === id);
                if (index !== -1) {
                    store.doctors[index] = {
                        ...store.doctors[index],
                        ...body
                    };
                    resolve();
                } else {
                    reject(new Error("Not found"));
                }
            }, 1000);

        }
        );
    },
    doctorsDELETE: function (id: number, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = store.doctors.findIndex(d => d.doctorId === id);
                if (index !== -1) {
                    store.doctors.splice(index, 1);
                    resolve();
                } else {
                    reject(new Error("Not found"));
                }
            }, 1000);
        });
    },
    doctorregister: function (body: DoctorRegistration | undefined, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const newDoctor: Doctor = {
                    ...body,
                    doctorId: faker.number.int({ min: 1, max: 100000 })
                };
                // add to first
                store.doctors = [newDoctor, ...store.doctors];
                resolve();
            }, 1000);
        });
    }
}

// 
function createDoctorSchedule(doctorId: number): DoctorSchedule {
    const randomDayOfWeek = faker.number.int({ min: 0, max: 7 });
    const startTime = dayjs().hour(faker.number.int({ min: 8, max: 11 })).minute(0);
    const endTime = startTime.add(faker.number.int({ min: 1, max: 7 }), 'hour');
    return {
        scheduleId: faker.number.int({ min: 1, max: 1000000 }),
        doctorId,
        dayOfWeek: randomDayOfWeek,
        startTime,
        endTime
    };
}

// 
store.doctors.forEach((doctor) => {
    const numSchedules = faker.number.int({ min: 1, max: 10 });
    const schedules = Array.from({ length: numSchedules }, () => createDoctorSchedule(doctor.doctorId!));
    store.schedules.push(...schedules);
});

export const doctorScheduleClient: MethodOnly<DoctorSchedulesClient> = {
    doctorSchedulesAll: function (signal?: AbortSignal): Promise<DoctorSchedule[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const schedules = _.map(store.schedules, (schedule) => {
                    const doctor = _.find(store.doctors, (d) => d.doctorId === schedule.doctorId) || store.doctors[0];
                    return {
                        ...schedule,
                        doctor,
                    }
                });
                resolve(schedules);
            }, 1000);
        });
    },
    doctorSchedulesPOST: function (body: DoctorSchedule | undefined, signal?: AbortSignal): Promise<DoctorSchedule> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSchedule = {
                    ...body,
                    scheduleId: faker.number.int({ min: 1, max: 100000 }),
                };
                store.schedules = [newSchedule, ...store.schedules];
                resolve(newSchedule);
            }, 1000);
        });
    },
    doctorSchedulesGET: function (id: number, signal?: AbortSignal): Promise<DoctorSchedule> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const schedule = store.schedules.find((s) => s.scheduleId === id);
                if (schedule) {
                    const doctor = store.doctors.find((d) => d.doctorId === schedule.doctorId) || store.doctors[0];
                    schedule.doctor = doctor;
                    resolve(schedule);
                } else {
                    reject(new Error("Not found"));
                }
            }, 1000);
        });
    },
    doctorSchedulesPUT: function (id: number, body: DoctorSchedule | undefined, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = store.schedules.findIndex((s) => s.scheduleId === id);
                if (index != 1) {
                    store.schedules[index] = {
                        ...store.schedules[index],
                        ...body,
                    };
                    resolve();
                } else {
                    reject(new Error("Not found"));
                }
            }, 1000);
        })       
    },
    doctorSchedulesDELETE: function (id: number, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = store.schedules.findIndex((s) => s.scheduleId === id);
                if (index !== -1) {
                    store.schedules.splice(index, 1);
                    resolve();
                } else {
                    reject(new Error("Not found"));
                }
            }, 1000);
        });
    },
    doctorSchedule: function (doctorId: number, signal?: AbortSignal): Promise<DoctorSchedule[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const schedules = store.schedules.filter(schedule => schedule.doctorId === doctorId);

                if (schedules.length > 0) {
                    resolve(schedules);
                } else {
                    reject(new Error("no schedules found for this doctor"));
                }
            }, 1000);
        })
    }
}