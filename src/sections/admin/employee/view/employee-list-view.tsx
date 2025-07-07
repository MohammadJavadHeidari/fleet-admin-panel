import type { IEmployee, IEmployeeList } from 'src/types/employee';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';

import { EmployeeTableRow } from '../employee-table-row';
import { EmployeeTableToolbar } from '../employee-table-toolbar';

// ----------------------------------------------------------------------

const useGetEmployeeList = () =>
  useQuery({
    queryKey: ['employee', 'list'],
    queryFn: () => apiClient.get<IEmployeeList>(API_ENDPOINTS.admin.employee.list),
  });

const TABLE_HEAD = [
  { id: 'name', label: 'نام' },
  { id: 'lastName', label: 'نام خانوادگی' },
  { id: 'phoneNumber', label: 'شماره تلفن' },
  { id: 'email', label: 'ایمیل' },
  { id: 'station', label: 'ایستگاه' },
];

export function EmployeeListView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const { data, isLoading } = useGetEmployeeList();

  if (isLoading) return <LoadingScreen />;

  const employees = data?.results.data || [];

  const dataFiltered: IEmployee[] = applyFilter({
    inputData: employees,
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
            name: 'کارمندان',
            href: paths.admin.dashboard.employee.root,
          },
          { name: 'لیست' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.dashboard.employee.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            کارمند جدید
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <EmployeeTableToolbar
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeadCustom rowCount={employees.length} headLabel={TABLE_HEAD} />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <EmployeeTableRow key={row.id} row={row} />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, employees.length)}
                />

                {notFound && <TableNoData notFound={notFound} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={employees.length}
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
  inputData: IEmployee[];
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
