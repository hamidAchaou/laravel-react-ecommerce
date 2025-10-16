// src/pages/admin/Orders/OrderForm.jsx
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardHeader,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  AppInput,
  AppSelect,
  AppTextarea,
  AppButton,
} from "../../../components/admin/ui";
import { fetchCustomers } from "../../../features/customers/customersThunks";
import { fetchProducts } from "../../../features/products/productsThunks";

export default function OrderForm({ mode = "create", defaultValues = {}, onSubmit }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { items: customers = [] } = useSelector((state) => state.customers || {});
  const { items: products = [] } = useSelector((state) => state.products || {});

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      customer_id: defaultValues.customer_id || "",
      product_id: defaultValues.product_id || "",
      quantity: defaultValues.quantity ?? 1,
      total_price: defaultValues.total_price ?? 0,
      status: defaultValues.status || "pending",
      notes: defaultValues.notes || "",
    },
  });

  const quantity = watch("quantity");
  const selectedProduct = products.find((p) => p.id === Number(watch("product_id")));

  useEffect(() => {
    if (!customers.length) dispatch(fetchCustomers());
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, customers.length, products.length]);

  // Auto-calculate total price
  useEffect(() => {
    if (selectedProduct) {
      setValue("total_price", (selectedProduct.price || 0) * quantity);
    }
  }, [selectedProduct, quantity, setValue]);

  const submitForm = async (data) => {
    try {
      await onSubmit(data);
    } catch (err) {
      enqueueSnackbar(err.message || "Submission failed", { variant: "error" });
    }
  };

  const customerOptions = customers.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  const productOptions = products.map((p) => ({
    value: p.id.toString(),
    label: `${p.title} - ${p.price} MAD`,
  }));

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

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
              {mode === "create" ? "Create New Order" : "Edit Order"}
            </Typography>
          }
          subheader="Fill in order details carefully"
        />

        <CardContent>
          <form onSubmit={handleSubmit(submitForm)}>
            <Stack spacing={3}>
              {/* Customer */}
              <Controller
                name="customer_id"
                control={control}
                rules={{ required: "Customer is required" }}
                render={({ field, fieldState }) => (
                  <AppSelect
                    {...field}
                    label="Customer"
                    options={customerOptions}
                    error={fieldState.error}
                  />
                )}
              />

              {/* Product */}
              <Controller
                name="product_id"
                control={control}
                rules={{ required: "Product is required" }}
                render={({ field, fieldState }) => (
                  <AppSelect
                    {...field}
                    label="Product"
                    options={productOptions}
                    error={fieldState.error}
                  />
                )}
              />

              {/* Quantity */}
              <Controller
                name="quantity"
                control={control}
                rules={{
                  required: "Quantity is required",
                  min: { value: 1, message: "Must be at least 1" },
                }}
                render={({ field, fieldState }) => (
                  <AppInput
                    {...field}
                    type="number"
                    label="Quantity"
                    error={fieldState.error}
                    inputProps={{ min: 1 }}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />

              {/* Total */}
              <Controller
                name="total_price"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Total Price (MAD)"
                    type="number"
                    disabled
                    value={field.value ?? 0}
                  />
                )}
              />

              {/* Status */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    label="Order Status"
                    options={statusOptions}
                  />
                )}
              />

              {/* Notes */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <AppTextarea {...field} label="Notes (optional)" rows={3} />
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
                  {mode === "create" ? "Create Order" : "Update Order"}
                </AppButton>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
