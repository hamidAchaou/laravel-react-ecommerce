// src/components/admin/common/DeleteConfirmationModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";

/**
 * Reusable Delete Confirmation Modal
 * Clean UI + motion + accessibility
 */
export default function DeleteConfirmationModal({
  open,
  handleClose,
  handleDeleteConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.25 },
        sx: { borderRadius: 3, p: 1.5 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: "text.primary" }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="flex-end"
          sx={{ width: "100%", p: 1 }}
        >
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
