import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Typography,
  useTheme,
  Avatar,
  Button,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../../features/categories/categoriesThunks";
import { AppInput, AppSelect, AppButton } from "../../../components/admin/ui";
import { useNavigate } from "react-router-dom";

export default function CategoryForm({ mode = "create", defaultValues = {}, onSubmit }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories = [], loading } = useSelector((state) => state.categories);

  const { handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: defaultValues.name || "",
      description: defaultValues.description || "",
      parent_id: defaultValues.parent_id ? String(defaultValues.parent_id) : "",
      type: defaultValues.type || "product",
      image: null,
    },
  });

  const [imagePreview, setImagePreview] = useState(defaultValues.image_url || null);
  const [submitError, setSubmitError] = useState(null);

  // Fetch categories if empty
  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      setValue("name", defaultValues.name || "");
      setValue("description", defaultValues.description || "");
      setValue("parent_id", defaultValues.parent_id ? String(defaultValues.parent_id) : "");
      setValue("type", defaultValues.type || "product");
    }
  }, [defaultValues, mode, setValue]);

  // Parent options for select
  const parentOptions = useMemo(() => {
    return categories
      .filter((c) => c.name !== defaultValues.name) // exclude self
      .map((c) => ({ value: String(c.id || c.parent_id || ""), label: c.name }));
  }, [categories, defaultValues.name]);

  const typeOptions = [
    { value: "product", label: "Product" },
    { value: "service", label: "Service" },
  ];

  // Handle image selection
  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setSubmitError("Please select a valid image file (jpg, jpeg, png, webp)");
        return;
      }
      if (file.size > 2048 * 1024) {
        setSubmitError("Image size must be less than 2MB");
        return;
      }
      setSubmitError(null);
      setImagePreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  // Submit handler
  const handleFormSubmit = async (data) => {
    setSubmitError(null);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("type", data.type || "product");
    if (data.parent_id) formData.append("parent_id", data.parent_id);
    if (data.image instanceof File) formData.append("image", data.image);

    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error.message || "Failed to submit form");
    }
  };

  return (
    <Box className="p-6 flex justify-center min-h-screen" sx={{ bgcolor: theme.palette.background.default }}>
      <Card className="w-full max-w-3xl shadow-md rounded-2xl border" sx={{ borderColor: theme.palette.divider }}>
        <CardHeader
          title={<Typography variant="h5" fontWeight={600}>{mode === "create" ? "Add New Category" : "Edit Category"}</Typography>}
        />
        <CardContent>
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Stack spacing={3}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Category name is required" }}
                render={({ field }) => <AppInput {...field} label="Category Name" error={errors.name} fullWidth />}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => <AppInput {...field} label="Description" multiline rows={3} fullWidth />}
              />

              <Controller
                name="parent_id"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Parent Category"
                    options={[{ value: "", label: "None (Top Level)" }, ...parentOptions]}
                    loading={loading}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    value={field.value || "product"}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Type"
                    options={typeOptions}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography variant="subtitle1" mb={1}>
                      Category Image {mode === "edit" && "(Optional)"}
                    </Typography>
                    <Button variant="outlined" component="label">
                      {imagePreview ? "Change Image" : "Choose Image"}
                      <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" hidden onChange={(e) => handleImageChange(e, field.onChange)} />
                    </Button>
                    {imagePreview && (
                      <Box mt={2} display="flex" alignItems="center" gap={2}>
                        <Avatar src={imagePreview} alt="Preview" sx={{ width: 80, height: 80, borderRadius: 2 }} variant="rounded" />
                        <Typography variant="body2" color="text.secondary">Preview</Typography>
                      </Box>
                    )}
                  </Box>
                )}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>Cancel</Button>
                <AppButton type="submit" variant="contained" color="primary" loading={loading}>
                  {mode === "create" ? "Create Category" : "Update Category"}
                </AppButton>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
