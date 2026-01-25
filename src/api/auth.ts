import api from "./axiosInstance";

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export const loginUser = async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const registerUser = async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};

export const fetchMe = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};