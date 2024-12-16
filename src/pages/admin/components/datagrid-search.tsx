import { FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import { useGridPrivateApiContext } from '@mui/x-data-grid/internals';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { useDebounceValue } from 'usehooks-ts';
export const CustomQuickFilter = () => {
    const apiRef = useGridPrivateApiContext();
    const [value, setValue] = React.useState<string | undefined>();
    const [debouncedValue, setDebouncedValue] = useDebounceValue(value, 300);
    React.useEffect(() => {
        apiRef.current.setQuickFilterValues([debouncedValue]);
    }, [debouncedValue, apiRef]);
    return (
        <FormControl variant="standard">
            <InputLabel htmlFor="standard-adornment">Tìm kiếm...</InputLabel>
            <Input
                id="standard-adornment"
                type={'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                }
            />
        </FormControl>
    );
};
