import type { IDriver } from 'src/types/driver';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type RouteTableRowProps = {
  row: IDriver;
};

export function DriverTableRow({ row }: RouteTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          {row.firstName} {row.lastName}
        </TableCell>

        <TableCell>{row.phoneNumber}</TableCell>

        <TableCell>{row.route.name}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Label variant="soft" color="info" sx={{ gap: 0.5 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <span>{row.licensePlateTwoDigit}</span>
              <span>{row.licensePlateLetter}</span>
              <span>{row.licensePlateThreeDigit}</span>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <span>-</span>
              <span>{row.licensePlateProvince}</span>
            </Stack>
            ایران
          </Label>
        </TableCell>

        <TableCell>{row.carBrand}</TableCell>

        <TableCell>{row.carColor}</TableCell>

        <TableCell>
          <Label variant="soft" color={(row.isActive === false && 'error') || 'success'}>
            {row.isActive ? 'فعال' : 'غیر فعال'}
          </Label>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
