export const TOKEN_KEY = "sweetshop_token";

export const setToken = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

export const getToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

export const clearToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
    }
};
