import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:5000/api/users";

// Async thunks for API calls
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Signup failed");
      }

      return data;
    } catch (error) {
      console.error("Signup error:", error);
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue({ message: "Network error. Please try again." });
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email, verificationCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Verification failed");
      }

      return data;
    } catch (error) {
      console.error("Verification error:", error);
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const resendVerificationCode = createAsyncThunk(
  "auth/resendVerificationCode",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to resend code");
      }

      return data;
    } catch (error) {
      console.error("Resend code error:", error);
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear localStorage regardless of response
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (!response.ok) {
      // Even if logout fails on server, we clear local data
      console.warn("Server logout failed, but local logout completed");
    }

    return { message: "Logout successful" };
  } catch (error) {
    // Clear localStorage even on network error
    console.error("Logout error:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { message: "Logout completed locally" };
  }
});

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,
  message: null,
  pendingVerification: null, // Store email for users pending verification
  verificationSuccess: false,
  resendSuccess: false,
  loginError: false,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setPendingVerification: (state, action) => {
      state.pendingVerification = action.payload;
    },
    clearPendingVerification: (state) => {
      state.pendingVerification = null;
    },
    clearVerificationSuccess: (state) => {
      state.verificationSuccess = false;
    },
    clearResendSuccess: (state) => {
      state.resendSuccess = false;
    },
    clearLoginError: (state) => {
      state.loginError = false;
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          // Only allow authenticated state if user is verified
          if (parsedUser.isVerified) {
            state.token = token;
            state.user = parsedUser;
            state.isAuthenticated = true;
          } else {
            // Clear storage for unverified users
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            state.pendingVerification = parsedUser.email;
          }
        } catch (error) {
          // Clear corrupted data
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.pendingVerification = action.payload.email;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.pendingVerification = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.loginError = true; // Add flag for login error

        // Handle unverified user case - do NOT allow login
        if (action.payload.email && action.payload.userId) {
          state.pendingVerification = action.payload.email;
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          // Clear any stored auth data for unverified users
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      })

      // Verify email cases
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.pendingVerification = null;
        state.verificationSuccess = true; // Add flag for successful verification
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.verificationSuccess = false;
      })

      // Resend verification cases
      .addCase(resendVerificationCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resendVerificationCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.resendSuccess = true; // Add flag for successful resend
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.resendSuccess = false;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.message = null; // Remove automatic logout message
        state.pendingVerification = null;
        state.verificationSuccess = false;
        state.resendSuccess = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear the state
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.pendingVerification = null;
        state.verificationSuccess = false;
        state.resendSuccess = false;
      });
  },
});

export const {
  clearError,
  clearMessage,
  setPendingVerification,
  clearPendingVerification,
  loadUserFromStorage,
  clearVerificationSuccess,
  clearResendSuccess,
  clearLoginError,
} = authSlice.actions;

export default authSlice.reducer;
