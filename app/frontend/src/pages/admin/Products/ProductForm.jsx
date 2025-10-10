// src/pages/admin/Products/ProductForm.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";

// Props: mode="create" | "edit", defaultValues={...}, onSubmit
export default function ProductForm({ mode = "create", defaultValues = {}, onSubmit }) {
  const { handleSubmit, control, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category_id: "",
      images: [],
      ...defaultValues,
    },
  });

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const images = watch("images");

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      is_primary: false,
    }));
    setValue("images", [...images, ...imagesWithPreview]);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setValue("images", updated);
  };

  // Set primary image
  const handleSetPrimary = (index) => {
    const updated = images.map((img, idx) => ({
      ...img,
      is_primary: idx === index,
    }));
    setValue("images", updated);
  };

  const submitForm = async (data) => {
    try {
      await onSubmit(data);
      enqueueSnackbar(`Product ${mode === "create" ? "created" : "updated"} successfully!`, {
        variant: "success",
      });
      navigate("/admin/products");
    } catch (err) {
      enqueueSnackbar(err.message || "Something went wrong!", { variant: "error" });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        {mode === "create" ? "Add New Product" : "Edit Product"}
      </Typography>

      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>

          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Title"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Description" multiline rows={4} fullWidth />
            )}
          />

          <Controller
            name="price"
            control={control}
            rules={{ required: "Price is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Price (MAD)"
                type="number"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="category_id"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Category ID"
                type="number"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Images Upload */}
          <Stack spacing={1}>
            <Typography variant="subtitle1">Images</Typography>
            <Button variant="outlined" component="label" startIcon={<Add />}>
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>

            <Stack direction="row" spacing={1} mt={1}>
              {images.map((img, idx) => (
                <Box key={idx} position="relative">
                  <Avatar
                    src={img.preview || img.image_path}
                    variant="rounded"
                    sx={{ width: 100, height: 100 }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0, bgcolor: "white" }}
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <Chip
                    label="Primary"
                    color={img.is_primary ? "primary" : "default"}
                    size="small"
                    onClick={() => handleSetPrimary(idx)}
                    sx={{ mt: 1, cursor: "pointer", textAlign: "center" }}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>

          {/* Submit */}
          <Button type="submit" variant="contained" color="primary">
            {mode === "create" ? "Create Product" : "Update Product"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
