import type { IStation, IStationList } from 'src/types/station';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { API_ENDPOINTS } from 'src/utils/axios';
import { apiClient } from 'src/utils/api-client';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, TableNoData, TableEmptyRows, TableHeadCustom } from 'src/components/table';

import { StationTableRow } from '../station-table-row';
import { StationTableToolbar } from '../station-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

const useGetStationList = () =>
  useQuery({
    queryKey: ['station', 'list'],
    queryFn: () => apiClient.get<IStationList>(API_ENDPOINTS.admin.station.list),
  });

const TABLE_HEAD = [
  { id: 'name', label: 'نام' },
  { id: 'address', label: 'آدرس' },
  { id: 'status', label: 'وضعیت' },
  // { id: '' },
];

export function StationListView() {
  const table = useTable();

  const { data, isLoading } = useGetStationList();

  const [filterName, setFilterName] = useState('');

  console.log({ data });
  console.log({ isLoading });

  if (isLoading) return <LoadingScreen />;

  const stations = data?.results.data || [];

  const dataFiltered: IStation[] = applyFilter({
    inputData: stations,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="لیست"
        links={[
          { name: 'داشبورد', href: paths.admin.dashboard.root },
          {
            name: 'ایستگاه ها',
            href: paths.admin.dashboard.station.root,
          },
          { name: 'لیست' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.dashboard.station.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            ایستگاه جدید
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <StationTableToolbar
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={stations.length}
                numSelected={table.selected.length}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <StationTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <TableNoData notFound={notFound} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={stations.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------