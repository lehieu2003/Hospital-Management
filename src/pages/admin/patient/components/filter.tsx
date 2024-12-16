import { Autocomplete, Box, Button, Popover, TextField, Typography } from '@mui/material';
import React, { useId } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { GetPatientsParams } from '@/types';
import { useGetDepartments } from '@/services/api';
import MenuItem from '@mui/material/MenuItem';
import { Gender, GenderLabel } from '@/services/enums/gender';
interface FilterProps {
    setFilter: React.Dispatch<React.SetStateAction<GetPatientsParams>>;
    filter: GetPatientsParams;
}

export default function Filter({ setFilter, filter }: FilterProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { data } = useGetDepartments({
        PageSize: 100000,
    });
    const [values, setValues] = React.useState<string|Gender|undefined>();
    const options = React.useMemo(() => {
        return Object.values(Gender)
    }, []);

    React.useEffect(() => {
        if (filter['Gender.Equal']) {
            setValues(filter['Gender.Equal']);
        }
    }, [filter['Gender.Equal'], data]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setFilter(pre => ({
            ...pre,
            Page: 0,
            "Gender.Equal": values
        }))
        console.log(filter)
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
                    <Autocomplete<Gender,false>
                        options={options}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => GenderLabel[option]}
                        getOptionKey={(option) => option}
                        renderInput={(params) => <TextField {...params} label="Giới tính" />}
                        value={values as Gender}
                        renderOption={(props, option, { selected }) => (
                            <MenuItem {...props} selected={selected}>
                                {GenderLabel[option]}
                            </MenuItem>
                        )}
                        onChange={(event, value) => {
                            setValues(value!);
                        }}
                    />
                    <Box display={'flex'} justifyContent={'flex-end'} gap={2}>
                        <Button
                            onClick={() => {
                                setValues(undefined);
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
