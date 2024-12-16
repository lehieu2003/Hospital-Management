import React, { useId } from "react";
import {
    Autocomplete,
    Box,
    Button,
    MenuItem,
    Popover,
    Slider,
    TextField,
    Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useGetInvoices, useGetPatients } from "@/services/api";
import { GetInvoicesParams, Invoice, Patient } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers";
import { removeDotObject } from "@/utils/form-utils";

interface FilterProps {
    setFilter: React.Dispatch<React.SetStateAction<GetInvoicesParams>>;
    filter: GetInvoicesParams;
}

export default function Filter({ setFilter, filter }: FilterProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = useId();
    const usedId = open ? id : undefined;

    const { control, reset, handleSubmit } = useForm<GetInvoicesParams>({
        defaultValues: { ...filter },
    });

    const { data: patients } = useGetPatients({
        PageSize: 10000,
    });

    const patientOptions = React.useMemo(() => {
        return patients?.data.data?.map((option) => option) || [];
    }, [patients]);

    const { data: invoicesData } = useGetInvoices({
        ...filter,
        Page: 1,
        PageSize: 10000,
    });

    const [priceRange, setPriceRange] = React.useState<number[]>([0, 54990000]);

    const minMaxPrice = React.useMemo(() => {
        if (!invoicesData?.data?.data || invoicesData.data.data.length === 0) {
            return [0, 54990000];
        }

        const prices = invoicesData.data.data
            .map((invoice: Invoice) => invoice.totalAmount)
            .filter((amount): amount is number => amount !== undefined);

        if (prices.length === 0) {
            return [0, 54990000];
        }

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Cập nhật giá trị mặc định của thanh trượt
        setPriceRange([minPrice, maxPrice]);

        return [minPrice, maxPrice];
    }, [invoicesData]);


    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setPriceRange(newValue);
        }
    };

    const onReset = () => {
        reset(
            {},
            {
                keepValues: false,
            }
        );
        setFilter({
            Page: 0,
            PageSize: 10,
        });
        handleClose();
    };

    const [invoiceDateTime, serInvoiceDateTime] = React.useState<Date | null>(null);

    const onSubmit = (data: any) => {
        // Gộp giá trị bộ lọc từ các trường
        const updatedFilter = {
            ...filter,
            "PatientId.Equal": data["PatientId.Equal"],
            "InvoiceDate.GreaterThanOrEqual": data["InvoiceDate.GreaterThanOrEqual"],
            "TotalAmount.GreaterThanOrEqual": priceRange[0],
            "TotalAmount.LessThanOrEqual": priceRange[1],
        };

        // Gọi API hoặc cập nhật bộ lọc
        setFilter(updatedFilter);
        handleClose(); // Đóng Popover sau khi áp dụng
    };


    return (
        <>
            <Button
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={handleClick}
                aria-describedby={usedId}
            >
                Bộ lọc
            </Button>
            <Popover
                id={usedId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Box
                    component={"form"}
                    sx={{ padding: 3 }}
                    display={"flex"}
                    onSubmit={handleSubmit(onSubmit)}
                    flexDirection={"column"}
                    gap={2}
                >
                    <Typography variant="h6">Bộ lọc</Typography>
                    <Controller
                        control={control}
                        name="PatientId.Equal"
                        render={({ field }) => (
                            <Autocomplete<Patient, false>
                                options={patientOptions}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => option.name!}
                                renderInput={(params) => <TextField {...params} label="Bệnh nhân" />}
                                value={patientOptions.find(
                                    (d) => d.patientId === field.value
                                ) || null}
                                renderOption={(props, option, { selected }) => (
                                    <MenuItem {...props} selected={selected}>
                                        {option.name}
                                    </MenuItem>
                                )}
                                onChange={(event: any, newValue: Patient | null) => {
                                    field.onChange(newValue?.patientId ?? undefined);
                                }}
                            />
                        )}
                    ></Controller>
                    <Controller
                        control={control}
                        name="InvoiceDate.GreaterThanOrEqual"
                        render={({ field: { onChange, value, ...field } }) => (
                            <DateTimePicker
                                label="Ngày lập hóa đơn từ"
                                value={value || null}
                                onChange={(newValue) => {
                                    onChange(newValue);
                                    serInvoiceDateTime(newValue);
                                }}
                                {...field}
                            />
                        )}
                    ></Controller>
                    <Box
                        sx={{
                            padding: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            border: "1px solid #c4c4c4",
                            borderRadius: 2,
                        }}
                    >
                        <Typography id="price-range-slider" gutterBottom>
                            Tổng tiền
                        </Typography>
                        <Slider
                            value={priceRange} // Giá trị hiện tại
                            onChange={(e, newValue) => setPriceRange(newValue as number[])} // Cập nhật giá trị
                            valueLabelDisplay="on"
                            min={minMaxPrice[0]} // Giá trị nhỏ nhất cố định
                            max={minMaxPrice[1]} // Giá trị lớn nhất cố định
                            step={1000000}
                            sx={{ color: "#00ab55" }}
                        />
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={{ marginTop: 1 }}
                        >
                            <Typography>{minMaxPrice[0]}đ</Typography>
                            <Typography>{minMaxPrice[1]}đ</Typography>
                        </Box>
                    </Box>

                    <Box display={"flex"} justifyContent="flex-end" gap={2} sx={{ marginTop: 3 }}>
                        <Button onClick={onReset}>Xóa bộ lọc</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Áp dụng
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
}
