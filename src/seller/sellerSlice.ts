import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { api } from "../config/api";

export const fetchSellerProfile = createAsyncThunk(
  "/sellers/fetchSellerProfile",
  async (
    jwt: string,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        "/sellers/profile",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log(
        "fetch seller profile ",
        response
      );

      return response.data;
    } catch (error) {
      console.log(
        "error --- ",
        error
      );

      return rejectWithValue(error);
    }
  }
);

export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/sendLoginSignupOtp",
  async (
    {
      email,
      role,
    }: {
      email: string;
      role: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/auth/sent/login-signup-otp",
        {
          email,
          role,
        }
      );

      console.log(
        "login otp ",
        response
      );

      return response.data;
    } catch (error) {
      console.log(
        "error --- ",
        error
      );

      return rejectWithValue(error);
    }
  }
);

interface SellerState {
  Seller: any[];
  SelectedSeller: any;
  profile: any;
  report: any;
  loading: boolean;
  error: any;
}

const initialState: SellerState = {
  Seller: [],
  SelectedSeller: null,
  profile: null,
  report: null,
  loading: false,
  error: null,
};

const sellerSlice = createSlice({
  name: "Seller",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchSellerProfile.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSellerProfile.fulfilled,
        (state, action) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(
        fetchSellerProfile.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default sellerSlice.reducer;