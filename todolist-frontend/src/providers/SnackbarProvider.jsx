import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // success | error | warning | info
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "350px",
            maxWidth: "500px",
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{
            fontSize: "1rem",
            padding: "8px 12px",
            ...(snackbar.severity === "success" && {
              backgroundColor: "#19a71dff", 
              color: "#fff",             
              "& .MuiAlert-icon": { color: "#fff" },
            }),
            ...(snackbar.severity === "info" && {
              backgroundColor: "#2196f3",
              color: "#fff",
              "& .MuiAlert-icon": { color: "#fff" },
            }),
            ...(snackbar.severity === "warning" && {
              backgroundColor: "#c3c02aff", 
              color: "#fff",
              "& .MuiAlert-icon": { color: "#fff" },
            }),
            ...(snackbar.severity === "error" && {
              backgroundColor: "#f44336", 
              color: "#fff",
              "& .MuiAlert-icon": { color: "#fff" },
            }),
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);