// src/pages/admin/Users/UsersForm.jsx
import React, { useEffect } from "react";
import { Box, Typography, Stack, Card, CardContent, CardHeader } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { AppInput, AppSelect, AppButton } from "../../../components/admin/ui";
import { createUser, updateUser } from "../../../features/users/usersThunks";

export default function UsersForm({ mode = "create", defaultValues = {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      password: "",
      role: defaultValues?.role || "customer",
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) reset(defaultValues);
  }, [mode, defaultValues, reset]);

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "seller", label: "Seller" },
    { value: "customer", label: "Customer" },
  ];

  const onSubmit = async (data) => {
    try {
      if (mode === "create") {
        await dispatch(createUser(data)).unwrap();
        enqueueSnackbar("User created successfully!", { variant: "success" });
      } else {
        const userId = defaultValues?.id; // safer access
        if (!userId) throw new Error("User ID missing for update.");
  
        await dispatch(updateUser({ id: userId, data })).unwrap();
        enqueueSnackbar("User updated successfully!", { variant: "success" });
      }
      navigate("/admin/users");
    } catch (err) {
      console.error("Update user error:", err);
      enqueueSnackbar(err?.message || "Error occurred", { variant: "error" });
    }
  };  

  return (
    <Box className="p-6 flex justify-center min-h-screen">
      <Card className="w-full max-w-2xl shadow-md rounded-2xl border">
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={600}>
              {mode === "create" ? "Add New User" : "Edit User"}
            </Typography>
          }
          subheader="Fill in user details below"
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Name */}
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field, fieldState }) => (
                  <AppInput {...field} label="Name" error={fieldState.error} />
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field, fieldState }) => (
                  <AppInput {...field} label="Email" error={fieldState.error} />
                )}
              />

              {/* Password */}
              {mode === "create" && (
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <AppInput
                      {...field}
                      type="password"
                      label="Password"
                      error={fieldState.error}
                    />
                  )}
                />
              )}

              {/* Role */}
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field, fieldState }) => (
                  <AppSelect
                    {...field}
                    label="Role"
                    options={roleOptions}
                    error={fieldState.error}
                  />
                )}
              />

              {/* Submit */}
              <Box textAlign="right" mt={3}>
                <AppButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {mode === "create" ? "Create User" : "Update User"}
                </AppButton>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
