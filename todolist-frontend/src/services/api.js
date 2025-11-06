import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor để tự động thêm token vào header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 408) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const authAPI = {
    login: async ({ username, password }) => {
        try {
            const response = await API.post("/api/auth/login", {
                username,
                password
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    register: async ({ username, password }) => {
        try {
            const response = await API.post("/api/auth/register", {
                username,
                password
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    changePassword: async({ username, oldPassword, newPassword }) => {
        try {
            const reponse = await API.post("/api/auth/change-password", {
                username, oldPassword, newPassword
            });
            return reponse.data;
        } catch (err) {
            throw err;
        }
    },

    sendOtp: async(username) => {
        try {
            const response = await API.post("/api/auth/send-otp", {
                email: username
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    verifyOtp: async({ username, otp }) => {
        try {
            const response = await API.post("/api/auth/verify-otp", {
                email: username,
                otp
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    resetPassword: async({ username, otp, newPassword }) => {
        try {
            const response = await API.post("/api/auth/reset-password", {
                email: username,
                otp,
                newPassword
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
}

const taskAPI = {
    create: async ({ title, description, deadline, categoryId }) => {
        try {
            const response = await API.post("/api/tasks/", {
                title,
                description,
                deadline,
                categoryId
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    getAll: async () => {
        try {
            const response = await API.get("/api/tasks");
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    getById: async (taskId) => {
        try {
            const response = await API.get(`/api/tasks/${taskId}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    update: async ({ taskId, title, description, deadline, categoryId }) => {
        try {
            const response = await API.put(`/api/tasks/${taskId}`, {
                title,
                description,
                deadline,
                categoryId
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    delete: async (taskId) => {
        try {
            const response = await API.delete(`/api/tasks/${taskId}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    updateCompleted: async (taskId, completed) => {
        try {
            const response = await API.put(`/api/tasks/update-completed/${taskId}`, {
                completed
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    getTasksByCategory: async (categoryId) => {
        try {
            const response = await API.get("/api/tasks/categoryId", {
                params: { categoryId }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
}

const categoryAPI = {
    create: async ({ title }) => {
        try {
            const response = await API.post("/api/categories", {
                title
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    getAll: async () => {
        try {
            const response = await API.get("/api/categories");
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    getById: async (categoryId) => {
        try {
            const response = await API.get(`api/categories/${categoryId}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    },
    
    update: async ({ categoryId, title }) => {
        try {
            const response = await API.put(`/api/categories/${categoryId}`, {
                title
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    delete: async (categoryId) => {
        try {
            const response = await API.delete(`/api/categories/${categoryId}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    updateOrder: async (orderData) => {
        try {
            const response = await API.put("/api/categories/update-order", {
                categories: orderData
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
}

export {
    authAPI,
    taskAPI,
    categoryAPI
}

export default API;