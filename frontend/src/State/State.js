import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: null,
    token: null,
    posts: [],
    error: null,

}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setError: (state, action) => {
            state.error = action.payload.error;
        },

    }
});


export const { setMode, setLogin, setLogout, setError, setLoginError } = authSlice.actions;

export default authSlice.reducer;