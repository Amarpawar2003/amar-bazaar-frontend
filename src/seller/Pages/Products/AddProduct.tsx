import { uploadToCoudinary } from "../../../Util/uploadToCoudinary";

import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";

import { Delete } from "@mui/icons-material";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useAppDispatch } from "../../Store";
import { createProduct } from "../../../State/Seller/sellerProductSlice";
import * as Yup from "yup";

const AddProduct = () => {
  const [uploading, setUploading] = useState(false);

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      quantity: "",
      color: "",
      sizes: "",
      category: "",
      secondCategory: "",
      thirdCategory: "",
      images: [] as string[],
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),

      description: Yup.string().required(
        "Description is required"
      ),

      mrpPrice: Yup.number()
        .required("MRP Price is required")
        .positive("Enter valid price"),

      sellingPrice: Yup.number()
        .required("Selling Price is required")
        .positive("Enter valid price")
        .test(
          "less-than-mrp",
          "Selling price must be less than MRP",
          function (value) {
            return (
              value !== undefined &&
              value < Number(this.parent.mrpPrice)
            );
          }
        ),

      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1")
        .integer("Quantity must be a whole number"),

      color: Yup.string().required("Color is required"),

      sizes: Yup.string().required("Sizes are required"),

      category: Yup.string().required(
        "Category is required"
      ),

      secondCategory: Yup.string().required(
        "Second Category is required"
      ),

      thirdCategory: Yup.string().required(
        "Third Category is required"
      ),

      images: Yup.array()
        .of(Yup.string())
        .min(
          1,
          "At least one product image is required"
        ),
    }),

    onSubmit: async (values, { resetForm }) => {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        alert("Please login as seller first.");
        return;
      }

      if (values.images.length === 0) {
        alert("Please upload at least one product image.");
        return;
      }

      try {
        const request = {
          title: values.title.trim(),

          description: values.description.trim(),

          mrpPrice: Number(values.mrpPrice),

          sellingPrice: Number(values.sellingPrice),

          quantity: Number(values.quantity),

          color: values.color,

          sizes: values.sizes,

          images: values.images,

          category: values.category,

          category2: values.secondCategory,

          category3: values.thirdCategory,
        };

        console.log(
          "CREATE PRODUCT REQUEST:",
          request
        );

        console.log(
          "PRODUCT IMAGES:",
          request.images
        );

        const result = await dispatch(
          createProduct({
            request,
            jwt,
          })
        );

        if (createProduct.fulfilled.match(result)) {
          console.log(
            "PRODUCT CREATED:",
            result.payload
          );

          alert("Product added successfully.");

          resetForm();
        } else {
          console.error(
            "PRODUCT CREATE ERROR:",
            result
          );

          alert(
            (result.payload as string) ||
              "Failed to add product."
          );
        }
      } catch (error) {
        console.error(
          "Product creation error:",
          error
        );

        alert("Failed to add product.");
      }
    },
  });

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    try {
      setUploading(true);

      const imageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert(
            `${file.name} is not a valid image.`
          );
          continue;
        }

        // Validate file size - max 5MB
        if (file.size > 5 * 1024 * 1024) {
          alert(
            `${file.name} is larger than 5MB.`
          );
          continue;
        }

        console.log(
          "Uploading image:",
          file.name
        );

        const data = await uploadToCoudinary(file);

        console.log(
          "Cloudinary response:",
          data
        );

        if (data?.secure_url) {
          imageUrls.push(data.secure_url);
        } else {
          console.error(
            "Cloudinary did not return secure_url",
            data
          );
        }
      }

      if (imageUrls.length > 0) {
        const updatedImages = [
          ...formik.values.images,
          ...imageUrls,
        ];

        formik.setFieldValue(
          "images",
          updatedImages
        );

        console.log(
          "IMAGE URLS:",
          updatedImages
        );
      } else {
        alert(
          "Image upload failed. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      alert(
        "Image upload failed. Check browser console."
      );
    } finally {
      setUploading(false);

      // Same image पुन्हा select करता यावी
      event.target.value = "";
    }
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = (index: number) => {
    const images = [...formik.values.images];

    images.splice(index, 1);

    formik.setFieldValue(
      "images",
      images
    );
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-5"
    >
      {/* =====================================================
          PRODUCT IMAGES
      ===================================================== */}

      <div className="border rounded-xl p-5 bg-white">
        <h2 className="text-lg font-semibold mb-2">
          Product Images
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Upload one or more product images
        </p>

        <input
          id="product-image"
          name="product-image"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          onChange={handleImageChange}
          disabled={uploading}
          className="
            block
            w-full
            text-sm
            text-gray-700
            border
            border-gray-300
            rounded-lg
            p-2
            cursor-pointer
            bg-white
          "
        />

        {/* Uploading */}

        {uploading && (
          <div className="flex items-center gap-2 mt-4 text-gray-600">
            <CircularProgress size={20} />

            <span>
              Uploading image...
            </span>
          </div>
        )}

        {/* Validation */}

        {formik.touched.images &&
          formik.errors.images && (
            <p className="text-red-500 text-sm mt-2">
              {formik.errors.images as string}
            </p>
          )}

        {/* Preview */}

        {formik.values.images.length > 0 && (
          <div className="flex gap-4 mt-5 flex-wrap">
            {formik.values.images.map(
              (image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative"
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="
                      w-28
                      h-28
                      object-cover
                      rounded-lg
                      border
                    "
                  />

                  <IconButton
                    type="button"
                    size="small"
                    onClick={() =>
                      removeImage(index)
                    }
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "white",

                      "&:hover": {
                        backgroundColor:
                          "#f5f5f5",
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          TITLE
      ===================================================== */}

      <TextField
        fullWidth
        name="title"
        label="Title *"
        variant="outlined"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.title &&
          Boolean(formik.errors.title)
        }
        helperText={
          formik.touched.title &&
          formik.errors.title
        }
      />

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <TextField
        fullWidth
        name="description"
        label="Description *"
        multiline
        rows={4}
        variant="outlined"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.description &&
          Boolean(formik.errors.description)
        }
        helperText={
          formik.touched.description &&
          formik.errors.description
        }
      />

      {/* =====================================================
          PRICE + STOCK + COLOR
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-4
        "
      >
        {/* MRP */}

        <TextField
          fullWidth
          type="number"
          name="mrpPrice"
          label="MRP Price *"
          variant="outlined"
          value={formik.values.mrpPrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.mrpPrice &&
            Boolean(formik.errors.mrpPrice)
          }
          helperText={
            formik.touched.mrpPrice &&
            formik.errors.mrpPrice
          }
        />

        {/* SELLING PRICE */}

        <TextField
          fullWidth
          type="number"
          name="sellingPrice"
          label="Selling Price *"
          variant="outlined"
          value={formik.values.sellingPrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.sellingPrice &&
            Boolean(formik.errors.sellingPrice)
          }
          helperText={
            formik.touched.sellingPrice &&
            formik.errors.sellingPrice
          }
        />

        {/* QUANTITY */}

        <TextField
          fullWidth
          type="number"
          name="quantity"
          label="Stock Quantity *"
          variant="outlined"
          value={formik.values.quantity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.quantity &&
            Boolean(formik.errors.quantity)
          }
          helperText={
            formik.touched.quantity &&
            formik.errors.quantity
          }
        />

        {/* COLOR */}

        <FormControl
          fullWidth
          error={
            formik.touched.color &&
            Boolean(formik.errors.color)
          }
        >
          <InputLabel>
            Color *
          </InputLabel>

          <Select
            name="color"
            value={formik.values.color}
            label="Color *"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="Pink">
              Pink
            </MenuItem>

            <MenuItem value="Green">
              Green
            </MenuItem>

            <MenuItem value="Blue">
              Blue
            </MenuItem>

            <MenuItem value="Red">
              Red
            </MenuItem>

            <MenuItem value="Black">
              Black
            </MenuItem>

            <MenuItem value="White">
              White
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* =====================================================
          SIZE
      ===================================================== */}

      <FormControl
        fullWidth
        error={
          formik.touched.sizes &&
          Boolean(formik.errors.sizes)
        }
      >
        <InputLabel>
          Sizes *
        </InputLabel>

        <Select
          name="sizes"
          value={formik.values.sizes}
          label="Sizes *"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="S">
            S
          </MenuItem>

          <MenuItem value="M">
            M
          </MenuItem>

          <MenuItem value="L">
            L
          </MenuItem>

          <MenuItem value="XL">
            XL
          </MenuItem>

          <MenuItem value="XXL">
            XXL
          </MenuItem>
        </Select>
      </FormControl>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >
        {/* CATEGORY */}

        <FormControl
          fullWidth
          error={
            formik.touched.category &&
            Boolean(formik.errors.category)
          }
        >
          <InputLabel>
            Category *
          </InputLabel>

          <Select
            name="category"
            value={formik.values.category}
            label="Category *"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="men">
              Men
            </MenuItem>

            <MenuItem value="women">
              Women
            </MenuItem>

            <MenuItem value="electronics">
              Electronics
            </MenuItem>

            <MenuItem value="home">
              Home & Furniture
            </MenuItem>
          </Select>
        </FormControl>

        {/* SECOND CATEGORY */}

        <FormControl
          fullWidth
          error={
            formik.touched.secondCategory &&
            Boolean(
              formik.errors.secondCategory
            )
          }
        >
          <InputLabel>
            Second Category *
          </InputLabel>

          <Select
            name="secondCategory"
            value={
              formik.values.secondCategory
            }
            label="Second Category *"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="shirts">
              Shirts
            </MenuItem>

            <MenuItem value="tshirts">
              T-Shirts
            </MenuItem>

            <MenuItem value="jeans">
              Jeans
            </MenuItem>

            <MenuItem value="shoes">
              Shoes
            </MenuItem>
          </Select>
        </FormControl>

        {/* THIRD CATEGORY */}

        <FormControl
          fullWidth
          error={
            formik.touched.thirdCategory &&
            Boolean(
              formik.errors.thirdCategory
            )
          }
        >
          <InputLabel>
            Third Category *
          </InputLabel>

          <Select
            name="thirdCategory"
            value={
              formik.values.thirdCategory
            }
            label="Third Category *"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="casual">
              Casual
            </MenuItem>

            <MenuItem value="formal">
              Formal
            </MenuItem>

            <MenuItem value="sports">
              Sports
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* =====================================================
          ADD PRODUCT
      ===================================================== */}

      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={
          uploading ||
          formik.isSubmitting
        }
        sx={{
          py: "12px",
          backgroundColor: "#20B486",

          "&:hover": {
            backgroundColor: "#20B486",
          },
        }}
      >
        {uploading ||
        formik.isSubmitting ? (
          <CircularProgress
            size={25}
            sx={{
              color: "white",
            }}
          />
        ) : (
          "ADD PRODUCT"
        )}
      </Button>
    </form>
  );
};

export default AddProduct;