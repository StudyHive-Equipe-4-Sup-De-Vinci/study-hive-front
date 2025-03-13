import React, {createContext, useContext, useEffect, useState} from "react";
import {getMeRequest, loginRequest, registerRequest} from "../api/auth";
// import { updateLastLoginManagedUser } from "../api/users";
import {UserCredential} from "../types/auth.type";
import axios from "axios";
import axiosI from "../axiosInterceptor";

type UserInfo =
    | {
    state: LoginState.LOGGED_OUT;
}
    | ({ state: LoginState.LOGGED_IN } & User);

export type User = {
    id: string;
    userName: string;
    lastLogin?: Date;
};

interface IAuthContext {
    userInfo: UserInfo | null;
    submitLogin: ({userName, password}: UserCredential) => Promise<AuthStatus>;
    logout: () => Promise<void>;
    submitRegister: ({
                         userName,
                         password,
                     }: UserCredential) => Promise<AuthStatus>;
    retrieveUserInfos: () => void;
}

export enum AuthStatus {
    OK,
    WRONG_CREDENTIALS,
    INVALID_FORMAT,
    LOGIN_UNAVAILABLE,
    ERROR,
}

export enum LoginState {
    LOGGED_IN,
    LOGGED_OUT,
}

const AuthContext = createContext<IAuthContext>({
    userInfo: null,
    submitLogin: async () => AuthStatus.ERROR,
    logout: async () => {
    },
    submitRegister: async () => AuthStatus.ERROR,
    retrieveUserInfos: async () => {
    },
});

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            setAccessToken(token);
        }
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);

            const interceptor = axiosI.interceptors.request.use((config) => {
                if (config?.headers && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            });

            updateUserInfo();

            return () => axiosI.interceptors.request.eject(interceptor);
        }
        updateUserInfo();
    }, [accessToken, isReady]);

    const retrieveUserInfos = async () => {
        if (!isReady) {
            return;
        }

        if (!accessToken) {
            setUserInfo({state: LoginState.LOGGED_OUT});
        }

        try {
            const me = await getMeRequest();
            if (me) {
                setUserInfo({
                    state: LoginState.LOGGED_IN,
                    ...(me as {
                        id: string;
                        userName: string;
                        refreshToken: string;
                    }),
                });
            } else {
                setUserInfo({state: LoginState.LOGGED_OUT});
            }
        } catch {
            setUserInfo({state: LoginState.LOGGED_OUT});
        }
    };
    const updateUserInfo = async () => {
        if (!isReady) {
            return;
        }

        if (!accessToken) {
            setUserInfo({state: LoginState.LOGGED_OUT});
        }
        try {
            const me = await getMeRequest();
            // const info = await updateLastLoginManagedUser();
            const info: User = {id: "idtest", userName: "test"};
            if (info) {
                setUserInfo({
                    state: LoginState.LOGGED_IN,
                    ...info,
                    lastLogin: me.lastLogin,
                });
            } else {
                setUserInfo({state: LoginState.LOGGED_OUT});
            }
        } catch (e) {
            setUserInfo({state: LoginState.LOGGED_OUT});
        }
    };
    const submitLogin = async ({
                                   userName,
                                   password,
                               }: UserCredential): Promise<AuthStatus> => {
        try {
            const result = await loginRequest(userName, password);

            if (!result) {
                //Unknown error
                return AuthStatus.ERROR;
            }
            setAccessToken(result.access_token);
            setUserInfo(null); //Forces router to wait until user data has been re-retrieved

            return AuthStatus.OK;
        } catch (err) {
            if (axios.isAxiosError(err) && err.request.status === 403) {
                //Wrong credentials
                return AuthStatus.WRONG_CREDENTIALS;
            }
            return AuthStatus.ERROR;
        }
    };
    const logout = async () => {
        setAccessToken(null);
        setUserInfo(null); //Forces router to wait until user data has been re-retrieved
        // updateLastLoginManagedUser();
        localStorage.setItem("accessToken", "");
    };
    const submitRegister = async ({
                                      userName,
                                      password,
                                  }: UserCredential): Promise<AuthStatus> => {
        try {
            const result = await registerRequest(userName, password);

            if (!result) {
                return AuthStatus.ERROR;
            }
            setAccessToken(result.access_token);
            return AuthStatus.OK;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.request.status === 400) {
                    //Wrong credentials
                    return AuthStatus.INVALID_FORMAT;
                }
                if (err.request.status === 409) {
                    //Email already used
                    return AuthStatus.LOGIN_UNAVAILABLE;
                }
            }
            return AuthStatus.ERROR;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userInfo,
                submitLogin,
                logout,
                submitRegister,
                retrieveUserInfos,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext<IAuthContext>(AuthContext);
