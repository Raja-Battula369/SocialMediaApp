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
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error('Friends dont exists');
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatePost = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            })

            state.posts = updatePost;
        }
    }
});


export const { setMode, setLogin, setLogout, setFriends, setPost, setPosts, setError, setLoginError } = authSlice.actions;

export default authSlice.reducer;