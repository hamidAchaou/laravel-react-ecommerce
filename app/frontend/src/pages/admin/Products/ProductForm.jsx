// src/pages/admin/Products/ProductForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Grid,
  useTheme,
  CardMedia,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import {
  AppInput,
  AppTextarea,
  AppSelect,
  AppButton,
} from "../../../components/admin/ui";
import { fetchCategories } from "../../../features/categories/categoriesTunks";

export default function ProductForm({
  mode = "create",
  defaultValues = {},
  onSubmit,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { items: categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.categories || {}
  );

  /** Initialize form with default category if available */
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
      stock: 0,
      category_id: defaultValues?.category?.id?.toString() || "",
      images: [],
      ...defaultValues,
    },
  });

  const images = watch("images");
  const [mainImage, setMainImage] = useState(null);

  /** Fetch categories on mount */
  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  /** Prefill category & images when editing */
  useEffect(() => {
    if (mode === "update" && defaultValues) {
      // Prefill category_id if category object exists
      if (defaultValues.category?.id) {
        setValue("category_id", String(defaultValues.category.id));
      }

      // Prefill images if they exist
      if (defaultValues.images?.length) {
        const formattedImages = defaultValues.images.map((img) => ({
          ...img,
          preview: img.image_path,
        }));
        setValue("images", formattedImages);

        const primary = formattedImages.find((img) => img.is_primary);
        setMainImage(primary ? primary.preview : formattedImages[0].preview);
      }
    }
  }, [mode, defaultValues, setValue]);

  /** Handle image upload */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagesWithPreview = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      is_primary: index === 0 && !mainImage,
    }));

    const newImages = [...images, ...imagesWithPreview];
    setValue("images", newImages);
    if (!mainImage && newImages.length > 0) setMainImage(newImages[0].preview);
  };

  /** Remove image */
  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
  
    let newMain = null;
    if (updated.length > 0) {
      const primary = updated.find((img) => img.is_primary);
      if (primary) {
        newMain = primary.preview || primary.image_path;
      } else {
        updated[0].is_primary = true;
        newMain = updated[0].preview || updated[0].image_path;
      }
    }
  
    setValue("images", updated);
    setMainImage(newMain);
  };
  

  /** Set main image */
  const handleSetMainImage = (img) => {
    const updatedImages = images.map((i) => ({
      ...i,
      is_primary: i === img,
    }));
    setValue("images", updatedImages);
    setMainImage(img.preview || img.image_path);
  };

  /** Submit form */
  const submitForm = async (data) => {
    try {
      const primaryIndex = data.images.findIndex((img) => img.is_primary);
      data.primary_image_index = primaryIndex >= 0 ? primaryIndex : null; // null إذا لا يوجد صور
  
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
  

  /** Category options */
  const categoryOptions =
    categories.length > 0
      ? categories.map((cat) => ({
          value: cat.id.toString(),
          label: cat.name,
        }))
      : defaultValues.category
      ? [
          {
            value: defaultValues.category.id.toString(),
            label: defaultValues.category.name,
          },
        ]
      : [];

  return (
    <Box className="p-6 flex justify-center min-h-screen">
      <Card
        className="w-full max-w-3xl shadow-md rounded-2xl border"
        sx={{
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={600}>
              {mode === "create" ? "Add New Product" : "Edit Product"}
            </Typography>
          }
          subheader="Fill out the product details below"
        />

        <CardContent>
          <form onSubmit={handleSubmit(submitForm)}>
            <Stack spacing={3}>
              {/* Title */}
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field, fieldState }) => (
                  <AppInput {...field} label="Title" error={fieldState.error} />
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <AppTextarea {...field} label="Description" rows={4} />
                )}
              />

              {/* Price */}
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

              {/* Stock */}
              <Controller
                name="stock"
                control={control}
                rules={{ required: "Stock is required" }}
                render={({ field, fieldState }) => (
                  <AppInput
                    {...field}
                    label="Stock"
                    type="number"
                    error={fieldState.error}
                  />
                )}
              />

              {/* Category */}
              <Controller
                name="category_id"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field, fieldState }) => (
                  <AppSelect
                    {...field}
                    label="Category"
                    error={fieldState.error}
                    options={categoryOptions}
                    loading={categoriesLoading}
                  />
                )}
              />

              {/* Image Upload */}
              <Box>
                <Typography variant="subtitle1" fontWeight={500} mb={1}>
                  Product Images
                </Typography>
                <AppButton
                  variant="outlined"
                  color="primary"
                  startIcon={<Add />}
                  component="label"
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </AppButton>

                {/* Main Image */}
                {mainImage && (
                  <CardMedia
                    component="img"
                    src={mainImage}
                    alt="Main Product"
                    sx={{
                      width: "50%",
                      height: 300,
                      objectFit: "cover",
                      borderRadius: 3,
                      mt: 3,
                      mx: "auto",
                      boxShadow: 2,
                    }}
                  />
                )}

                {/* Thumbnails */}
                {/* Thumbnails */}
                {images?.length > 0 && (
                  <Grid container spacing={2} mt={2} justifyContent="center">
                    {images.map((img, idx) => (
                      <Grid item xs={4} sm={3} md={2} key={idx}>
                        <Box position="relative" textAlign="center">
                          <Avatar
                            src={img.preview || img.image_path}
                            variant="rounded"
                            sx={{
                              width: "100%",
                              height: 80,
                              borderRadius: 2,
                              boxShadow: 1,
                              cursor: "pointer",
                              border: img.is_primary
                                ? `2px solid ${theme.palette.primary.main}`
                                : "2px solid transparent",
                              transition: "all 0.2s",
                            }}
                            onClick={() => handleSetMainImage(img)}
                          />

                          {/* Delete Button */}
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "#374151"
                                  : "white",
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? "#4B5563"
                                    : "#f3f4f6",
                              },
                            }}
                            onClick={() => handleRemoveImage(idx)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>

                          {/* Primary Label */}
                          {img.is_primary && (
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 1,
                                display: "block",
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                              }}
                            >
                              Primary
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              {/* Submit */}
              <Box textAlign="right" mt={3}>
                <AppButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  loading={isSubmitting}
                >
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
