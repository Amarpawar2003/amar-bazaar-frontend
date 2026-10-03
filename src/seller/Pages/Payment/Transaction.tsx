import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: 12,
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f5f5f5",
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number
) {
  return { name, calories, fat, carbs };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24),
  createData("Ice cream sandwich", 237, 9.0, 37),
  createData("Eclair", 262, 16.0, 24),
  createData("Cupcake", 305, 3.7, 67),
  createData("Gingerbread", 356, 16.0, 49),
];

export default function TransactionTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="customized table">

        <TableHead>
          <TableRow sx={{ backgroundColor: "black" }}>
            <StyledTableCell sx={{ color: "white" }}>
              Date
            </StyledTableCell>

            <StyledTableCell
              align="right"
              sx={{ color: "white" }}
            >
              Customer Details
            </StyledTableCell>

            <StyledTableCell
              align="right"
              sx={{ color: "white" }}
            >
              Order
            </StyledTableCell>

            <StyledTableCell
              align="right"
              sx={{ color: "white" }}
            >
              Amount
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

              <StyledTableCell align="right">
                {row.calories}
              </StyledTableCell>

              <StyledTableCell align="right">
                {row.fat}
              </StyledTableCell>

              <StyledTableCell align="right">
                {row.carbs}
              </StyledTableCell>

            </StyledTableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}