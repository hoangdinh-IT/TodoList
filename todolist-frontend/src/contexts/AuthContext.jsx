import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true); // ✅ ban đầu là true

    useEffect(() => {
        const savedUser = sessionStorage.getItem("user");
        const savedToken = sessionStorage.getItem("token");

        if (savedUser && savedToken) {
            setUser({ username: savedUser });
            setToken(savedToken);
        }

        setLoading(false); // ✅ hoàn tất kiểm tra storage
    }, []);

    const login = (username, token) => {
        sessionStorage.setItem("user", username);
        sessionStorage.setItem("token", token);
        setUser({ username });
        setToken(token);
    }

    const logout = () => {
        setUser(null);
        setToken("");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            { children }
        </AuthContext.Provider>
    );
}

const useAuth = () => useContext(AuthContext);

export {
    AuthProvider,
    useAuth
}
