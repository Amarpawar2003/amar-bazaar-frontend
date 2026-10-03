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
  Button,
  styled,
} from "@mui/material";

import { tableCellClasses } from "@mui/material/TableCell";

import React, { useState } from "react";

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

const accountStatu = [
  {
    status: "PENDING_VERIFICATION",
    title: "Pending Verification",
    description: "Account is pending verification",
  },
  {
    status: "ACTIVE",
    title: "Active",
    description: "Account is active and in good standing",
  },
  {
    status: "SUSPENDED",
    title: "Suspended",
    description: "Account is temporarily suspended",
  },
  {
    status: "DEACTIVATED",
    title: "Deactivated",
    description: "Account is deactivated",
  },
  {
    status: "BANNED",
    title: "Banned",
    description: "Account is permanently banned",
  },
  {
    status: "CLOSED",
    title: "Closed",
    description: "Account is permanently closed",
  },
];

const rows = [
  {
    name: "Frozen yoghurt",
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16,
    carbs: 24,
    protein: 6,
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
  },
];

const SellersTable = () => {
  const [accountStatus, setAccountStatus] = useState("ACTIVE");

  return (
    <div className="pb-5">

      <div className="pb-5 w-60">

        <FormControl fullWidth>

          <InputLabel id="demo-simple-select-label">
            Account Status
          </InputLabel>

          <Select
            labelId="demo-simple-select-label"
            value={accountStatus}
            label="Account Status"
            onChange={(e) => setAccountStatus(e.target.value)}
          >

            {accountStatu.map((item) => (
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
              Seller Name
            </StyledTableCell>

            <StyledTableCell>
              Email
            </StyledTableCell>

            <StyledTableCell align="right">
              Mobile
            </StyledTableCell>

            <StyledTableCell align="right">
              GSTIN
            </StyledTableCell>

            <StyledTableCell align="right">
              Business Name
            </StyledTableCell>

            <StyledTableCell align="right">
              Account Status
            </StyledTableCell>

            <StyledTableCell align="right">
              Change Status
            </StyledTableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {rows.map((row) => (

            <StyledTableRow key={row.name}>

              <StyledTableCell
                component="th"
                scope="row"
              >
                {row.name}
              </StyledTableCell>

              <StyledTableCell>
                {row.calories}
              </StyledTableCell>

              <StyledTableCell align="right">
                {row.fat}
              </StyledTableCell>

              <StyledTableCell align="right">
                {row.carbs}
              </StyledTableCell>

              <StyledTableCell align="right">
                {row.protein}
              </StyledTableCell>

              <StyledTableCell align="right">
                {row.carbs}
              </StyledTableCell>

              <StyledTableCell align="right">

                <Button>
                  Change
                </Button>

              </StyledTableCell>

            </StyledTableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
};

export default SellersTable;