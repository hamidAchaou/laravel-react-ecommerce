// src/pages/admin/Products/ProductCreate.jsx
import React from "react";
import ProductForm from "./ProductForm";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../features/products/productsThunks";

export default function ProductCreate() {
  const dispatch = useDispatch();

  const handleCreate = async (data) => {
    // Dispatch createProduct thunk
    await dispatch(createProduct(data));
  };

  return <ProductForm mode="create" onSubmit={handleCreate} />;
}
