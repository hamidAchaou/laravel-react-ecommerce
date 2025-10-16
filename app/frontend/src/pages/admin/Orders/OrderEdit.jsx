// src/pages/admin/Orders/OrderEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import OrderForm from "./OrderForm";
import { fetchOrderById, updateOrder } from "../../../features/orders/ordersThunks";

export default function OrderEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { currentOrder, loading } = useSelector((state) => state.orders || {});
  const [order, setOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentOrder) {
      setOrder({
        ...currentOrder,
        customer_id: currentOrder.customer_id || currentOrder.client?.id || "",
      });
    }
  }, [currentOrder]);

  if (loading || !order) return <div className="p-4 text-center animate-pulse">⏳ Loading order...</div>;

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateOrder({ id: order.id, data })).unwrap();
      enqueueSnackbar("✅ Order updated successfully!", { variant: "success" });
      navigate("/admin/orders");
    } catch (err) {
      enqueueSnackbar(err?.message || "❌ Failed to update order", { variant: "error" });
    }
  };

  return <OrderForm mode="edit" defaultValues={order} onSubmit={handleUpdate} />;
}
