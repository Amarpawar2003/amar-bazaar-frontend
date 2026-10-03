import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  MenuItem,
  styled,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

const deals = [
  {
    id: 1,
    image: "/images/iphone2.jpg",
    category: "women_skirts_palazzos",
    discount: "15%",
  },
  {
    id: 2,
    image: "/images/img1.jpg",
    category: "men_t_shirts",
    discount: "60%",
  },
  {
    id: 3,
    image: "/images/sadi5.jpg",
    category: "men_formal_shirts",
    discount: "40%",
  },
];

const categories = [
  {
    id: 1,
    category: "women_skirts_palazzos",
  },
  {
    id: 2,
    category: "men_t_shirts",
  },
  {
    id: 3,
    category: "men_formal_shirts",
  },
];

const Deal = () => {
  const [activeTab, setActiveTab] = useState("deals");

  const [discount, setDiscount] = useState(0);
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      discount,
      category,
    });

    alert("Deal created successfully!");
  };

  return (
    <div className="pb-5">

      {/* Buttons */}

      <div className="flex gap-3 mb-4">

        <Button
          variant={activeTab === "deals" ? "contained" : "outlined"}
          onClick={() => setActiveTab("deals")}
          className={
            activeTab === "deals"
              ? "bg-primary-color"
              : ""
          }
        >
          DEALS
        </Button>

        <Button
          variant={
            activeTab === "categories"
              ? "contained"
              : "outlined"
          }
          onClick={() => setActiveTab("categories")}
          className={
            activeTab === "categories"
              ? "bg-primary-color"
              : ""
          }
        >
          CATEGORIES
        </Button>

        <Button
          variant={
            activeTab === "create"
              ? "contained"
              : "outlined"
          }
          onClick={() => setActiveTab("create")}
          className={
            activeTab === "create"
              ? "bg-primary-color"
              : ""
          }
        >
          CREATE DEAL
        </Button>

      </div>

      {/* DEALS */}

      {activeTab === "deals" && (

        <Table>

          <TableHead>
            <TableRow>

              <StyledTableCell>
                No
              </StyledTableCell>

              <StyledTableCell>
                image
              </StyledTableCell>

              <StyledTableCell>
                category
              </StyledTableCell>

              <StyledTableCell>
                Discount
              </StyledTableCell>

              <StyledTableCell align="right">
                Edit
              </StyledTableCell>

              <StyledTableCell align="right">
                Delete
              </StyledTableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {deals.map((deal) => (

              <StyledTableRow key={deal.id}>

                <StyledTableCell>
                  {deal.id}
                </StyledTableCell>

                <StyledTableCell>

                  <img
                    src={deal.image}
                    alt={deal.category}
                    className="w-16 h-20 object-cover rounded-md"
                  />

                </StyledTableCell>

                <StyledTableCell>
                  {deal.category}
                </StyledTableCell>

                <StyledTableCell>
                  {deal.discount}
                </StyledTableCell>

                <StyledTableCell align="right">

                  <IconButton>
                    <EditIcon className="text-orange-400" />
                  </IconButton>

                </StyledTableCell>

                <StyledTableCell align="right">

                  <IconButton>
                    <DeleteIcon className="text-red-600" />
                  </IconButton>

                </StyledTableCell>

              </StyledTableRow>

            ))}

          </TableBody>

        </Table>

      )}

      {/* CATEGORIES */}

      {activeTab === "categories" && (

        <Table>

          <TableHead>
            <TableRow>

              <StyledTableCell>
                No
              </StyledTableCell>

              <StyledTableCell>
                Category
              </StyledTableCell>

              <StyledTableCell align="right">
                Edit
              </StyledTableCell>

              <StyledTableCell align="right">
                Delete
              </StyledTableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {categories.map((item) => (

              <StyledTableRow key={item.id}>

                <StyledTableCell>
                  {item.id}
                </StyledTableCell>

                <StyledTableCell>
                  {item.category}
                </StyledTableCell>

                <StyledTableCell align="right">

                  <IconButton>
                    <EditIcon className="text-orange-400" />
                  </IconButton>

                </StyledTableCell>

                <StyledTableCell align="right">

                  <IconButton>
                    <DeleteIcon className="text-red-600" />
                  </IconButton>

                </StyledTableCell>

              </StyledTableRow>

            ))}

          </TableBody>

        </Table>

      )}

      {/* CREATE DEAL */}

      {activeTab === "create" && (

        <div className="flex justify-center">

          <div className="w-full max-w-xl">

            <h1 className="text-3xl text-center font-medium mb-8">
              Create Deal
            </h1>

            <form onSubmit={handleSubmit}>

              <div className="space-y-5">

                <TextField
                  fullWidth
                  type="number"
                  label="Discount"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(Number(e.target.value))
                  }
                />

                <TextField
                  select
                  fullWidth
                  label="Category *"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >

                  <MenuItem value="women_skirts_palazzos">
                    women_skirts_palazzos
                  </MenuItem>

                  <MenuItem value="men_t_shirts">
                    men_t_shirts
                  </MenuItem>

                  <MenuItem value="men_formal_shirts">
                    men_formal_shirts
                  </MenuItem>

                </TextField>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="bg-primary-color py-3"
                >
                  SUBMIT
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Deal;