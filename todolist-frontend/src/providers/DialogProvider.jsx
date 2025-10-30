import { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Xác nhận",
    cancelText: "Hủy",
    confirmColor: "primary",
    onConfirm: null,
    onCancel: null,
  });

  const showDialog = (options) => {
    // blur phần tử đang focus trước khi mở Dialog để tránh warning
    document.activeElement?.blur();

    setDialog({
      open: true,
      title: options.title || "Xác nhận",
      message: options.message || "",
      confirmText: options.confirmText || "Xác nhận",
      cancelText: options.cancelText || "Hủy",
      confirmColor: options.confirmColor || "primary",
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
    });
  };

  const handleClose = (confirmed) => {
    if (confirmed && dialog.onConfirm) dialog.onConfirm();
    if (!confirmed && dialog.onCancel) dialog.onCancel();
    setDialog((prev) => ({ ...prev, open: false }));
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}

      <Dialog
        open={dialog.open}
        onClose={() => handleClose(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        disableEnforceFocus={false}   // để mặc định, giữ focus trong dialog
        disableRestoreFocus={false}   // để mặc định, trả focus về nút mở dialog
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "12px",
            minWidth: "420px",
          },
        }}
      >
        <DialogTitle
          id="dialog-title"
          sx={{ fontSize: "1.3rem", fontWeight: "bold", pb: 2 }}
        >
          {dialog.title}
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ fontSize: "1.1rem", py: 2 }}
          id="dialog-description"
        >
          <Typography sx={{ fontSize: "1rem", lineHeight: 1.6 }}>
            {dialog.message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => handleClose(false)}
            sx={{ fontSize: "0.9rem", textTransform: "none", px: 2, py: 1 }}
          >
            {dialog.cancelText}
          </Button>
          <Button
            onClick={() => handleClose(true)}
            variant="contained"
            color={dialog.confirmColor}
            sx={{ fontSize: "0.9rem", textTransform: "none", px: 3, py: 1 }}
          >
            {dialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
