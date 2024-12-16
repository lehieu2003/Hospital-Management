import { Autocomplete, Box, Button, Popover, TextField, Typography } from '@mui/material';
import React, { useId } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Department, GetDoctorsParams } from '@/types';
import { useGetDepartments } from '@/services/api';
import MenuItem from '@mui/material/MenuItem';
interface FilterProps {
    setFilter: React.Dispatch<React.SetStateAction<GetDoctorsParams>>;
    filter: GetDoctorsParams;
}

export default function Filter({ setFilter, filter }: FilterProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { data } = useGetDepartments({
        PageSize: 100000,
    });
    const [values, setValues] = React.useState<Department[]>([]);
    const options = React.useMemo(() => {
        return data?.data.data?.map((option) => option) || [];
    }, [data]);

    React.useEffect(() => {
        if (filter['DepartmentId.In']) {
            const departments = data?.data.data?.filter((d) => filter['DepartmentId.In']?.includes(d.departmentId!));
            setValues(departments || []);
        }
    }, [filter['DepartmentId.In'], data]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setFilter(pre => ({
            ...pre,
            Page: 0,
            "DepartmentId.In": values.map(v => v.departmentId!)
        }))
    };
    const open = Boolean(anchorEl);
    const id = useId();
    const usedId = open ? id : undefined;
    return (
        <>
            <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleClick} aria-describedby={usedId}>
                Bộ lọc
            </Button>
            <Popover
                id={usedId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ padding: 3 }} display={'flex'} flexDirection={'column'} gap={2}>
                    <Typography variant="h6">Bộ lọc</Typography>
                    <Autocomplete<Department,true>
                        options={options}
                        sx={{ width: 300 }}
                        multiple
                        getOptionLabel={(option) => option.departmentName!}
                        getOptionKey={(option) => option.departmentId!}
                        renderInput={(params) => <TextField {...params} label="Chuyên khoa" />}
                        value={values}
                        renderOption={(props, option, { selected }) => (
                            <MenuItem {...props} selected={selected}>
                                {option.departmentName}
                            </MenuItem>
                        )}
                        onChange={(event: any, newValue: Department[]) => {
                            setValues(newValue);
                        }}
                    />
                    <Box display={'flex'} justifyContent={'flex-end'} gap={2}>
                        <Button
                            onClick={() => {
                                setValues([]);
                                handleClose();
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Áp dụng
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
}
