import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  styled,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { tableCellClasses } from "@mui/material/TableCell";

import React, { useState } from "react";

const couponStatus = [
  {
    status: "ACTIVE",
    title: "Active",
  },
  {
    status: "PENDING_VERIFICATION",
    title: "Pending Verification",
  },
  {
    status: "SUSPENDED",
    title: "Suspended",
  },
  {
    status: "DEACTIVATED",
    title: "Deactivated",
  },
  {
    status: "BANNED",
    title: "Banned",
  },
  {
    status: "CLOSED",
    title: "Closed",
  },
];

const coupons = [
  {
    code: "AMAR10",
    startDate: "2024-09-25",
    endDate: "2024-09-29",
    minOrderValue: 500,
    discount: 50,
    status: "ACTIVE",
  },
  {
    code: "AMAR20",
    startDate: "2024-09-25",
    endDate: "2024-09-29",
    minOrderValue: 599,
    discount: 30,
    status: "ACTIVE",
  },
  {
    code: "AMAR30",
    startDate: "2024-09-25",
    endDate: "2024-09-29",
    minOrderValue: 699,
    discount: 10,
    status: "ACTIVE",
  },
  {
    code: "AMAR40",
    startDate: "2024-09-25",
    endDate: "2024-09-29",
    minOrderValue: 699,
    discount: 10,
    status: "ACTIVE",
  },
  {
    code: "AMAR50",
    startDate: "2024-09-25",
    endDate: "2024-09-29",
    minOrderValue: 699,
    discount: 10,
    status: "ACTIVE",
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Coupon = () => {
  const [status, setStatus] = useState("ACTIVE");

  const filteredCoupons = coupons.filter(
    (coupon) => coupon.status === status
  );

  return (
    <div className="pb-5">

      <div className="pb-5 w-60">

        <FormControl fullWidth>

          <InputLabel id="coupon-status-label">
            Coupon Status
          </InputLabel>

          <Select
            labelId="coupon-status-label"
            value={status}
            label="Coupon Status"
            onChange={(e) => setStatus(e.target.value)}
          >

            {couponStatus.map((item) => (
              <MenuItem
                key={item.status}
                value={item.status}
              >
                {item.title}
              </MenuItem>
            ))}

          </Select>

        </FormControl>

      </div>

      <Table>

        <TableHead>

          <TableRow>

            <StyledTableCell>
              Coupon Code
            </StyledTableCell>

            <StyledTableCell>
              Start Date
            </StyledTableCell>

            <StyledTableCell>
              End Date
            </StyledTableCell>

            <StyledTableCell>
              Min Order Value
            </StyledTableCell>

            <StyledTableCell>
              Discount %
            </StyledTableCell>

            <StyledTableCell>
              Status
            </StyledTableCell>

            <StyledTableCell align="center">
              Delete
            </StyledTableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {filteredCoupons.map((coupon) => (

            <StyledTableRow key={coupon.code}>

              <StyledTableCell>
                {coupon.code}
              </StyledTableCell>

              <StyledTableCell>
                {coupon.startDate}
              </StyledTableCell>

              <StyledTableCell>
                {coupon.endDate}
              </StyledTableCell>

              <StyledTableCell>
                {coupon.minOrderValue}
              </StyledTableCell>

              <StyledTableCell>
                {coupon.discount}
              </StyledTableCell>

              <StyledTableCell>
                {coupon.status}
              </StyledTableCell>

              <StyledTableCell align="center">

                <IconButton>
                  <DeleteIcon className="text-red-500" />
                </IconButton>

              </StyledTableCell>

            </StyledTableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
};

export default Coupon;