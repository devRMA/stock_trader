import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from 'services/api';

export interface User {
    id: number;
    name: string;
    email: string;
    money: number;
    avatar?: string;
    two_factor: boolean;
    created_at: string;
    banned: boolean;
    bans: Array<{
        reason: string;
        created_at: string;
    }>;
}

export interface UserState {
    user: User;
    logged: boolean;
    loading: boolean;
}

const initialState: UserState = {
    user: {
        id: 0,
        name: 'devRMA',
        email: 'example@devrma.com',
        money: 1000,
        avatar: 'https://github.com/devRMA.png',
        two_factor: true,
        created_at: '2022-09-14',
        banned: false,
        bans: [],
    },
    logged: false,
    loading: false,
};

export const loadUser = createAsyncThunk('user/loadUser', async () => {
    const resp = await api.get<User>('/users/@me');

    return resp.data;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
    await api.get('/sanctum/csrf-cookie');
    await api.post('/logout');
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadUser.pending, (state) => {
            state.loading = true;
            state.logged = true;
        });
        builder.addCase(loadUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.logged = true;
            state.user = payload;
        });
        builder.addCase(loadUser.rejected, (state) => {
            state.loading = false;
            state.logged = false;
            state.user = initialState.user;
        });
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.logged = false;
        });
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.logged = false;
            state.user = initialState.user;
        });
        builder.addCase(logoutUser.rejected, (state) => {
            state.loading = false;
            state.logged = false;
            state.user = initialState.user;
        });
    },
});

export default userSlice.reducer;
