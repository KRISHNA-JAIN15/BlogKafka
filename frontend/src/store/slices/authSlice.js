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
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
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

        // Handle unverified user case
        if (action.payload.email && action.payload.userId) {
          state.pendingVerification = action.payload.email;
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
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
        state.message = "Logout successful";
        state.pendingVerification = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear the state
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.pendingVerification = null;
      });
  },
});

export const {
  clearError,
  clearMessage,
  setPendingVerification,
  clearPendingVerification,
  loadUserFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
