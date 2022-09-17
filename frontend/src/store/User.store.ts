import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import api from '../services/api';

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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadUser.pending, (state) => {
            state.loading = true;
            state.logged = false;
        });
        builder.addCase(loadUser.fulfilled, (state, action) => {
            state.loading = false;
            state.logged = true;
        });
        builder.addCase(loadUser.rejected, (state, action) => {
            state.loading = false;
            state.logged = false;
        });
    },
});

export default userSlice.reducer;
