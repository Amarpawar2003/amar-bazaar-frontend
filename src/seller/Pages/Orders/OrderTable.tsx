import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  styled,
} from "@mui/material";

import { tableCellClasses } from "@mui/material/TableCell";

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

const rows = [
  {
    orderId: "Frozen yoghurt",
    products: 159,
    shippingAddress: 6,
    orderStatus: 24,
    update: 4,
  },
  {
    orderId: "Ice cream sandwich",
    products: 237,
    shippingAddress: 9,
    orderStatus: 37,
    update: 4.3,
  },
  {
    orderId: "Eclair",
    products: 262,
    shippingAddress: 16,
    orderStatus: 24,
    update: 6,
  },
  {
    orderId: "Cupcake",
    products: 305,
    shippingAddress: 3.7,
    orderStatus: 67,
    update: 4.3,
  },
  {
    orderId: "Gingerbread",
    products: 356,
    shippingAddress: 16,
    orderStatus: 49,
    update: 3.9,
  },
];

const ElectronicsableT = () => {
  return (
    <div className="pb-5">
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              Order Id
            </StyledTableCell>

            <StyledTableCell>
              Products
            </StyledTableCell>

            <StyledTableCell align="right">
              Shipping Address
            </StyledTableCell>

            <StyledTableCell align="right">
              Order Status
            </StyledTableCell>

            <StyledTableCell align="right">
              Update
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.orderId}>
              <StyledTableCell>
                {row.orderId}
              </StyledTableCell>

              <StyledTableCell>
                {row.products}
              </StyledTableCell>

              <StyledTableCell align="right">
                {row.shippingAddress}
              </StyledTableCell>

              <StyledTableCell align="right">
                {row.orderStatus}
              </StyledTableCell>

              <StyledTableCell align="right">
                <Button variant="contained">
                  {row.update}
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ElectronicsableT;