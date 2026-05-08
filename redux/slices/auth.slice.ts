import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

/** Platform-level role (matches backend IUser) */
export type PlatformRole = "PLATFORM_ADMIN" | "USER" | "PROVIDER";
/** School-level role (matches backend IUser) */
export type SchoolRole = "SCHOOL_ADMIN" | "SCHOOL_MEMBER" | "NONE";

/** School details from login API (schoolDetails + derived profileImage) */
export interface SchoolDetails {
  name: string;
  gallery: string[];
  location: string;
  /** First image in gallery – use as school profile image */
  profileImage: string | null;
}

/** User shape from login/register API – no password or tokens */
export interface User {
  id: string;
  name: string;
  email: string;
  platformRole: PlatformRole;
  isSubscriber: boolean;
  school: string | null;
  schoolRole: SchoolRole;
  profileImage: string | null;
  lastLogin: string | null;
  /** Optional school details */
  schoolDetails?: SchoolDetails | null;
  /** Shared with main-site auth / onboarding flows */
  isEmailVerified?: boolean;
  adminApproval?: boolean;
  doneStatus?: string;
}

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  authLoading: boolean;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  authLoading: true,
  isAuthenticated: false,
};

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.user) {
      return { user: state.auth.user, accessToken: state.auth.accessToken };
    }
    return { user: null, accessToken: null };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },

    login: (
      state,
      action: PayloadAction<{ user: User; accessToken?: string | null }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken ?? null;
      state.authLoading = false;
      state.isAuthenticated = !!action.payload.user;
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.authLoading = false;
      state.isAuthenticated = !!action.payload.user;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.authLoading = false;
      state.isAuthenticated = false;
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.authLoading = false;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.authLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.authLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  login,
  loginSuccess,
  logout,
  setUser,
  updateUser,
  setAuthLoading,
} = authSlice.actions;
export default authSlice.reducer;
