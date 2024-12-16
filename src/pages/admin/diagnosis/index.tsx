import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { PageContainer, PageContainerToolbar } from '@toolpad/core';
import CreateModal from './components/create-modal';
import useDiagnosisTable from './hooks/useDiagnosisTable';
import DatagridPagination from '../components/datagrid-pagination';
import Filter from './components/filter';
import { CustomQuickFilter } from '../components/datagrid-search';
export default function DiagnosesManagementPage() {
    const { table ,filter} = useDiagnosisTable();
    return (
        <PageContainer slots={{ toolbar: PageToolbar }}>
            <DataGrid
                rows={table.data?.data || []}
                columns={table.columns}
                onPaginationModelChange={table.handlePageChange}
                paginationMode="server"
                filterMode="server"
                sortingMode="server"
                sortModel={table.sortModel as any}
                onSortModelChange={table.handleSortModelChange}
                onFilterModelChange={table.handleFilterModelChange}
                filterModel={table.filterModel}
                paginationModel={table.pagination}
                getRowId={(row) => row.diagnosisId!}
                loading={table.isLoading}
                disableColumnFilter
                slots={{
                    toolbar: DataGridToolbar,
                    pagination: DatagridPagination,
                }}
                slotProps={{
                    loadingOverlay: {
                        variant: 'skeleton',
                        noRowsVariant: 'skeleton',
                    },
                    toolbar: {
                        showQuickFilter: true,
                        children:<Filter setFilter={filter.set} filter={filter.value} />,
                    },

                }}
                disableColumnSelector
                rowCount={table.data?.totalItems || -1}
                sx={{
                    padding: '10px',
                }}
                disableVirtualization
            />
        </PageContainer>
    );
}

interface DataGridToolbarProps extends React.ComponentProps<typeof GridToolbarContainer> {

}

const DataGridToolbar = ({ children,...rest }: DataGridToolbarProps) => {
    return (
        <GridToolbarContainer
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 16px',
            }}
            {...rest}
        >
            <CustomQuickFilter />
            {children}
        </GridToolbarContainer>
    );
};

function PageToolbar() {
    return (
        <PageContainerToolbar>
            <CreateModal />
        </PageContainerToolbar>
    );
}
