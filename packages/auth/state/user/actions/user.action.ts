import { createAsyncThunk } from "@reduxjs/toolkit";
import { useAuth } from "auth/contexts/auth";
import { DocTypeService } from "data-layer/services/doctype";
import { AuthService } from "../../../services/auth";
import { LoginCredentials, User } from "../../state.types";
import { LoginResponse } from "../../../types";

export const getUsers = createAsyncThunk(
    'user/getUsers',
    async () => {        
        const response = await new DocTypeService('User').get_all(['name', 'email']);
        return response;
    }
)

export const getUser = createAsyncThunk(
    'user/getUser',
    async (userId: string) => {        
        const response = await new DocTypeService('User').get_doc(userId);
        return response;
    }
)

export const logIn = createAsyncThunk(
    'user/logIn',
    async(data: LoginCredentials) : Promise<LoginResponse> => { 
        const { username, password } = data; 
        const response = await AuthService.login(username, password)
        return response;
    }
);

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async({userId, newPassword}: {userId: string, newPassword: string}) => {
         const res = await AuthService.change_password(
          userId,
          newPassword
        );
        return res;
    }
)

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async(user: User) => { 
        const res = await new DocTypeService('User').update_doc(user, user.name);    
        return res;
    }
)