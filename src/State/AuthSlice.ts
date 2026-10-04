import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/api";

// =====================================================
// TYPES
// =====================================================

interface LoginOtpRequest {
    email: string;
    role: string;
}

interface RegisterOtpRequest {
    email: string;
}

interface LoginRequest {
    email: string;
    otp: string;
}

interface AuthState {
    loading: boolean;
    jwt: string | null;
    user: any;
    error: string | null;
}

// =====================================================
// INITIAL STATE
// =====================================================

const initialState: AuthState = {
    loading: false,
    jwt: null,
    user: null,
    error: null,
};

// =====================================================
// LOGIN / SIGNUP OTP
// =====================================================

export const sendLoginSignupOtp = createAsyncThunk<
    any,
    LoginOtpRequest,
    { rejectValue: string }
>(
    "/auth/sendLoginSignupOtp",

    async ({ email, role }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/auth/sent/login-signup-otp",
                {
                    email: email.trim().toLowerCase(),
                    role: role,
                }
            );

            return response.data;

        } catch (error: any) {

            console.log("LOGIN OTP ERROR:", error);

            console.log(
                "LOGIN OTP STATUS:",
                error?.response?.status
            );

            console.log(
                "LOGIN OTP DATA:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to send OTP. Please try again.";

            return rejectWithValue(message);
        }
    }
);

// =====================================================
// REGISTER OTP
// =====================================================

export const sendRegisterOtp = createAsyncThunk<
    any,
    RegisterOtpRequest,
    { rejectValue: string }
>(
    "/auth/sendRegisterOtp",

    async ({ email }, { rejectWithValue }) => {
        try {

            const response = await api.post(
                "/auth/sent/register-otp",
                {
                    email: email.trim().toLowerCase(),
                }
            );

            return response.data;

        } catch (error: any) {

            console.log("REGISTER OTP ERROR:", error);

            console.log(
                "REGISTER OTP STATUS:",
                error?.response?.status
            );

            console.log(
                "REGISTER OTP DATA:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to send registration OTP. Please try again.";

            return rejectWithValue(message);
        }
    }
);

// =====================================================
// CUSTOMER LOGIN
// =====================================================

export const signin = createAsyncThunk<
    any,
    LoginRequest,
    { rejectValue: string }
>(
    "/auth/signin",

    async (loginRequest, { rejectWithValue }) => {
        try {

            const response = await api.post(
                "/auth/signing",
                {
                    email: loginRequest.email
                        .trim()
                        .toLowerCase(),

                    otp: loginRequest.otp.trim(),
                }
            );

            return response.data;

        } catch (error: any) {

            console.log(
                "CUSTOMER LOGIN ERROR:",
                error
            );

            console.log(
                "CUSTOMER LOGIN STATUS:",
                error?.response?.status
            );

            console.log(
                "CUSTOMER LOGIN DATA:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Login failed. Please try again.";

            return rejectWithValue(message);
        }
    }
);

// =====================================================
// SELLER LOGIN
// =====================================================

export const sellerSignin = createAsyncThunk<
    any,
    LoginRequest,
    { rejectValue: string }
>(
    "/auth/sellerSignin",

    async (loginRequest, { rejectWithValue }) => {
        try {

            const response = await api.post(
                "/sellers/login",
                {
                    email: loginRequest.email
                        .trim()
                        .toLowerCase(),

                    otp: loginRequest.otp.trim(),
                }
            );

            return response.data;

        } catch (error: any) {

            console.log(
                "SELLER LOGIN ERROR:",
                error
            );

            console.log(
                "SELLER LOGIN STATUS:",
                error?.response?.status
            );

            console.log(
                "SELLER LOGIN DATA:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Seller login failed. Please try again.";

            return rejectWithValue(message);
        }
    }
);

// =====================================================
// AUTH SLICE
// =====================================================

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        // =================================================
        // LOGIN OTP
        // =================================================

        builder

            .addCase(
                sendLoginSignupOtp.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                sendLoginSignupOtp.fulfilled,
                (state) => {

                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(
                sendLoginSignupOtp.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Unable to send OTP. Please try again.";
                }
            );

        // =================================================
        // REGISTER OTP
        // =================================================

        builder

            .addCase(
                sendRegisterOtp.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                sendRegisterOtp.fulfilled,
                (state) => {

                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(
                sendRegisterOtp.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Unable to send registration OTP. Please try again.";
                }
            );

        // =================================================
        // CUSTOMER LOGIN
        // =================================================

        builder

            .addCase(
                signin.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                signin.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.error = null;

                    // Get JWT from login response
                    const jwt =
                        action.payload?.jwt || null;

                    // Save JWT in Redux
                    state.jwt = jwt;

                    // Save user data
                    state.user =
                        action.payload || null;

                    // Save JWT in browser storage
                    // so API requests can send Authorization header
                    if (jwt) {
                        localStorage.setItem(
                            "jwt",
                            jwt
                        );
                    }
                }
            )

            .addCase(
                signin.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Login failed. Please try again.";
                }
            );

        // =================================================
        // SELLER LOGIN
        // =================================================

        builder

            .addCase(
                sellerSignin.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                sellerSignin.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.error = null;

                    // Get JWT from seller login response
                    const jwt =
                        action.payload?.jwt || null;

                    // Save JWT in Redux
                    state.jwt = jwt;

                    // Save seller data
                    state.user =
                        action.payload || null;

                    // Save JWT in browser storage
                    if (jwt) {
                        localStorage.setItem(
                            "jwt",
                            jwt
                        );
                    }
                }
            )

            .addCase(
                sellerSignin.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Seller login failed. Please try again.";
                }
            );
    },
});

// =====================================================
// EXPORT
// =====================================================

export default authSlice.reducer;