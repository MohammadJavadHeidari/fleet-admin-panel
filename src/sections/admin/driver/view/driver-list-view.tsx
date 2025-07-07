import type { IDriver, IDriverList } from 'src/types/driver';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { API_ENDPOINTS } from 'src/utils/axios';
import { apiClient } from 'src/utils/api-client';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';

import { DriverTableRow } from '../driver-table-row';
import { DriverTableToolbar } from '../driver-table-toolbar';

// ----------------------------------------------------------------------

const useGetDriverList = () =>
  useQuery({
    queryKey: ['driver', 'list'],
    queryFn: () => apiClient.get<IDriverList>(API_ENDPOINTS.driver.list),
  });

const TABLE_HEAD = [
  { id: 'firstName', label: 'نام' },
  { id: 'phoneNumber', label: 'شماره تلفن' },
  { id: 'routeName', label: 'مسیر' },
  { id: 'licensePlate', label: 'پلاک خودرو' },
  { id: 'carBrand', label: 'برند خودرو' },
  { id: 'carColor', label: 'رنگ خودرو' },
  { id: 'isActive', label: 'وضعیت' },
];

export function DriverListView() {
  const table = useTable();

  const { data, isLoading } = useGetDriverList();

  const [filterName, setFilterName] = useState('');

  if (isLoading) return <LoadingScreen />;

  const drivers = data?.results.data || [];

  const dataFiltered: IDriver[] = applyFilter({
    inputData: drivers,
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
            name: 'رانندگان',
            href: paths.admin.dashboard.driver.root,
          },
          { name: 'لیست' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.dashboard.driver.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            راننده جدید
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <DriverTableToolbar
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
                rowCount={drivers.length}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <DriverTableRow key={row.id} row={row} />
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
          count={drivers.length}
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
type ApplyFilterProps = {
  inputData: IDriver[];
  filterName: string;
  comparator: (a: any, b: any) => number;
};

export function applyFilter({ inputData, comparator, filterName }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) =>
        user.firstName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
