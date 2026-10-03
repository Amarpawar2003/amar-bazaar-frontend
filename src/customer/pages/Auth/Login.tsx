import React, { FormEvent, useEffect, useState } from "react";

import {
    Alert,
    Button,
    CircularProgress,
    Paper,
    TextField,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../seller/Store";

import {
    sendLoginSignupOtp,
    sendRegisterOtp,
    signin,
} from "../../../State/AuthSlice";

import { api } from "../../../config/api";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loading = useAppSelector(
        (state) => state.auth.loading
    );

    // =====================================================
    // LOGIN STATES
    // =====================================================

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [resendTimer, setResendTimer] = useState(0);

    // =====================================================
    // REGISTER STATES
    // =====================================================

    const [registerMode, setRegisterMode] =
        useState(false);

    const [fullName, setFullName] = useState("");
    const [registerEmail, setRegisterEmail] =
        useState("");

    const [registerOtp, setRegisterOtp] =
        useState("");

    const [registerOtpSent, setRegisterOtpSent] =
        useState(false);

    const [registerResendTimer, setRegisterResendTimer] =
        useState(0);

    // =====================================================
    // NOTIFICATION STATES
    // =====================================================

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =====================================================
    // LOGIN OTP TIMER
    // =====================================================

    useEffect(() => {
        if (resendTimer <= 0) return;

        const timer = window.setInterval(() => {
            setResendTimer((previous) => {
                if (previous <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [resendTimer]);

    // =====================================================
    // REGISTER OTP TIMER
    // =====================================================

    useEffect(() => {
        if (registerResendTimer <= 0) return;

        const timer = window.setInterval(() => {
            setRegisterResendTimer((previous) => {
                if (previous <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [registerResendTimer]);

    // =====================================================
    // LOGIN - SEND OTP
    // =====================================================

    const requestOtp = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError(
                "Please enter your email address."
            );
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                normalizedEmail
            )
        ) {
            setError(
                "Please enter a valid email address."
            );
            return;
        }

        try {
            await dispatch(
                sendLoginSignupOtp({
                    email: normalizedEmail,
                    role: "ROLE_CUSTOMER",
                })
            ).unwrap();

            setOtpSent(true);
            setResendTimer(60);

            setMessage(
                "OTP sent successfully. Please check your email."
            );
        } catch (err: any) {
            setError(
                typeof err === "string"
                    ? err
                    : err?.response?.data?.message ||
                          "Unable to send OTP. Please try again."
            );
        }
    };

    // =====================================================
    // LOGIN - RESEND OTP
    // =====================================================

    const resendLoginOtp = async () => {
        if (resendTimer > 0 || loading) return;

        setMessage("");
        setError("");

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError(
                "Please enter your email address."
            );
            return;
        }

        try {
            await dispatch(
                sendLoginSignupOtp({
                    email: normalizedEmail,
                    role: "ROLE_CUSTOMER",
                })
            ).unwrap();

            setResendTimer(60);
            setOtp("");

            setMessage(
                "A new OTP has been sent to your email."
            );
        } catch (err: any) {
            setError(
                typeof err === "string"
                    ? err
                    : err?.response?.data?.message ||
                          "Unable to resend OTP. Please try again."
            );
        }
    };

    // =====================================================
    // CUSTOMER LOGIN
    // =====================================================

    const handleLogin = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const normalizedEmail =
            email.trim().toLowerCase();

        const normalizedOtp = otp.trim();

        if (!normalizedOtp) {
            setError("Please enter the OTP.");
            return;
        }

        if (normalizedOtp.length < 4) {
            setError("Please enter a valid OTP.");
            return;
        }

        try {
            const response = await dispatch(
                signin({
                    email: normalizedEmail,
                    otp: normalizedOtp,
                })
            ).unwrap();

            // =================================================
            // SAVE LOGIN DATA
            // =================================================

            if (response?.jwt) {
                localStorage.setItem(
                    "jwt",
                    response.jwt
                );
            }

            localStorage.setItem(
                "role",
                response?.role || "ROLE_CUSTOMER"
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response)
            );

            setMessage(
                "Login successful. Welcome back to Amar Bazaar!"
            );

            setTimeout(() => {
                navigate("/");
            }, 800);
        } catch (err: any) {
            setError(
                typeof err === "string"
                    ? err
                    : err?.response?.data?.message ||
                          "Login failed. Please check your OTP and try again."
            );
        }
    };

    // =====================================================
    // REGISTER - SEND OTP
    // =====================================================

    const requestRegisterOtp = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const normalizedEmail =
            registerEmail.trim().toLowerCase();

        if (!fullName.trim()) {
            setError(
                "Please enter your full name."
            );
            return;
        }

        if (!normalizedEmail) {
            setError(
                "Please enter your email address."
            );
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                normalizedEmail
            )
        ) {
            setError(
                "Please enter a valid email address."
            );
            return;
        }

        try {
            await dispatch(
                sendRegisterOtp({
                    email: normalizedEmail,
                })
            ).unwrap();

            setRegisterOtpSent(true);
            setRegisterResendTimer(60);

            setMessage(
                "Registration OTP sent successfully. Please check your email."
            );
        } catch (err: any) {
            setError(
                typeof err === "string"
                    ? err
                    : err?.response?.data?.message ||
                          "Unable to send registration OTP. Please try again."
            );
        }
    };

    // =====================================================
    // REGISTER - RESEND OTP
    // =====================================================

    const resendRegisterOtp = async () => {
        if (
            registerResendTimer > 0 ||
            loading
        ) {
            return;
        }

        setMessage("");
        setError("");

        const normalizedEmail =
            registerEmail.trim().toLowerCase();

        if (!normalizedEmail) {
            setError(
                "Please enter your email address."
            );
            return;
        }

        try {
            await dispatch(
                sendRegisterOtp({
                    email: normalizedEmail,
                })
            ).unwrap();

            setRegisterResendTimer(60);
            setRegisterOtp("");

            setMessage(
                "A new registration OTP has been sent to your email."
            );
        } catch (err: any) {
            setError(
                typeof err === "string"
                    ? err
                    : err?.response?.data?.message ||
                          "Unable to resend registration OTP. Please try again."
            );
        }
    };

    // =====================================================
    // REGISTER ACCOUNT
    // =====================================================

    const handleRegister = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const normalizedName =
            fullName.trim();

        const normalizedEmail =
            registerEmail.trim().toLowerCase();

        const normalizedOtp =
            registerOtp.trim();

        if (!normalizedName) {
            setError(
                "Please enter your full name."
            );
            return;
        }

        if (!normalizedEmail) {
            setError(
                "Please enter your email address."
            );
            return;
        }

        if (!normalizedOtp) {
            setError(
                "Please enter the OTP sent to your email."
            );
            return;
        }

        try {
            const response = await api.post(
                "/auth/signup",
                {
                    fullName: normalizedName,
                    email: normalizedEmail,
                    otp: normalizedOtp,
                }
            );

            // =================================================
            // SAVE REGISTERED USER
            // =================================================

            if (response?.data?.jwt) {
                localStorage.setItem(
                    "jwt",
                    response.data.jwt
                );
            }

            localStorage.setItem(
                "role",
                response.data.role ||
                    "ROLE_CUSTOMER"
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );

            setMessage(
                "Your account has been created successfully. Welcome to Amar Bazaar!"
            );

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Registration failed. Please try again."
            );
        }
    };

    // =====================================================
    // COMMON STYLES
    // =====================================================

    const textFieldSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            backgroundColor: "#f8fafc",
            transition: "all 0.2s ease",
            "& fieldset": {
                borderColor: "#e2e8f0",
            },
            "&:hover fieldset": {
                borderColor: "#cbd5e1",
            },
            "&.Mui-focused": {
                backgroundColor: "#ffffff",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#7c3aed",
                borderWidth: "2px",
            },
        },

        "& .MuiInputLabel-root.Mui-focused": {
            color: "#7c3aed",
        },
    };

    const primaryButtonSx = {
        py: 1.6,
        borderRadius: "14px",
        textTransform: "none",
        fontWeight: 800,
        fontSize: "15px",
        background:
            "linear-gradient(135deg, #ec4899 0%, #8b5cf6 55%, #6366f1 100%)",
        boxShadow:
            "0 12px 25px rgba(124, 58, 237, 0.25)",
        "&:hover": {
            background:
                "linear-gradient(135deg, #db2777 0%, #7c3aed 55%, #4f46e5 100%)",
            boxShadow:
                "0 16px 30px rgba(124, 58, 237, 0.32)",
        },
        "&.Mui-disabled": {
            background: "#cbd5e1",
            color: "#ffffff",
        },
    };

    // =====================================================
    // LOGIN / REGISTER SWITCH
    // =====================================================

    const switchToRegister = () => {
        setRegisterMode(true);

        setEmail("");
        setOtp("");
        setOtpSent(false);
        setResendTimer(0);

        setMessage("");
        setError("");
    };

    const switchToLogin = () => {
        setRegisterMode(false);

        setFullName("");
        setRegisterEmail("");
        setRegisterOtp("");
        setRegisterOtpSent(false);
        setRegisterResendTimer(0);

        setMessage("");
        setError("");
    };

    // =====================================================
    // LOGIN EMAIL RESET
    // =====================================================

    const changeLoginEmail = () => {
        setOtpSent(false);
        setOtp("");
        setResendTimer(0);
        setMessage("");
        setError("");
    };

    // =====================================================
    // REGISTER EMAIL RESET
    // =====================================================

    const changeRegisterEmail = () => {
        setRegisterOtpSent(false);
        setRegisterOtp("");
        setRegisterResendTimer(0);
        setMessage("");
        setError("");
    };

    // =====================================================
    // REGISTER UI
    // =====================================================

    if (registerMode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center px-4 py-8 md:py-12">

                <div className="w-full max-w-6xl">

                    <Paper
                        elevation={0}
                        className="overflow-hidden rounded-[28px] border border-white/10 shadow-2xl"
                        sx={{
                            backgroundColor: "#ffffff",
                        }}
                    >

                        <div className="grid lg:grid-cols-2">

                            {/* =================================================
                                LEFT BRAND PANEL
                            ================================================= */}

                            <div className="hidden lg:flex relative min-h-[700px] overflow-hidden bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-700 p-12 text-white">

                                {/* Decorative circles */}

                                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

                                <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10" />

                                <div className="absolute right-16 bottom-20 h-28 w-28 rounded-full border border-white/20" />

                                <div className="relative z-10 flex flex-col justify-between w-full">

                                    <div>
                                        <div className="flex items-center gap-3">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl font-black text-violet-600 shadow-xl">
                                                A
                                            </div>

                                            <div>
                                                <div className="text-xl font-black tracking-tight">
                                                    Amar Bazaar
                                                </div>

                                                <div className="text-xs text-white/70">
                                                    Everything you need
                                                </div>
                                            </div>

                                        </div>

                                        <div className="mt-24 max-w-md">

                                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                                                ✨ JOIN THE MARKETPLACE
                                            </div>

                                            <h2 className="text-5xl font-black leading-[1.05]">
                                                Your shopping
                                                <br />
                                                journey starts
                                                <br />
                                                <span className="text-pink-200">
                                                    here.
                                                </span>
                                            </h2>

                                            <p className="mt-6 max-w-sm text-base leading-7 text-white/75">
                                                Create your Amar Bazaar
                                                account and discover a
                                                smarter, simpler way to shop.
                                            </p>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-3 gap-4">

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                            <div className="text-xl">
                                                🛍️
                                            </div>
                                            <div className="mt-2 text-xs font-semibold text-white/70">
                                                Wide Selection
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                            <div className="text-xl">
                                                🔒
                                            </div>
                                            <div className="mt-2 text-xs font-semibold text-white/70">
                                                Secure Login
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                            <div className="text-xl">
                                                ⚡
                                            </div>
                                            <div className="mt-2 text-xs font-semibold text-white/70">
                                                Fast Checkout
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>

                            {/* =================================================
                                RIGHT REGISTER FORM
                            ================================================= */}

                            <div className="bg-white px-5 py-8 sm:px-10 md:px-14 lg:px-12 xl:px-16">

                                <div className="mx-auto max-w-md">

                                    {/* Mobile Logo */}

                                    <div className="mb-8 flex items-center gap-3 lg:hidden">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 text-xl font-black text-white">
                                            A
                                        </div>

                                        <div>
                                            <div className="font-black text-slate-900">
                                                Amar Bazaar
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Your marketplace
                                            </div>
                                        </div>

                                    </div>

                                    {/* Heading */}

                                    <div className="mb-7">

                                        <div className="mb-3 inline-flex items-center rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                                            CREATE ACCOUNT
                                        </div>

                                        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                            Join Amar Bazaar
                                        </h1>

                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            Create your account and start
                                            exploring thousands of products.
                                        </p>

                                    </div>

                                    {/* Alerts */}

                                    {message && (
                                        <Alert
                                            severity="success"
                                            variant="filled"
                                            className="mb-5"
                                            sx={{
                                                borderRadius: "14px",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {message}
                                        </Alert>
                                    )}

                                    {error && (
                                        <Alert
                                            severity="error"
                                            variant="filled"
                                            className="mb-5"
                                            sx={{
                                                borderRadius: "14px",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {error}
                                        </Alert>
                                    )}

                                    <form
                                        onSubmit={
                                            registerOtpSent
                                                ? handleRegister
                                                : requestRegisterOtp
                                        }
                                        className="space-y-5"
                                    >

                                        {/* Full Name */}

                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            placeholder="Enter your full name"
                                            value={fullName}
                                            disabled={
                                                registerOtpSent ||
                                                loading
                                            }
                                            onChange={(event) =>
                                                setFullName(
                                                    event.target.value
                                                )
                                            }
                                            autoComplete="name"
                                            sx={textFieldSx}
                                        />

                                        {/* Email */}

                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            placeholder="you@example.com"
                                            type="email"
                                            value={registerEmail}
                                            disabled={
                                                registerOtpSent ||
                                                loading
                                            }
                                            onChange={(event) =>
                                                setRegisterEmail(
                                                    event.target.value
                                                )
                                            }
                                            autoComplete="email"
                                            sx={textFieldSx}
                                        />

                                        {/* OTP */}

                                        {registerOtpSent && (
                                            <div className="space-y-4">

                                                <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">

                                                    <div className="mb-3 flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg">
                                                            ✉️
                                                        </div>

                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">
                                                                Verify your email
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                OTP sent to{" "}
                                                                {registerEmail}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <TextField
                                                        fullWidth
                                                        label="Enter OTP"
                                                        placeholder="Enter verification code"
                                                        value={registerOtp}
                                                        onChange={(event) =>
                                                            setRegisterOtp(
                                                                event.target.value.replace(
                                                                    /\D/g,
                                                                    ""
                                                                )
                                                            )
                                                        }
                                                        slotProps={{
                                                            htmlInput: {
                                                                maxLength: 8,
                                                                inputMode:
                                                                    "numeric",
                                                            },
                                                        }}
                                                        autoFocus
                                                        sx={textFieldSx}
                                                    />

                                                </div>

                                                <div className="flex items-center justify-between px-1">

                                                    <span className="text-xs text-slate-500">
                                                        Didn't receive the OTP?
                                                    </span>

                                                    {registerResendTimer >
                                                    0 ? (
                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                                                            Resend in{" "}
                                                            {
                                                                registerResendTimer
                                                            }
                                                            s
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                loading
                                                            }
                                                            onClick={
                                                                resendRegisterOtp
                                                            }
                                                            className="text-sm font-bold text-violet-600 transition hover:text-pink-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            Resend OTP
                                                        </button>
                                                    )}

                                                </div>

                                            </div>
                                        )}

                                        {/* Button */}

                                        <Button
                                            fullWidth
                                            size="large"
                                            variant="contained"
                                            type="submit"
                                            disabled={loading}
                                            sx={
                                                primaryButtonSx
                                            }
                                        >
                                            {loading ? (
                                                <CircularProgress
                                                    size={22}
                                                    color="inherit"
                                                />
                                            ) : registerOtpSent ? (
                                                "Create Account"
                                            ) : (
                                                "Send Registration OTP"
                                            )}
                                        </Button>

                                        {/* Change Email */}

                                        {registerOtpSent && (
                                            <button
                                                type="button"
                                                className="w-full text-center text-sm font-bold text-violet-600 transition hover:text-pink-600 hover:underline"
                                                onClick={
                                                    changeRegisterEmail
                                                }
                                            >
                                                ← Change email
                                            </button>
                                        )}

                                    </form>

                                    {/* Login */}

                                    <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                                        <span className="text-sm text-slate-500">
                                            Already have an account?
                                        </span>

                                        <button
                                            type="button"
                                            className="ml-2 text-sm font-black text-violet-600 hover:text-pink-600 hover:underline"
                                            onClick={
                                                switchToLogin
                                            }
                                        >
                                            Login
                                        </button>

                                    </div>

                                    {/* Security */}

                                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                                        <span>🔒</span>
                                        <span>
                                            Your information is securely
                                            protected
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </Paper>

                    <p className="mt-5 text-center text-xs text-white/40">
                        © {new Date().getFullYear()} Amar Bazaar. All rights
                        reserved.
                    </p>

                </div>

            </div>
        );
    }

    // =====================================================
    // LOGIN UI
    // =====================================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center px-4 py-8 md:py-12">

            <div className="w-full max-w-6xl">

                <Paper
                    elevation={0}
                    className="overflow-hidden rounded-[28px] border border-white/10 shadow-2xl"
                    sx={{
                        backgroundColor: "#ffffff",
                    }}
                >

                    <div className="grid lg:grid-cols-2">

                        {/* =================================================
                            LEFT BRAND / HERO
                        ================================================= */}

                        <div className="hidden lg:flex relative min-h-[700px] overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-600 to-fuchsia-600 p-12 text-white">

                            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/10" />

                            <div className="absolute -bottom-36 -left-28 h-96 w-96 rounded-full bg-white/10" />

                            <div className="absolute right-20 top-1/2 h-24 w-24 rounded-full border border-white/20" />

                            <div className="relative z-10 flex w-full flex-col justify-between">

                                {/* Logo */}

                                <div className="flex items-center gap-3">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl font-black text-violet-600 shadow-xl">
                                        A
                                    </div>

                                    <div>
                                        <div className="text-xl font-black tracking-tight">
                                            Amar Bazaar
                                        </div>

                                        <div className="text-xs text-white/70">
                                            Your trusted marketplace
                                        </div>
                                    </div>

                                </div>

                                {/* Main Hero */}

                                <div className="max-w-lg">

                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                                        🛒 WELCOME BACK
                                    </div>

                                    <h2 className="text-5xl font-black leading-[1.05]">
                                        Shop smarter.
                                        <br />
                                        Live better.
                                        <br />
                                        <span className="text-pink-200">
                                            Every day.
                                        </span>
                                    </h2>

                                    <p className="mt-6 max-w-md text-base leading-7 text-white/75">
                                        Discover products you love, manage
                                        your orders and enjoy a seamless
                                        shopping experience with Amar Bazaar.
                                    </p>

                                    {/* Mini Product Cards */}

                                    <div className="mt-10 grid grid-cols-3 gap-3">

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                                            <div className="text-2xl">
                                                📱
                                            </div>

                                            <p className="mt-3 text-xs font-bold">
                                                Electronics
                                            </p>

                                            <p className="mt-1 text-[10px] text-white/60">
                                                Latest gadgets
                                            </p>

                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                                            <div className="text-2xl">
                                                👕
                                            </div>

                                            <p className="mt-3 text-xs font-bold">
                                                Fashion
                                            </p>

                                            <p className="mt-1 text-[10px] text-white/60">
                                                New styles
                                            </p>

                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                                            <div className="text-2xl">
                                                🏠
                                            </div>

                                            <p className="mt-3 text-xs font-bold">
                                                Home
                                            </p>

                                            <p className="mt-1 text-[10px] text-white/60">
                                                Make it yours
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* Bottom */}

                                <div className="flex items-center gap-5 text-xs text-white/60">

                                    <span>
                                        ✓ Secure checkout
                                    </span>

                                    <span>
                                        ✓ Trusted marketplace
                                    </span>

                                    <span>
                                        ✓ Easy returns
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            RIGHT LOGIN FORM
                        ================================================= */}

                        <div className="bg-white px-5 py-8 sm:px-10 md:px-14 lg:px-12 xl:px-16">

                            <div className="mx-auto max-w-md">

                                {/* Mobile Logo */}

                                <div className="mb-8 flex items-center gap-3 lg:hidden">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 text-xl font-black text-white">
                                        A
                                    </div>

                                    <div>
                                        <div className="font-black text-slate-900">
                                            Amar Bazaar
                                        </div>

                                        <div className="text-xs text-slate-500">
                                            Your trusted marketplace
                                        </div>
                                    </div>

                                </div>

                                {/* Header */}

                                <div className="mb-7">

                                    <div className="mb-3 inline-flex items-center rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                                        CUSTOMER LOGIN
                                    </div>

                                    <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                        Welcome back 👋
                                    </h1>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Login with your email and verify
                                        using a secure OTP.
                                    </p>

                                </div>

                                {/* Alerts */}

                                {message && (
                                    <Alert
                                        severity="success"
                                        variant="filled"
                                        className="mb-5"
                                        sx={{
                                            borderRadius: "14px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {message}
                                    </Alert>
                                )}

                                {error && (
                                    <Alert
                                        severity="error"
                                        variant="filled"
                                        className="mb-5"
                                        sx={{
                                            borderRadius: "14px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                {/* Login Form */}

                                <form
                                    onSubmit={
                                        otpSent
                                            ? handleLogin
                                            : requestOtp
                                    }
                                    className="space-y-5"
                                >

                                    {/* Email */}

                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        placeholder="you@example.com"
                                        type="email"
                                        value={email}
                                        disabled={
                                            otpSent ||
                                            loading
                                        }
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        autoComplete="email"
                                        sx={textFieldSx}
                                    />

                                    {/* OTP */}

                                    {otpSent && (
                                        <div className="space-y-4">

                                            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">

                                                <div className="mb-3 flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg">
                                                        🔐
                                                    </div>

                                                    <div>

                                                        <p className="text-sm font-bold text-slate-800">
                                                            Verify your login
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            OTP sent to{" "}
                                                            {email}
                                                        </p>

                                                    </div>

                                                </div>

                                                <TextField
                                                    fullWidth
                                                    label="Enter OTP"
                                                    placeholder="Enter verification code"
                                                    value={otp}
                                                    onChange={(event) =>
                                                        setOtp(
                                                            event.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                        )
                                                    }
                                                    slotProps={{
                                                        htmlInput: {
                                                            maxLength: 8,
                                                            inputMode:
                                                                "numeric",
                                                        },
                                                    }}
                                                    autoFocus
                                                    sx={textFieldSx}
                                                />

                                            </div>

                                            {/* Resend */}

                                            <div className="flex items-center justify-between px-1">

                                                <span className="text-xs text-slate-500">
                                                    Didn't receive the OTP?
                                                </span>

                                                {resendTimer >
                                                0 ? (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                                                        Resend in{" "}
                                                        {
                                                            resendTimer
                                                        }
                                                        s
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            loading
                                                        }
                                                        onClick={
                                                            resendLoginOtp
                                                        }
                                                        className="text-sm font-bold text-violet-600 transition hover:text-pink-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Resend OTP
                                                    </button>
                                                )}

                                            </div>

                                        </div>
                                    )}

                                    {/* Main Button */}

                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        type="submit"
                                        disabled={loading}
                                        sx={
                                            primaryButtonSx
                                        }
                                    >
                                        {loading ? (
                                            <CircularProgress
                                                size={22}
                                                color="inherit"
                                            />
                                        ) : otpSent ? (
                                            "Login to Amar Bazaar"
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </Button>

                                    {/* Change Email */}

                                    {otpSent && (
                                        <button
                                            type="button"
                                            className="w-full text-center text-sm font-bold text-violet-600 transition hover:text-pink-600 hover:underline"
                                            onClick={
                                                changeLoginEmail
                                            }
                                        >
                                            ← Use a different email
                                        </button>
                                    )}

                                </form>

                                {/* Divider */}

                                <div className="my-7 flex items-center gap-4">

                                    <div className="h-px flex-1 bg-slate-100" />

                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        New to Amar Bazaar?
                                    </span>

                                    <div className="h-px flex-1 bg-slate-100" />

                                </div>

                                {/* Create Account */}

                                <button
                                    type="button"
                                    onClick={
                                        switchToRegister
                                    }
                                    className="w-full rounded-[14px] border-2 border-slate-200 bg-white py-3.5 text-sm font-black text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                                >
                                    Create New Account
                                </button>

                                {/* Trust */}

                                <div className="mt-7 grid grid-cols-3 gap-2">

                                    <div className="rounded-xl bg-slate-50 p-3 text-center">

                                        <div className="text-base">
                                            🔒
                                        </div>

                                        <div className="mt-1 text-[10px] font-bold text-slate-500">
                                            Secure
                                        </div>

                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3 text-center">

                                        <div className="text-base">
                                            ⚡
                                        </div>

                                        <div className="mt-1 text-[10px] font-bold text-slate-500">
                                            Fast
                                        </div>

                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3 text-center">

                                        <div className="text-base">
                                            🛍️
                                        </div>

                                        <div className="mt-1 text-[10px] font-bold text-slate-500">
                                            Trusted
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </Paper>

                <p className="mt-5 text-center text-xs text-white/40">
                    © {new Date().getFullYear()} Amar Bazaar. All rights
                    reserved.
                </p>

            </div>

        </div>
    );
};

export default Login;