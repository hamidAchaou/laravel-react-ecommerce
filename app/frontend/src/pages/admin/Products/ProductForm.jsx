// src/pages/admin/Products/ProductForm.jsx
import React from "react";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Grid,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";

// ✅ Custom UI components
import { AppInput, AppTextarea, AppSelect, AppButton } from "../../../components/admin/ui";

export default function ProductForm({ mode = "create", defaultValues = {}, onSubmit }) {
  const theme = useTheme();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
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

  /** ✅ Handle image upload */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      is_primary: false,
    }));
    setValue("images", [...images, ...imagesWithPreview]);
  };

  /** ✅ Remove image */
  const handleRemoveImage = (index) => {
    setValue("images", images.filter((_, i) => i !== index));
  };

  /** ✅ Set primary image */
  const handleSetPrimary = (index) => {
    setValue(
      "images",
      images.map((img, idx) => ({ ...img, is_primary: idx === index }))
    );
  };

  /** ✅ Form submission */
  const submitForm = async (data) => {
    try {
      await onSubmit(data);
      enqueueSnackbar(
        `Product ${mode === "create" ? "created" : "updated"} successfully!`,
        { variant: "success" }
      );
      navigate("/admin/products");
    } catch (err) {
      enqueueSnackbar(err.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  /** ✅ Colors based on light/dark mode */
  const bgColor = theme.palette.mode === "dark" ? theme.palette.background.paper : theme.palette.background.default;
  const surfaceColor = theme.palette.mode === "dark" ? theme.palette.background.paper : theme.palette.background.paper;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

  return (
    <Box
      className="p-6 flex justify-center min-h-screen"
      sx={{ backgroundColor: bgColor }}
    >
      <Card
        className="w-full max-w-3xl shadow-md rounded-2xl border"
        sx={{ borderColor: theme.palette.divider, backgroundColor: surfaceColor }}
      >
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={600} color={textPrimary}>
              {mode === "create" ? "Add New Product" : "Edit Product"}
            </Typography>
          }
          subheader={
            <Typography color={textSecondary}>Fill out the product details below</Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit(submitForm)}>
            <Stack spacing={3}>
              {/* ✅ Title */}
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field, fieldState }) => (
                  <AppInput {...field} label="Title" error={fieldState.error} />
                )}
              />

              {/* ✅ Description */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <AppTextarea {...field} label="Description" rows={4} />
                )}
              />

              {/* ✅ Price */}
              <Controller
                name="price"
                control={control}
                rules={{ required: "Price is required" }}
                render={({ field, fieldState }) => (
                  <AppInput
                    {...field}
                    label="Price (MAD)"
                    type="number"
                    error={fieldState.error}
                  />
                )}
              />

              {/* ✅ Category */}
              <Controller
                name="category_id"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field, fieldState }) => (
                  <AppSelect
                    {...field}
                    label="Category"
                    error={fieldState.error}
                    options={[
                      { value: "1", label: "Electronics" },
                      { value: "2", label: "Fashion" },
                      { value: "3", label: "Home & Kitchen" },
                    ]}
                  />
                )}
              />

              {/* ✅ Images Upload */}
              <Box>
                <Typography variant="subtitle1" fontWeight={500} mb={1} color={textPrimary}>
                  Product Images
                </Typography>
                <AppButton
                  variant="outlined"
                  color="primary"
                  startIcon={<Add />}
                  component="label"
                  sx={{
                    backgroundColor: theme.palette.mode === "dark" ? "#1E293B" : "#fff",
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? "#2c3e50" : "#f3f4f6",
                    },
                  }}
                >
                  Upload Images
                  <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                </AppButton>

                {images?.length > 0 && (
                  <Grid container spacing={2} mt={2}>
                    {images.map((img, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <Box className="relative">
                          <Avatar
                            src={img.preview || img.image_path}
                            variant="rounded"
                            sx={{
                              width: "100%",
                              height: 120,
                              borderRadius: 2,
                              boxShadow: 1,
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: theme.palette.mode === "dark" ? "#374151" : "white",
                              "&:hover": {
                                backgroundColor: theme.palette.mode === "dark" ? "#4B5563" : "#f3f4f6",
                              },
                            }}
                            onClick={() => handleRemoveImage(idx)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>

                          <Chip
                            label="Primary"
                            color={img.is_primary ? "primary" : "default"}
                            size="small"
                            onClick={() => handleSetPrimary(idx)}
                            sx={{
                              mt: 1,
                              cursor: "pointer",
                              fontWeight: 500,
                              width: "100%",
                              textAlign: "center",
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              {/* ✅ Submit Button */}
              <Box textAlign="right" mt={3}>
                <AppButton type="submit" color="primary" variant="contained" loading={isSubmitting}>
                  {mode === "create" ? "Create Product" : "Update Product"}
                </AppButton>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
