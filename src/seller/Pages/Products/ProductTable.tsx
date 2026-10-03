import { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../Store";
import { fetchSellerProducts } from "../../../State/Seller/sellerProductSlice";

const StyledTableCell = styled(TableCell)(() => ({ fontSize: 12 }));
const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
}));

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.sellerProduct);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) dispatch(fetchSellerProducts(jwt));
  }, [dispatch]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="seller products table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "black" }}>
            {['Images', 'Title', 'MRP', 'Selling Price', 'Color', 'Stock', 'Update'].map((head) => (
              <StyledTableCell key={head} sx={{ color: "white" }}>{head}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <StyledTableRow key={product.id ?? index}>
              <StyledTableCell>
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title || "Product"}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  "No Image"
                )}
              </StyledTableCell>
              <StyledTableCell>{product.title || "-"}</StyledTableCell>
              <StyledTableCell>₹{product.mrPrice ?? product.mrp ?? "-"}</StyledTableCell>
              <StyledTableCell>₹{product.sellingPrice ?? "-"}</StyledTableCell>
              <StyledTableCell>{product.color || "-"}</StyledTableCell>
              <StyledTableCell>{product.quantity ?? 0}</StyledTableCell>
              <StyledTableCell><button type="button">Update</button></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
