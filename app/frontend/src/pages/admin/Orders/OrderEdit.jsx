// src/pages/admin/Orders/OrderEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import OrderForm from "./OrderForm";
import { updateOrder } from "../../../features/orders/ordersThunks";

export default function OrderEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { items: orders } = useSelector((state) => state.orders);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const found = orders.find((o) => o.id === parseInt(id));
    if (found) setOrder(found);
  }, [id, orders]);

  if (!order) return <div>Loading...</div>;

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateOrder({ id: order.id, data })).unwrap();
      enqueueSnackbar("Order updated successfully!", { variant: "success" });
      navigate("/admin/orders");
    } catch (err) {
      enqueueSnackbar(err.message || "Failed to update order", { variant: "error" });
    }
  };

  return <OrderForm mode="edit" defaultValues={order} onSubmit={handleUpdate} />;
}
