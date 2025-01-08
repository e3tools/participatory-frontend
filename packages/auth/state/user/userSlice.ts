import { createSlice } from "@reduxjs/toolkit";
import { User } from "../state.types"
import { getUser, getUsers, logIn, updateUser } from "./actions/user.action";

// see https://dev.to/ibrahimshamma99/a-simplified-prospective-in-sharing-redux-store-between-federated-react-apps-1kgm
interface UserState {
    users: User[]
    loading: boolean,
    loggedInUser: User | null,
    selectedUser: User | null,
    isAuthenticated: boolean,
    loginError: string
}

const initialState: () => UserState = () => ({
    users: [],
    loading: false,
    loggedInUser: null,
    selectedUser: null, 
    isAuthenticated: false,
    loginError: ''
});

const userSlice = createSlice({
    name: 'user',
    initialState: initialState(),
    reducers: {
        clearLoggedInUser: (state)=> {
            state.loggedInUser = null;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.loggedInUser = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        // get users
        builder
        .addCase(getUsers.pending, state => {
            state.loading = true;
            console.log("Getting 1...")
        })
        .addCase(getUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(getUsers.rejected, state => {
            state.loading = false;
        })

        // get user
        .addCase(getUser.pending, state => {
            state.loading = true;
            console.log("Getting 2...")
        })
        .addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedUser = action.payload;
        })
        .addCase(getUser.rejected, state => {
            state.loading = false;
        })

        // login
        .addCase(logIn.pending, state => { 
            state.loading = true;
            state.loggedInUser = null;
            state.isAuthenticated = false;
            console.log("Getting 3...")
        })
        .addCase(logIn.fulfilled, (state, action) => {
            state.loading = false;
            state.loggedInUser = action.payload?.loggedIn ? action.payload.user as User : null;
            state.isAuthenticated = action.payload?.loggedIn;
            state.loginError = action.payload?.loggedIn === false ? action.payload?.error as string : '';
        })
        .addCase(logIn.rejected, (state, action) => { 
            state.loading = false;
        })

        // update user
        .addCase(updateUser.pending, state => {
            state.loading = true;
            console.log("Getting 4...")
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            state.loggedInUser = action.payload;
            console.log("Loading: ", false)
        })
        .addCase(updateUser.rejected, state => {
            state.loading = false;
        })
    }
});

export const {
    clearLoggedInUser,
    logout
} = userSlice.actions

export { userSlice }

export default userSlice.reducer;