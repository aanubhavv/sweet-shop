export const TOKEN_KEY = "sweetshop_token";

export interface JWTPayload {
    sub: string; // user email
    role?: string;
    exp?: number;
}

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

/**
 * Decode JWT token payload (for UI purposes only - not for security)
 */
export const decodeToken = (token: string): JWTPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

/**
 * Get current user info from token
 */
export const getCurrentUser = (): JWTPayload | null => {
    const token = getToken();
    if (!token) return null;
    return decodeToken(token);
};

/**
 * Check if current user is admin (for UI purposes only)
 */
export const isAdmin = (): boolean => {
    const user = getCurrentUser();
    return user?.role === 'admin';
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
    const user = getCurrentUser();
    if (!user?.exp) return true;
    return Date.now() >= user.exp * 1000;
};
