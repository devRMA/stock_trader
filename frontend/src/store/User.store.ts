import { createSlice } from '@reduxjs/toolkit';

export interface User {
    name: string;
    avatar?: string;
}

export interface UserState {
    user: User;
    logged: boolean;
    loading: boolean;
}

const initialState: UserState = {
    user: {
        name: 'devRMA',
        avatar: 'https://github.com/devRMA.png',
    },
    logged: false,
    loading: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
});

export default userSlice.reducer;
