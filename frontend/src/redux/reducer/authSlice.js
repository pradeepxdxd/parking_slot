import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    _id : "",
    name : "",
    email : "",
    contact : "",
    token : "",
    img : ""
}

export const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        authInfo : (state, action) => {
            return {
                ...state,
                _id : action.payload._id,
                name : action.payload.userName,
                email : action.payload.email,
                contact : action.payload.contact,
                token : action.payload.token,
                img : action.payload.profileImage,
            }
        }
    }
})

export const { authInfo } = authSlice.actions;

export default authSlice.reducer;