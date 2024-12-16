import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import Chart from 'react-apexcharts';
import { useGetDashboardData } from '@/services/api';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
const defaultLineChartOptions: ApexOptions = {
    chart: {
        type: 'line',
        toolbar: {
            show: false,
        },
    },
    colors: ['#1E90FF'],
    xaxis: {
        categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    },
    stroke: {
        curve: 'smooth',
    },
};
const defaultBarChartOptions: ApexOptions = {
    chart: {
        type: 'bar',
        toolbar: {
            show: false,
        },
    },
    colors: ['#FFA07A'],
    xaxis: {
        categories: [
            'Khoa nhi',
            'Khoa ngoại',
            'Khoa nội',
            'Khoa sản',
            'Khoa tim mạch',
            'Khoa da liễu',
            'Khoa nha khoa',
        ],
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: false,
        },
    },
};
const dowLabels = {
    Sunday: 'CN',
    Monday: 'T2',
    Tuesday: 'T3',
    Wednesday: 'T4',
    Thursday: 'T5',
    Friday: 'T6',
    Saturday: 'T7',
};
const Dashboard = () => {
    const { data, isLoading } = useGetDashboardData({
        query: {
            select(data) {
                const lineChartOptions: ApexOptions = {
                    chart: {
                        type: 'line',
                        toolbar: {
                            show: false,
                        },
                    },
                    colors: ['#1E90FF'],
                    xaxis: {
                        categories:
                            data.data.weeklyAppointments?.map(
                                (item) => dowLabels[item.dayOfWeek as keyof typeof dowLabels]
                            ) || [],
                        labels: {
                            show: true,
                        },
                    },
                    stroke: {
                        curve: 'smooth',
                    },
                };

                const barChartOptions: ApexOptions = {
                    chart: {
                        type: 'bar',
                        toolbar: {
                            show: false,
                        },
                    },
                    colors: ['#FFA07A'],
                    xaxis: {
                        categories: data.data.appointmentsByDepartment?.map((item) => item.departmentName) || [],
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: false,
                        },
                    },
                };
                return {
                    lineChartOptions,
                    barChartOptions,
                    appointmentsData: data.data.weeklyAppointments?.map((item) => item.count!) || [],
                    weeklyRevenue: data.data.weeklyRevenue?.map((item) => item.amount!) || [],
                    appointmentsByDepartment: data.data.appointmentsByDepartment?.map((item) => item.count!) || [],
                };
            },
        },
    });
    console.log(data?.lineChartOptions, data?.appointmentsData);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Appointment Dashboard
            </Typography>

            <Grid container spacing={4}>
                {/* Appointments Overview */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Thống kê lịch hẹn theo tuần
                            </Typography>
                            <Chart
                                options={data?.lineChartOptions || defaultLineChartOptions}
                                series={[{ name: 'Appointments', data: data?.appointmentsData || [] }]}
                                type="line"
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Revenue Overview */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Doanh thu theo tuần
                            </Typography>
                            <Chart
                                options={data?.lineChartOptions || defaultLineChartOptions}
                                series={[{ name: 'Revenue', data: data?.weeklyRevenue || [] }]}
                                type="line"
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Patient Types Overview */}
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Thống kê theo loại
                            </Typography>
                            <Chart
                                options={data?.barChartOptions || defaultBarChartOptions}
                                series={[{ name: 'Patients', data: data?.appointmentsByDepartment || [] }]}
                                type="bar"
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
