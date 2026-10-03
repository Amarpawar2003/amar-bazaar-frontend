import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  styled,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import { tableCellClasses } from "@mui/material/TableCell";

import React from "react";

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

const homeGrid = [
  {
    id: 8,
    image: "/images/burds.jpg",
    category: "women_lehenga_cholis",
    name: "Women Lehenga Cholis",
  },
  {
    id: 9,
    image: "/images/watch.jpg",
    category: "men_formal_shoes",
    name: "Men Formal Shoes",
  },
  {
    id: 10,
    image: "/images/puma.jpg",
    category: "women_lehenga_cholis",
    name: "Women Lehenga Cholis",
  },
  {
    id: 11,
    image: "/images/chapal.jpg",
    category: "men_sherwanis",
    name: "Men Sherwanis",
  },
];

const GridTable = () => {
  return (
    <div className="pb-5">

      <Table>

        <TableHead>

          <TableRow>

            <StyledTableCell>
              No
            </StyledTableCell>

            <StyledTableCell>
              Id
            </StyledTableCell>

            <StyledTableCell>
              image
            </StyledTableCell>

            <StyledTableCell align="right">
              category
            </StyledTableCell>

            <StyledTableCell align="right">
              Name
            </StyledTableCell>

            <StyledTableCell align="right">
            </StyledTableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {homeGrid.map((item, index) => (

            <StyledTableRow key={item.id}>

              <StyledTableCell>
                {index + 1}
              </StyledTableCell>

              <StyledTableCell>
                {item.id}
              </StyledTableCell>

              <StyledTableCell>

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-32 object-cover rounded-md"
                />

              </StyledTableCell>

              <StyledTableCell align="right">
                {item.category}
              </StyledTableCell>

              <StyledTableCell align="right">
                {item.name}
              </StyledTableCell>

              <StyledTableCell align="right">

                <IconButton>
                  <EditIcon className="text-orange-400" />
                </IconButton>

              </StyledTableCell>

            </StyledTableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
};

export default GridTable;