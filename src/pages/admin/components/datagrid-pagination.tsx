import { Box, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { gridPageCountSelector, gridPageSelector, gridPageSizeSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';

export default function DatagridPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '10px',
                padding: '10px',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2">Số dòng trên trang:</Typography>
                <Select size='small' value={pageSize} onChange={(event) => apiRef.current.setPageSize(+event.target.value)}>
                    {
                        [10, 20, 50, 100].map(item => (
                           <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))
                    }
                </Select>
            </Box>
            <Pagination
                color="primary"
                count={pageCount}
                page={page + 1}
                onChange={(event, value) => apiRef.current.setPage(value - 1)}
            />
        </Box>
    );
}
